const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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

module.exports = { loginUser };
