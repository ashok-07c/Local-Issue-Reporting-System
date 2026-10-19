// Sends acknowledgement emails via SMTP. Defaults to Gmail, but works with
// any standard SMTP provider (Outlook, Resend, Brevo, etc.) if you set the
// SMTP_HOST/SMTP_PORT/SMTP_SECURE overrides below.
//
// Required env vars (see .env.example):
//   EMAIL_USER          - the sending mailbox, e.g. yourapp@gmail.com
//   EMAIL_APP_PASSWORD  - a Gmail "App Password", NOT your normal password.
//                          Generate one at https://myaccount.google.com/apppasswords
//                          (requires 2-Step Verification to be turned on).
//
// Optional env vars:
//   EMAIL_ENABLED    - "false" to turn off email entirely (default: "true")
//   EMAIL_FROM_NAME  - display name shown to recipients (default: "Local Issue Reporter")
//   SMTP_HOST / SMTP_PORT / SMTP_SECURE - set these to use a non-Gmail provider
//
// Like smsService.js, this never throws — a missing/broken email setup
// should never break complaint creation or status updates.

// Fail fast if the SMTP server can't be reached (e.g. the host blocks
// outbound mail ports). Nodemailer's defaults are about 2 minutes.
const SMTP_TIMEOUTS = {
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
};

let transporter = null;
let triedInit = false;

function getTransporter() {
  if (triedInit) return transporter;
  triedInit = true;

  const { EMAIL_USER, EMAIL_APP_PASSWORD, SMTP_HOST, SMTP_PORT, SMTP_SECURE } = process.env;
  if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
    return null;
  }

  try {
    // Lazy-required so the app still boots if the `nodemailer` package
    // hasn't been installed yet (e.g. during local setup).
    const nodemailer = require("nodemailer");

    transporter = nodemailer.createTransport(
      SMTP_HOST
        ? {
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: SMTP_SECURE === "true",
            auth: { user: EMAIL_USER, pass: EMAIL_APP_PASSWORD },
            ...SMTP_TIMEOUTS,
          }
        : {
            service: "gmail",
            auth: { user: EMAIL_USER, pass: EMAIL_APP_PASSWORD },
            ...SMTP_TIMEOUTS,
          }
    );
  } catch (error) {
    console.warn(
      "[Email] Could not load the 'nodemailer' package. Run `npm install` in backend/. Error:",
      error.message,
    );
    transporter = null;
  }

  return transporter;
}

// Escapes text before it's dropped into HTML, so complaint titles/names
// with <, >, & etc. can't break the markup.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Wraps a plain-text message in a clean, formal HTML email layout.
 * If `actionUrl` is provided, a clickable button (plus a plain-text
 * fallback link) is included so the recipient can jump straight to the
 * relevant page in the app.
 */
function buildEmailHtml({ subject, message, actionUrl, actionLabel, fromName }) {
  // Preserve paragraph breaks from the plain-text message.
  const bodyHtml = escapeHtml(message)
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 16px;">${para.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  const button = actionUrl
    ? `
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr>
          <td style="border-radius:6px;background-color:#2563eb;">
            <a href="${escapeHtml(actionUrl)}"
               style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;
                      color:#ffffff;text-decoration:none;border-radius:6px;font-family:Arial,sans-serif;">
              ${escapeHtml(actionLabel || "View details")}
            </a>
          </td>
        </tr>
      </table>
      <p style="margin:0 0 16px;font-size:13px;color:#64748b;">
        Or copy and paste this link into your browser:<br/>
        <a href="${escapeHtml(actionUrl)}" style="color:#2563eb;">${escapeHtml(actionUrl)}</a>
      </p>`
    : "";

  return `
  <div style="background-color:#f1f5f9;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr>
        <td style="background-color:#0f172a;padding:20px 24px;">
          <span style="color:#ffffff;font-size:16px;font-weight:700;">${escapeHtml(fromName)}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 24px;">
          <h2 style="margin:0 0 16px;font-size:18px;color:#0f172a;">${escapeHtml(subject)}</h2>
          <div style="font-size:14px;line-height:1.6;color:#334155;">
            ${bodyHtml}
          </div>
          ${button}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">
            This is an automated message from ${escapeHtml(fromName)}. Please do not reply directly to this email.
          </p>
        </td>
      </tr>
    </table>
  </div>`;
}

/**
 * Sends an email. Never throws — always resolves with a result/status
 * object so callers can fire-and-forget without risking the actual HTTP
 * request failing because of an email provider issue.
 *
 * @param {string} toAddress
 * @param {string} subject
 * @param {string} message - plain-text body (also used as the text/plain part)
 * @param {object} [options]
 * @param {string} [options.actionUrl]   - if set, a "View details" button/link is added
 * @param {string} [options.actionLabel] - button text, defaults to "View details"
 */
async function sendEmail(toAddress, subject, message, options = {}) {
  const emailEnabled = (process.env.EMAIL_ENABLED || "true").toLowerCase() !== "false";
  if (!emailEnabled) {
    console.log(`[Email disabled] Would send to ${toAddress}: "${subject}"`);
    return { skipped: true, reason: "disabled" };
  }

  if (!toAddress) {
    console.warn("[Email] Skipped — no address to send to");
    return { skipped: true, reason: "no-address" };
  }

  const transport = getTransporter();
  const fromAddress = process.env.EMAIL_USER;
  const fromName = process.env.EMAIL_FROM_NAME || "Local Issue Reporter";

  if (!transport || !fromAddress) {
    console.log(`[Email not configured] Would send to ${toAddress}: "${subject}" — ${message}`);
    return { skipped: true, reason: "not-configured" };
  }

  const { actionUrl, actionLabel } = options;
  const textBody = actionUrl ? `${message}\n\nView details: ${actionUrl}` : message;
  const htmlBody = buildEmailHtml({ subject, message, actionUrl, actionLabel, fromName });

  try {
    const info = await transport.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: toAddress,
      subject,
      text: textBody,
      html: htmlBody,
    });
    console.log(`[Email sent] id=${info.messageId} to=${toAddress}`);
    return { messageId: info.messageId };
  } catch (error) {
    console.error(`[Email failed] to=${toAddress}:`, error.message);
    return { error: error.message };
  }
}

module.exports = { sendEmail };
