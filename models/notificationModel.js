const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    type: {
      type: String,
      enum: [
        "birthday",
        "classComplete",
        "examReminder",
        "adminMessage",
        "eventReminder",
        "absenceAlert",
        "newAssignment",
        "resultPosted",
        "teacher_added",  
        "student_added",
        "admin_added",
        "class_added",
        "class_update",
        "class_delete"
      ],
      required: true,
    },
    target: {
      type: String,
      enum: ["student", "teacher","admin", "all"],
      required: true,
    },
    message: {             
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Notification",
  }
);

notificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
