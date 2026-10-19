const Notification = require("../models/Notification");

// @route  GET /api/notifications/my   (protected — logged in user's own notifications)
const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/notifications/mark-read   (protected — marks all of the user's notifications read)
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyNotifications, markAllAsRead };
