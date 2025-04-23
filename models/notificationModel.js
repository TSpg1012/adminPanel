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
      ],
      required: true,
    },
    message: {
      previous: { type: String },
      current: { type: String, required: true },
    },
    target: {
      type: String,
      enum: ["student", "teacher", "all"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    expireAt: {
      type: Date,
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
