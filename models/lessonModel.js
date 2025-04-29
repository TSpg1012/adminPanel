const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    teacherNote: {
      type: String,
    },
    tasks: {
      type: String,
    },
    status: {
      type: String,
      enum: ["unviewed", "confirmed", "canceled"],
      default: "unviewed",
    },
    tableId: {
      type: String,
    },
    tableType: {
      type: String,
      enum: ["main", "current"],
      required: true,
    },
    students: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        fullname: {
          type: String,
        },
      },
    ],
  },
  {
    collection: "Lesson",
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
