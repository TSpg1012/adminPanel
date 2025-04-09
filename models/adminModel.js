const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
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
    role: {
      type: String,
      default: "admin",
    },
  },
  {
    collection: "Admins",
  }
);

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
