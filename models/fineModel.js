const mongoose = require("mongoose");

const fineSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    type: {
      type: String,
      enum: ["Late", "Discipline", "Low Performance", "Absence", "Other"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "Fine",
    timestamps: true,
  }
);

const Fine = mongoose.model("Fine", fineSchema);

module.exports = Fine;
