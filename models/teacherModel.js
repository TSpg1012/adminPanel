const mongoose = require("mongoose");

const teacherSchema = mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      },
      salaryType: {
        type: String,
        enum: ["Monthly", "Hourly"],
      },
    },
    class: {
      type: [
        {
          name: {
            type: String,
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
          lessonCount: {
            type: Number,
            default: 0,
          },
        },
      ],
      default: [],
    },
  },
  {
    collection: "Teachers",
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

module.exports = Teacher;
