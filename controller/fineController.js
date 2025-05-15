const Fine = require("../models/fineModel");
const Teacher = require("../models/teacherModel");
const Salary = require("../models/salaryModel");

const addFine = async (req, res) => {
  const { id } = req.params;
  const { type, amount, comment, fullname } = req.body;

  try {
    const salary = await Salary.findById(id);

    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    const fine = new Fine({
      teacherId: id,
      fullname,
      type: type.trim(),
      amount,
      comment,
    });

    await fine.save();

    salary.fine.push({
      _id: fine._id,
      amount: fine.amount,
      comment: fine.comment,
      date: fine.date,
    });

    salary.totalSalary = (salary.totalSalary || 0) - amount;

    await salary.save();

    return res.status(201).json({ message: "Fine created successfully", fine });
  } catch (err) {
    console.error("Error creating fine:", err);
    return res.status(500).send("Server error");
  }
};

const updateFine = async (req, res) => {
  try {
    const fineId = req.params.id;
    const fine = await Fine.findById(fineId);

    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    const updatedFine = await Fine.findByIdAndUpdate(fineId, req.body, {
      new: true,
    });

    return res
      .status(200)
      .json({ message: "Fine updated successfully", updatedFine });
  } catch (err) {
    console.error("Error updating fine:", err);
    return res.status(500).send("Server error");
  }
};

const getAllFines = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.query;

    let searchCriteria = {};

    if (name) {
      searchCriteria.fullname = {
        $regex: name,
        $options: "i",
      };
    }

    if (startDate || endDate) {
      searchCriteria.date = {};

      if (startDate) {
        searchCriteria.date.$gte = new Date(startDate);
      }

      if (endDate) {
        searchCriteria.date.$lte = new Date(endDate);
      }
    }

    const fines = await Fine.find(searchCriteria);

    return res.status(200).json(fines);
  } catch (err) {
    console.error("Error retrieving fines:", err);
    return res.status(500).send("Server error");
  }
};

const deleteFine = async (req, res) => {
  try {
    const fineId = req.params.id;
    const fine = await Fine.findById(fineId);

    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    await Fine.findByIdAndDelete(fineId);

    return res.status(200).json({ message: "Fine deleted successfully" });
  } catch (err) {
    console.error("Error deleting fine:", err);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  addFine,
  updateFine,
  getAllFines,
  deleteFine,
};
