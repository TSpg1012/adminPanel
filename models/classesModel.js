const mongoose = require("mongoose");

const classesSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    classId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    collection: "Classes",
    timestamps: true,
  }
);

const Classes = mongoose.model("Classes", classesSchema);

module.exports = Classes;
