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
      isRead: false,
    });

    await newNotification.save();
    return res.status(201).json({ message: "Notification created successfully", newNotification });
  } catch (err) {
    console.error("Error creating notification:", err);
    return res.status(500).send("Server error");
  }
};

const getNotifications = async (req, res) => {
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
      current: unreadNotifications,
      previous: readNotifications,
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
};

const updateNotification = async (req, res) => {
  try {
    const notificationID = req.params.id;

    const existingNotification = await Notification.findById(notificationID);
    if (!existingNotification) {
      return res.status(404).send({ message: "Notification not found" });
    }

    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: existingNotification._id },
      req.body,
      { new: true }
    );

    res.status(200).send({
      message: "Notification updated successfully",
      updatedNotification,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating notification",
      error: err.message,
    });
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
  updateNotification,
  deleteNotification,
};