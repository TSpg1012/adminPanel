const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Tuition Fees",
        "Property Sale",
        "Refund",
        "Salary",
        "Investment",
        "Bonus",
        "Other",
      ],
      required: true,
    },
    appointment: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true,
    collection: "Income"
   }
);

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;
