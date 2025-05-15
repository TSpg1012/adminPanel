const mongoose = require("mongoose");
const Salary = require("../models/salaryModel");

const getSalaries = async (req, res) => {
  try {
    const { startDate, endDate, teacherName } = req.query;

    const filter = {};

    if (teacherName) {
      filter.teacherName = { $regex: teacherName, $options: "i" };
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const salaries = await Salary.find(filter);
    res.status(200).send(salaries);
  } catch (err) {
    res
      .status(500)
      .send({ message: "Error fetching salaries", error: err.message });
  }
};

module.exports = { getSalaries };
