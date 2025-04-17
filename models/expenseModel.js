const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Food",
        "Lease",
        "Repair",
        "Cleaning Supplies",
        "Office Supplies",
        "Taxes",
        "Equipment",
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
  { timestamps: true, collection: "Expense" }
);

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
