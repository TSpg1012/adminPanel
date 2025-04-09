const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
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
    role: {
      type: String,
      enum: ["admin", "student", "teacher"],
      required: true,
    },
  },
  {
    collection: "Users",
  }
);

module.exports = mongoose.model("User", userSchema);
