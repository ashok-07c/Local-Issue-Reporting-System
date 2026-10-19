// Sends acknowledgement SMS messages to complaint owners via Twilio.
//
// Required env vars (see .env.example):
//   TWILIO_ACCOUNT_SID
//   TWILIO_AUTH_TOKEN
//   TWILIO_PHONE_NUMBER      - your Twilio "from" number, e.g. +15551234567
//
// Optional env vars:
//   SMS_ENABLED              - "false" to turn off SMS entirely (default: "true")
//   SMS_DEFAULT_COUNTRY_CODE - prefix used when a stored phone number has no
//                              country code, e.g. "+91" (default: "+91")
//
// If Twilio isn't configured, sendSMS() logs what *would* have been sent and
// resolves normally instead of throwing — a missing/invalid SMS setup should
// never break complaint creation or status updates.

let twilioClient = null;
let triedInit = false;

function getClient() {
  if (triedInit) return twilioClient;
  triedInit = true;

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return null;
  }

  try {
    // Lazy-required so the app still boots if the `twilio` package
    // hasn't been installed yet (e.g. during local setup).
    const twilio = require("twilio");
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  } catch (error) {
    console.warn(
      "[SMS] Could not load the 'twilio' package. Run `npm install` in backend/. Error:",
      error.message,
    );
    twilioClient = null;
  }

  return twilioClient;
}

// Best-effort normalization to E.164 format, which Twilio requires.
// Numbers already starting with "+" are trusted as-is (minus stray characters);
// anything else gets the default country code prefixed.
function normalizePhoneNumber(rawNumber) {
  if (!rawNumber) return null;

  const trimmed = String(rawNumber).trim();
  if (trimmed.startsWith("+")) {
    return `+${trimmed.slice(1).replace(/\D/g, "")}`;
  }

  const digitsOnly = trimmed.replace(/\D/g, "");
  if (!digitsOnly) return null;

  const defaultCountryCode = process.env.SMS_DEFAULT_COUNTRY_CODE || "+91";
  return `${defaultCountryCode}${digitsOnly}`;
}

/**
 * Sends an SMS. Never throws — always resolves with a result/status object
 * so callers (controllers) can fire-and-forget without risking the actual
 * HTTP request failing because of an SMS provider issue.
 */
async function sendSMS(rawToNumber, message) {
  const smsEnabled = (process.env.SMS_ENABLED || "true").toLowerCase() !== "false";
  if (!smsEnabled) {
    console.log(`[SMS disabled] Would send to ${rawToNumber}: "${message}"`);
    return { skipped: true, reason: "disabled" };
  }

  const to = normalizePhoneNumber(rawToNumber);
  if (!to) {
    console.warn("[SMS] Skipped — no valid phone number to send to");
    return { skipped: true, reason: "no-number" };
  }

  const from = process.env.TWILIO_PHONE_NUMBER;
  const client = getClient();

  if (!client || !from) {
    console.log(`[SMS not configured] Would send to ${to}: "${message}"`);
    return { skipped: true, reason: "not-configured" };
  }

  try {
    const result = await client.messages.create({ body: message, from, to });
    console.log(`[SMS sent] sid=${result.sid} to=${to}`);
    return { sid: result.sid };
  } catch (error) {
    console.error(`[SMS failed] to=${to}:`, error.message);
    return { error: error.message };
  }
}

module.exports = { sendSMS, normalizePhoneNumber };
