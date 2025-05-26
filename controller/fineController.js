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
  const id = req.params.id;
  const updates = req.body;

  try {
    const currentFine = await Fine.findById(id);

    if (!currentFine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    const updatedFine = await Fine.findByIdAndUpdate(id, updates, {
      new: true,
    });

    const salary = await Salary.findById(currentFine.teacherId);

    if (!salary) {
      return res.status(404).send("Salary record not found");
    }

    const fineIndex = salary.fine.findIndex((b) => b._id.toString() === id);

    if (fineIndex === -1) {
      return res.status(404).send("Fine not found in salary record");
    }

    const amountDiff = currentFine.amount - updatedFine.amount;

    salary.fine[fineIndex] = {
      _id: updatedFine._id,
      amount: updatedFine.amount,
      comment: updatedFine.comment,
      date: updatedFine.date,
    };

    salary.totalSalary = (salary.totalSalary || 0) + amountDiff;

    await salary.save();

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
    const { fullname, startDate, endDate, fineType } = req.query;

    let searchCriteria = {};

    if (fullname) {
      filter.fullname = { $regex: fullname, $options: "i" };
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (fineType) {
      searchCriteria.type = fineType;
    }

    const fines = await Fine.find(searchCriteria).sort({ date: 1 });

    return res.status(200).json(fines);
  } catch (err) {
    console.error("Error retrieving fines:", err);
    return res.status(500).send("Server error");
  }
};

const deleteFine = async (req, res) => {
  const id = req.params.id;
  try {
    const fine = await Fine.findOneAndDelete({ _id: id });

    if (!fine) {
      return res.status(404).json({ message: "Fine not found" });
    }

    await Salary.findByIdAndUpdate(fine.teacherId, {
      $pull: { fine: { _id: fine._id } },
      $inc: { totalSalary: +fine.amount },
    });

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
