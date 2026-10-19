const User = require("../models/User");
const Issue = require("../models/Issue");

// @route  GET /api/users   (protected — admin only)
//
// Scoping (mirrors getAllIssues): a scoped admin (mandal and/or district set
// on their account) doesn't see the full national user list — only users
// who have filed at least one complaint within that admin's area. This is
// derived from complaint history rather than a fixed "home mandal" on the
// user's profile, since a user can report issues from more than one area.
// A super admin (no district/mandal set) still sees every registered user.
const getAllUsers = async (req, res, next) => {
  try {
    let userFilter = { role: "user" };

    if (req.user.role === "admin" && (req.user.mandal || req.user.district)) {
      const issueFilter = req.user.mandal
        ? { district: req.user.district, mandal: req.user.mandal }
        : { district: req.user.district };

      const reporterIds = await Issue.distinct("reportedBy", issueFilter);
      userFilter._id = { $in: reporterIds };
    }

    const users = await User.find(userFilter).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/users/:id   (protected — admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.user.role === "admin" && (req.user.mandal || req.user.district)) {
      const issueFilter = req.user.mandal
        ? { district: req.user.district, mandal: req.user.mandal, reportedBy: user._id }
        : { district: req.user.district, reportedBy: user._id };
      const hasIssueInScope = await Issue.exists(issueFilter);
      if (!hasIssueInScope) {
        // This user has no complaint in this admin's area — treat as not
        // found rather than revealing that the account exists elsewhere.
        return res.status(404).json({ message: "User not found" });
      }
    }

    await user.deleteOne();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, deleteUser };
