// Central "acknowledge the user" helper, used whenever a complaint is
// created or its status changes. Fans out across three channels:
//   1. In-app notification — always written, no external dependency, never fails
//   2. Email             — best-effort, only sent if user.email is present
//   3. SMS                - best-effort, only sent if user.phoneNumber is present
//
// Email and SMS are both non-throwing by design (see emailService.js /
// smsService.js), so a misconfigured or down provider never blocks the
// in-app notification or the calling HTTP request.

const Notification = require("../models/Notification");
const { sendEmail } = require("./emailService");
const { sendSMS } = require("./smsService");

/**
 * @param {object} params
 * @param {object} params.user - a User document (needs _id, fullName; email/phoneNumber optional)
 * @param {string} params.subject - used as the email subject line
 * @param {string} params.message - the acknowledgement text (used for in-app, email body, and SMS)
 * @param {string|mongoose.Types.ObjectId} [params.issueId] - related complaint, if any
 * @param {string} [params.actionUrl] - link to the relevant page in the app; if set, the
 *   email includes a clickable button/link that takes the user straight there
 * @param {string} [params.actionLabel] - text shown on the email button, e.g. "Track my complaint"
 */
async function notifyUser({ user, subject, message, issueId, actionUrl, actionLabel }) {
  if (!user) return;

  // 1. In-app notification (always attempted — this is the reliable channel)
  try {
    await Notification.create({
      user: user._id,
      message,
      relatedIssue: issueId || null,
    });
  } catch (error) {
    console.error("[Notification] Failed to save in-app notification:", error.message);
  }

  // 2. Email acknowledgement
  if (user.email) {
    await sendEmail(user.email, subject, message, { actionUrl, actionLabel });
  }

  // 3. SMS acknowledgement (only fires if a provider is actually configured)
  if (user.phoneNumber) {
    await sendSMS(user.phoneNumber, message);
  }
}

module.exports = { notifyUser };
