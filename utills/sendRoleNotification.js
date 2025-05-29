const Notification = require("../models/notificationModel");

const sendRoleNotification = async (io, role, userId, fullname) => {
    const notificationMap = {
      teacher: {
        type: "teacher_added",
        target: "admin",
        message: `New teacher added : ${fullname}`,
      },
      student: {
        type: "student_added",
        target: "admin",
        message: `New student added: ${fullname}`,
      },
      admin: {
        type: "admin_added",
        target: "admin",
        message: `New Admin added: ${fullname}`,
      },
    };
  
    const config = notificationMap[role];
    if (!config) return;
  
    const notification = new Notification({
      type: config.type,
      target: config.target,
      message: config.message,
      isRead: false,
      userId,
    });
    await notification.save();
  
    io.emit("new-notification", {
      message: config.message,
      type: config.type,
      data: {
        id: userId,
        fullname,
        role,
      },
    });
  };

  module.exports = sendRoleNotification;