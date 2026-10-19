const mongoose = require("mongoose");

const STATUS_VALUES = [
  "Pending",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];

const issueSchema = new mongoose.Schema(
  {
    // Denormalized reporter name so the UI can show it directly without a populate() call
    user: {
      type: String,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    issue: {
      // this is the issue CATEGORY, e.g. "Roads & Potholes" (kept as `issue`
      // to match the field name the existing frontend already reads/writes)
      type: String,
      required: [true, "Category is required"],
    },
    icon: {
      type: String,
      default: "FaEllipsisH",
    },
    location: {
      // free-text landmark/address detail (e.g. "near bus stop, MG Road")
      type: String,
      required: [true, "Location is required"],
    },
    district: {
      type: String,
      required: [true, "District is required"],
    },
    mandal: {
      type: String,
      required: [true, "Mandal is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    additionalInfo: {
      type: String,
      default: "",
    },
    photos: [{ type: String }],
    status: {
      type: String,
      enum: STATUS_VALUES,
      default: "Pending",
    },
    lastUpdated: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

issueSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    ret.date = new Date(ret.createdAt).toLocaleString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Issue", issueSchema);
module.exports.STATUS_VALUES = STATUS_VALUES;
