const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },

    role: {
      type: String,
      enum: ["Teacher", "Student"],
      required: true,
    },

    type: {
      type: String,
      enum: ["TeacherToStudent", "TeacherToTeacher", "StudentToLesson"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Attended", "Not Attended", "N/A"],
      default: "N/A",
    },

    comment: {
      type: String,
      default: "",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Feedback",
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
