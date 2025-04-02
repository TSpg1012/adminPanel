const mongoose = require("mongoose");

const studentSchema = mongoose.Schema(
  {
    name: String,
    age: Number,
    password: String,
    id: Number,
  },
  {
    collection: "Students",
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
