const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const Salary = require("../models/salaryModel");
const bcrypt = require("bcrypt");

// (async () => {
//   const mongoose = require("mongoose");
//   const Teacher = require("../models/teacherModel");

//   await Teacher.collection.dropIndex("id_1");
//   console.log("Index dropped!");
// })();

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

    console.log(newUser);

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
        _id: newUser._id,
      });
      await newTeacher.save();

      let totalSalary = 0;
      if (rest.salary.salaryType === "Monthly") {
        totalSalary = rest.salary.amount + (rest.bonus || 0);
      } else if (rest.salary.salaryType === "Hourly") {
        totalSalary =
          rest.salary.amount * (rest.confirmed || 0) + (rest.bonus || 0);
      } else if (rest.salary.salaryType === "Weakly") {
        const weeks = Math.ceil((rest.confirmed || 0) / 5);
        totalSalary = rest.salary.amount * weeks + (rest.bonus || 0);
      } else if (rest.salary.salaryType === "Yearly") {
        const months = Math.ceil((rest.confirmed || 0) / 20);
        totalSalary = (rest.salary.amount / 12) * months + (rest.bonus || 0);
      }

      const salaryDoc = new Salary({
        _id: newTeacher._id,
        teacherName: fullname,
        salary: rest.salary.amount,
        salaryType: rest.salary.salaryType,
        totalSalary: totalSalary,
        lessonCount: rest.lessonCount,
        bonus: [],
        fine: [],
      });

      salaryDoc.save();
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
  const id = req.params.id;
  const { role, ...updates } = req.body;

  try {
    let updated;
    const { ObjectId } = require("mongoose").Types;
    const filter = { _id: new ObjectId(id) };

    if (role === "admin") {
      updated = await Admin.findOneAndUpdate(filter, updates, {
        new: true,
        runValidators: true,
      });
    } else if (role === "student") {
      updated = await Student.findOneAndUpdate(filter, updates, {
        new: true,
        runValidators: true,
      });
    } else if (role === "teacher") {
      updated = await Teacher.findOneAndUpdate(filter, updates, {
        new: true,
        runValidators: true,
      });

      await Salary.findByIdAndUpdate(filter, updates, {
        new: true,
        runValidators: true,
      });

      if (updates.salary && updated) {
        const confirmed = updates.confirmed || 0;
        const bonus = updates.bonus || 0;
        const fine = updates.fine || 0;
        const salaryAmount = updates.salary.amount;
        const salaryType = updates.salary.salaryType;

        let totalSalary = 0;
        if (salaryType === "Monthly") {
          totalSalary = salaryAmount + bonus;
        } else if (salaryType === "Hourly") {
          totalSalary = salaryAmount * confirmed + bonus;
        } else if (salaryType === "Weekly") {
          const weeks = Math.ceil(confirmed / 5);
          totalSalary = salaryAmount * weeks + bonus;
        } else if (salaryType === "Yearly") {
          const months = Math.ceil(confirmed / 20);
          totalSalary = (salaryAmount / 12) * months + bonus;
        }
        await Salary.findOneAndUpdate(
          { _id: updated._id },
          {
            salary: salaryAmount,
            salaryType: salaryType,
            totalSalary: totalSalary,
          },
          { new: true, runValidators: true }
        );
      }
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
  const id = req.params.id;
  const { role } = req.body;
  const { ObjectId } = require("mongoose").Types;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    let deleted;
    const filter = { _id: new ObjectId(id) };

    if (role === "admin") {
      deleted = await Admin.findOneAndDelete(filter);
    } else if (role === "student") {
      deleted = await Student.findOneAndDelete(filter);
    } else if (role === "teacher") {
      deleted = await Teacher.findOneAndDelete(filter);

      if (deleted) {
        await Salary.findOneAndDelete({ _id: deleted._id });
      }
    } else {
      return res.status(400).send("Invalid role");
    }

    await User.findOneAndDelete(filter);

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
