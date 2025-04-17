const mongoose = require("mongoose");

const stimulationSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    bonuses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bonus",
      },
    ],

    fines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fine",
      },
    ],
  },
  {
    collection: "Stimulation",
    timestamps: true,
  }
);

const Stimulation = mongoose.model("Stimulation", stimulationSchema);

module.exports = Stimulation;
