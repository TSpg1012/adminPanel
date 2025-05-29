const Teacher = require("../models/teacherModel");

const getAllTeachers = async (req, res) => {
  try {
    const teacher = await Teacher.find({});
    res.status(200).send(teacher);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching teacher", error: error.message });
  }
};

const addTeacher = async (req, res) => {
  try {
    const newTeacher = new Teacher({
      id: req.body.id,
      fullname: req.body.fullname,
      age: req.body.age,
      fincode: req.body.fincode,
      mobile_number: req.body.mobile_number,
      password: req.body.password,
    });

    console.log(newTeacher);

    await newTeacher.save();
    res.status(201).send({ message: "User added successfully", newTeacher });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error adding user", error: error.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacherID = parseInt(req.params.id);
    const teacher = await Teacher.findOne({ id: teacherID });

    const updateTeacher = await Teacher.findOneAndUpdate(
      { _id: teacher._id },
      req.body,
      {
        new: true,
      }
    );
    if (!updateTeacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }
    res
      .status(200)
      .send({ message: "Teacher updated successfully", updateTeacher });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error updating teacher", error: error.message });
  }
};

const deleteTeacherById = async (req, res) => {
  try {
    const teacherID = parseInt(req.params.id);
    const teacher = await Teacher.findOne({ id: teacherID });
    if (!teacher) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    await Teacher.findByIdAndDelete({ _id: teacher._id });

    res.status(200).send({ message: "Teacher deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting teacher", error: error.message });
  }
};

module.exports = {
  getAllTeachers,
  addTeacher,
  updateTeacher,
  deleteTeacherById,
};