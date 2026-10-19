const fs = require("fs");
const path = require("path");
const Issue = require("../models/Issue");
const User = require("../models/User");
const { STATUS_VALUES } = require("../models/Issue");
const { notifyUser } = require("../services/notificationService");
const { isValidDistrict, isValidMandal } = require("../data/apLocations");

// Base URL of the deployed frontend, used to build direct links inside
// notification emails (e.g. "https://your-app.vercel.app/my-reports/<id>").
// Falls back to the local Vite dev server so links still work out of the box.
function getFrontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
}

// @route  POST /api/issues   (protected — logged in user)
const createIssue = async (req, res, next) => {
  try {
    const { title, issue, location, district, mandal, description, additionalInfo, icon } = req.body;

    if (!title || !issue || !location || !district || !mandal || !description) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    if (!isValidDistrict(district)) {
      return res.status(400).json({ message: "Please select a valid district" });
    }
    if (!isValidMandal(district, mandal)) {
      return res.status(400).json({ message: "Please select a valid mandal for that district" });
    }

    const photos = (req.files || []).map((file) => `/uploads/${file.filename}`);

    const newIssue = await Issue.create({
      user: req.user.fullName,
      reportedBy: req.user._id,
      title,
      issue,
      location,
      district,
      mandal,
      description,
      additionalInfo: additionalInfo || "",
      icon: icon || "FaEllipsisH",
      photos,
      status: "Pending",
    });

    // Automatic acknowledgement that the complaint was received —
    // in-app notification (always), plus email/SMS if configured.
    // Never blocks/fails the request.
    // Fire-and-forget: the complaint is already saved, so we reply to the
    // browser right away instead of waiting for SMTP/SMS (which can take
    // minutes to time out on hosts that block outbound mail ports).
    // notifyUser never throws; the .catch is just a safety net.
    notifyUser({
      user: req.user,
      subject: "We've received your complaint",
      message: `Dear ${req.user.fullName},\n\nThank you for bringing this to our attention. We have received your complaint titled "${newIssue.title}" (Reference #${newIssue._id}) and it is now under review. Its current status is "Pending".\n\nWe will notify you as soon as there is an update. We appreciate you taking the time to help improve our community.\n\nRegards,\nLocal Issue Reporter Team`,
      issueId: newIssue._id,
      actionUrl: `${getFrontendUrl()}/my-reports/${newIssue._id}`,
      actionLabel: "Track my complaint",
    }).catch((err) => console.error("[Notification] createIssue:", err.message));

    res.status(201).json(newIssue);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/issues/my   (protected — logged in user's own reports)
const getMyIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
};

// A regional/mandal admin must not be able to view/update/delete a
// complaint outside their scope just by knowing/guessing its ID — the list
// endpoint already filters this out, but direct-by-ID routes need their own
// check. Returns true for regular users and for super-admins (no district
// or mandal set), i.e. no restriction for them.
function isOutsideAdminDistrict(req, issue) {
  if (req.user.role !== "admin") return false;
  if (req.user.mandal) {
    return issue.district !== req.user.district || issue.mandal !== req.user.mandal;
  }
  if (req.user.district) {
    return issue.district !== req.user.district;
  }
  return false;
}

// @route  GET /api/issues/:id   (protected — any logged in user, used for "Track Progress")
const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue || isOutsideAdminDistrict(req, issue)) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json(issue);
  } catch (error) {
    // Invalid ObjectId format also lands here — treat it as "not found" for the user
    res.status(404).json({ message: "Complaint not found" });
  }
};

// @route  GET /api/issues   (protected — admin only) supports ?status= &category= &search= &district= &mandal=
//
// Scoping: an admin with `mandal` set only ever sees complaints from that
// exact mandal (within their district) — the most specific scope. An admin
// with only `district` set sees every mandal within that district. An admin
// with neither set is a super admin and sees every complaint everywhere.
// This is enforced here, server side — not just hidden in the UI — so a
// scoped admin can't page through complaints outside their area just by
// changing query params.
const getAllIssues = async (req, res, next) => {
  try {
    const { status, category, search, district, mandal } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.issue = category;
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { description: regex }, { location: regex }, { user: regex }];
    }

    if (req.user.mandal) {
      // Mandal-scoped admin — locked to their exact district + mandal.
      filter.district = req.user.district;
      filter.mandal = req.user.mandal;
    } else if (req.user.district) {
      // District-scoped admin — locked to their district, any mandal.
      filter.district = req.user.district;
    } else {
      // Super admin — optionally narrow via query params to spot-check an area.
      if (district) filter.district = district;
      if (mandal) filter.mandal = mandal;
    }

    const issues = await Issue.find(filter).sort({ createdAt: -1 });
    res.status(200).json(issues);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/issues/:id   (protected — admin only) update status
const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!STATUS_VALUES.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${STATUS_VALUES.join(", ")}` });
    }

    const existingIssue = await Issue.findById(req.params.id);
    if (!existingIssue || isOutsideAdminDistrict(req, existingIssue)) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status, lastUpdated: new Date().toLocaleString() },
      { new: true, runValidators: true }
    );

    // Automatic acknowledgement of the status change, sent to the
    // original reporter across in-app + email + SMS. "Rejected" (used
    // for complaints flagged as fake/invalid) gets its own clearer wording.
    const reporter = await User.findById(issue.reportedBy).select("phoneNumber fullName email");
    if (reporter) {
      const message =
        status === "Rejected"
          ? `Dear ${reporter.fullName},\n\nAfter reviewing your complaint titled "${issue.title}" (Reference #${issue._id}), we were unable to verify it and it has been marked as "Rejected".\n\nIf you believe this was a mistake, please get in touch with our support team and we'll be happy to take another look.\n\nRegards,\nLocal Issue Reporter Team`
          : `Dear ${reporter.fullName},\n\nWe wanted to let you know that the status of your complaint titled "${issue.title}" (Reference #${issue._id}) has been updated to "${status}".\n\nYou can view the full details and progress at any time using the link below. Thank you for your patience.\n\nRegards,\nLocal Issue Reporter Team`;

      // Not awaited — see note in createIssue. The admin's status change
      // should feel instant even if email delivery is slow.
      notifyUser({
        user: reporter,
        subject: status === "Rejected" ? "Update on your complaint" : `Your complaint status is now "${status}"`,
        message,
        issueId: issue._id,
        actionUrl: `${getFrontendUrl()}/my-reports/${issue._id}`,
        actionLabel: "View complaint details",
      }).catch((err) => console.error("[Notification] updateIssueStatus:", err.message));
    }

    res.status(200).json(issue);
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/issues/:id   (protected — admin only)
const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue || isOutsideAdminDistrict(req, issue)) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // best-effort cleanup of uploaded photo files
    (issue.photos || []).forEach((photoUrl) => {
      const filePath = path.join(__dirname, "..", photoUrl);
      fs.unlink(filePath, () => {}); // ignore errors — file may already be gone
    });

    await issue.deleteOne();
    res.status(200).json({ message: "Complaint deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIssue,
  getMyIssues,
  getIssueById,
  getAllIssues,
  updateIssueStatus,
  deleteIssue,
};
