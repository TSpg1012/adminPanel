const mongoose = require("mongoose");
const Student = require("../models/studentModel");

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.status(200).send(students);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching students", error: error.message });
  }
};

const addStudent = async (req, res) => {
  try {
    const newStudent = new Student({
      name: req.body.name,
      age: req.body.age,
      password: req.body.password,
      id: req.body.id,
    });

    await newStudent.save();
    res.status(201).send({ message: "User added successfully", newStudent });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding user", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentID = parseInt(req.params.id);
    const student = await Student.findOne({ id: studentID });

    const updatedStudent = await Student.findOneAndUpdate(
      { _id: student._id },
      req.body,
      {
        new: true,
      }
    );

    if (!updatedStudent) {
      return res.status(404).send({ message: "Student not found" });
    }

    res
      .status(200)
      .send({ message: "Student updated successfully", updatedStudent });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating student", error: error.message });
  }
};

const deleteStudentBySelf = async (req, res) => {};

const deleteStudentById = async (req, res) => {
  try {
    const studentID = parseInt(req.params.id);

    const student = await Student.findOne({ id: studentID });

    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }

    await Student.findByIdAndDelete({ _id: student._id });

    res.status(200).send({ message: "Student deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting student", error: error.message });
  }
};

module.exports = {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudentById,
};
