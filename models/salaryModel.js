const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
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
    confirmed: {
      type: Number,
      default: 0,
    },
    canceled: {
      type: Number,
      default: 0,
    },
    participantCount: {
      type: Number,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    salaryType: {
      type: String,
      required: true,
    },
    totalSalary: {
      type: Number,
    },
    bonus: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "Salary",
  }
);

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
