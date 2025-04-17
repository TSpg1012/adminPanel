const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
    },
    fullname: {
      type: String,
      required: true,
    },
    gmail: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: Number,
      unique: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    FIN: {
      type: String,
      required: true,
      unique: true,
    },
    serieNumber: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      match: /^\+994\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/,
      required: true,
    },
    workExperience: {
      type: String,
      required: true,
    },
    maritalStatus: {
      type: String,
      enum: ["Married", "Single"],
      required: true,
    },
    department: {
      type: String,
      enum: ["AZ", "EN", "RU"],
      required: true,
    },
    salary: {
      amount: {
        type: Number,
        required: true,
      },
      salaryType: {
        type: String,
        enum: ["Monthly", "Hourly", "Weakly", "Yearly"],
        required: true,
      },
    },
    class: [
      {
        type: String,
      },
    ],
  },
  {
    collection: "Teachers",
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
