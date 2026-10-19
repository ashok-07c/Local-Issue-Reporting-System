const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMyNotifications, markAllAsRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/my", protect, getMyNotifications);
router.put("/mark-read", protect, markAllAsRead);

module.exports = router;
