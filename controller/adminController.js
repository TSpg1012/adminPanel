const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  const { gmail, password, role, fullname, ...rest } = req.body;

  if (!role || !["admin", "student", "teacher"].includes(role)) {
    return res.status(400).send("Invalid role");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      return res.status(400).send("User with this Gmail already exists");
    }

    const newUser = new User({
      gmail,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    if (role === "admin") {
      if (!fullname) {
        return res.status(400).send("Fullname is required for admin");
      }

      const newAdmin = new Admin({
        fullname,
        gmail,
        password: hashedPassword,
        role,
        userId: newUser._id,
      });

      await newAdmin.save();
    }

    if (role === "student") {
      const newStudent = new Student({
        fullname,
        gmail,
        password: hashedPassword,
        ...rest,
        userId: newUser._id,
      });
      await newStudent.save();
    }

    if (role === "teacher") {
      const newTeacher = new Teacher({
        fullname,
        gmail,
        password: hashedPassword,
        ...rest,
        userId: newUser._id,
      });
      await newTeacher.save();
    }

    return res
      .status(201)
      .json({ message: "User created successfully", newUser });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).send("Server error");
  }
};

const editUser = async (req, res) => {
  const { id, role, ...updates } = req.body;

  try {
    let updated;

    const filter = { id: parseInt(id) };

    if (role === "admin") {
      updated = await Admin.findOneAndUpdate(filter, updates, { new: true });
    } else if (role === "student") {
      updated = await Student.findOneAndUpdate(filter, updates, { new: true });
    } else if (role === "teacher") {
      updated = await Teacher.findOneAndUpdate(filter, updates, { new: true });
    } else {
      return res.status(400).send("Invalid role");
    }

    if (!updated) return res.status(404).send("User not found");

    res.status(200).json({ message: "User updated", updated });
  } catch (err) {
    console.error("Error editing user:", err);
    res.status(500).send("Server error");
  }
};

const deleteUser = async (req, res) => {
  const { id, role } = req.body;

  try {
    let deleted;
    const filter = { id: parseInt(id) };

    if (role === "admin") {
      deleted = await Admin.findOneAndDelete(filter);
    } else if (role === "student") {
      deleted = await Student.findOneAndDelete(filter);
    } else if (role === "teacher") {
      deleted = await Teacher.findOneAndDelete(filter);
    } else {
      return res.status(400).send("Invalid role");
    }

    if (!deleted) return res.status(404).send("User not found");

    res.status(200).json({ message: "User deleted", deleted });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addUser,
  editUser,
  deleteUser,
};
