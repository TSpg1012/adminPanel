const mongoose = require("mongoose");

const bonusSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
    },

    fullname: {
      type: String,
      ref: "Teacher",
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
    collection: "Bonus",
    timestamps: true,
  }
);

const Bonus = mongoose.model("Bonus", bonusSchema);

module.exports = Bonus;
