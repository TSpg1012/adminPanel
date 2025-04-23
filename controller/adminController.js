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

module.exports = {
  addUser,
};
