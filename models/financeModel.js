const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema(
  {
    income: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Income",
      },
    ],
    expense: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    profit: {
      type: Number,
      default: 0,
    },
    turnover: {
      type: Number,
      default: 0,
    },
    dateRange: {
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
  },
  {
    collection: "Finance",
    timestamps: true,
  }
);

const Finance = mongoose.model("Finance", financeSchema);
module.exports = Finance;
