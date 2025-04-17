const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    birthday: {
      type: Date,
      required: true,
    },
    educational: {
      institutionNumber: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
    },
    mother: {
      name: {
        type: String,
        required: true,
      },
      mobileNumber: {
        type: String,
        match: /^\+994\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/,
        required: true,
      },
    },
    father: {
      name: {
        type: String,
        required: true,
      },
      mobileNumber: {
        type: String,
        match: /^\+994\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/,
        required: true,
      },
    },
    mobileNumber: {
      type: String,
      match: /^\+994\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      enum: ["AZ", "EN", "RU"],
      required: true,
    },
    class: [
      {
        type: String,
      },
    ],
  },
  {
    collection: "Students",
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
