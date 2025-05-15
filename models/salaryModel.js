const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
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
      default: 0,
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
      type: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          amount: {
            type: Number,
          },
          date: {
            type: Date,
            default: Date.now,
          },
          comment: {
            type: String,
          },
        },
      ],
      default: [],
    },
    fine: {
      type: [
        {
          _id: mongoose.Schema.Types.ObjectId,
          amount: {
            type: Number,
          },
          date: {
            type: Date,
            default: Date.now,
          },
          comment: {
            type: String,
          },
        },
      ],
      default: [],
    },
  },
  {
    collection: "Salary",
    timestamps: true,
  }
);

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
