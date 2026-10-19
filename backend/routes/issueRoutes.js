const express = require("express");
const upload = require("../middleware/upload");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createIssue,
  getMyIssues,
  getIssueById,
  getAllIssues,
  updateIssueStatus,
  deleteIssue,
} = require("../controllers/issueController");

const router = express.Router();

// Order matters: specific paths before the generic "/:id" one
router.get("/my", protect, getMyIssues);
router.get("/", protect, adminOnly, getAllIssues);
router.post("/", protect, upload.array("photos", 3), createIssue);

router.get("/:id", protect, getIssueById);
router.put("/:id", protect, adminOnly, updateIssueStatus);
router.delete("/:id", protect, adminOnly, deleteIssue);

module.exports = router;
