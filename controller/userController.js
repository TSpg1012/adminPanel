const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const sendResetCode = require("../utills/sendEmail");

const loginUser = async (req, res) => {
  const { gmail, password } = req.body;

  try {
    const user = await User.findOne({ gmail: gmail });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    if (user.role === "admin") {
      return res.status(200).send("Admin login successful");
    } else if (user.role === "student") {
      return res.status(200).send("Student login successful");
    } else if (user.role === "teacher") {
      return res.status(200).send("Teacher login successful");
    } else {
      return res.status(400).send("Invalid role");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error logging in");
  }
};

const forgotPassword = async (req, res) => {
  const { gmail } = req.body;

  try {
    const user = await User.findOne({ gmail });
    if (!user) return res.status(404).send("User not found");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expiry;
    await user.save();

    await sendResetCode(gmail, code);

    res.status(200).send("Reset code sent to email");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const verifyResetCode = async (req, res) => {
  const { gmail, code } = req.body;

  try {
    const user = await User.findOne({ gmail });

    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpires < Date.now()
    ) {
      return res.status(400).send("Invalid or expired code");
    }

    res.status(200).send("Code verified");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const resetPassword = async (req, res) => {
  const { gmail, code, newPassword } = req.body;

  try {
    const user = await User.findOne({ gmail });

    if (
      !user ||
      user.resetCode !== code ||
      user.resetCodeExpires < Date.now()
    ) {
      return res.status(400).send("Invalid or expired code");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;

    await user.save();

    res.status(200).send("Password reset successful");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { loginUser, forgotPassword, verifyResetCode, resetPassword };
