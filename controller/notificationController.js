const Notification = require("../models/notificationModel");

const createNotification = async (req, res) => {
  const { userId, type, target } = req.body;

  if (!type || !target) {
    return res.status(400).json({ message: "Type and target are required" });
  }

  try {
    const newNotification = new Notification({
      userId,
      type,
      target,
      readBy: [],
    });

    await newNotification.save();
    return res.status(201).json({ message: "Notification created successfully", newNotification });
  } catch (err) {
    console.error("Error creating notification:", err);
    return res.status(500).send("Server error");
  }
};

/*const getNotifications = async (req, res) => {
  try {
    const { target } = req.query;

    let searchCriteria = {};
    if (target) {
      searchCriteria.target = target;
    }

    const unreadNotifications = await Notification.find({
      ...searchCriteria,
      isRead: false
    }).sort({ createdAt: -1 });

    const readNotifications = await Notification.find({
      ...searchCriteria,
      isRead: true
    }).sort({ createdAt: -1 });

    const formattedNotifications = [{
      unread: unreadNotifications,
      read: readNotifications,
    }];

    res.status(200).json(formattedNotifications);

    if (unreadNotifications.length > 0) {
      const unreadIds = unreadNotifications.map(n => n._id);

      await Notification.updateMany(
        { _id: { $in: unreadIds } },
        { $set: { isRead: true } }
      );
    }
  } catch (err) {
    console.error("Error retrieving notifications:", err);
    res.status(500).send("Server error");
  }
};*/

const getNotifications = async (req, res) => {
  try {
    const { target } = req.query;

    let searchCriteria = {};
    if (target) {
      searchCriteria.target = target;
    }

    const unreadNotifications = await Notification.find({
      ...searchCriteria,
      isRead: false,
    }).sort({ createdAt: -1 });

    const readNotifications = await Notification.find({
      ...searchCriteria,
      isRead: true,
    }).sort({ createdAt: -1 });

    res.status(200).json([{ unread: unreadNotifications, read: readNotifications }]);
  } catch (err) {
    console.error("Error retrieving notifications:", err);
    res.status(500).send("Server error");
  }
};

const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { target } = req.body;

    if (!target) return res.status(400).json({ message: "Target is required" });

    await Notification.updateMany(
      { target, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).send("Server error");
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await Notification.findByIdAndDelete(notificationId);
    return res.status(200).json({ message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAllNotificationsAsRead,
  deleteNotification,
};