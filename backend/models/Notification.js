const mongoose = require("mongoose");

// In-app acknowledgements — always written regardless of whether email/SMS
// succeed, so the user has a reliable record even if external channels fail
// or aren't configured.
const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedIssue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.date = new Date(ret.createdAt).toLocaleString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
