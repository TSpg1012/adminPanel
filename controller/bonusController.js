const Bonus = require("../models/bonusModel");
const Teacher = require("../models/teacherModel");
const Stimulation = require("../models/stimulationModel");
const Salary = require("../models/salaryModel");

const getBonuses = async (req, res) => {
  const { fullname, startDate, endDate } = req.query;

  try {
    let filter = {};

    if (fullname) {
      filter.fullname = { $regex: fullname, $options: "i" };
    }

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const bonuses = await Bonus.find(filter).sort({ date: 1 });

    res.status(200).json(bonuses);
  } catch (err) {
    console.error("Error fetching bonuses:", err);
    res.status(500).send("Server error");
  }
};

const addBonus = async (req, res) => {
  const { id } = req.params;
  const { amount, comment, fullname } = req.body;

  try {
    const salary = await Salary.findById(id);
    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    const bonus = new Bonus({
      teacherId: id,
      amount,
      comment,
      fullname,
    });

    await bonus.save();

    salary.bonus.push({
      _id: bonus._id,
      amount: bonus.amount,
      comment: bonus.comment,
      date: bonus.date,
    });

    salary.totalSalary = (salary.totalSalary || 0) + amount;

    await salary.save();

    res.status(201).json({ message: "Bonus added", bonus });
  } catch (err) {
    console.error("Error adding bonus:", err);
    res.status(500).send("Server error");
  }
};

const deleteBonus = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBonus = await Bonus.findOneAndDelete({ _id: id });

    if (!deletedBonus) {
      return res.status(404).send("Bonus not found");
    }

    await Salary.findByIdAndUpdate(deletedBonus.teacherId, {
      $pull: { bonus: { _id: deletedBonus._id } },
      $inc: { totalSalary: -deletedBonus.amount },
    });

    res.status(200).json({ message: "Bonus deleted" });
  } catch (err) {
    console.error("Error deleting bonus:", err);
    res.status(500).send("Server error");
  }
};

const editBonus = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const currentBonus = await Bonus.findById(id);
    if (!currentBonus) {
      return res.status(404).send("Bonus not found");
    }

    const updatedBonus = await Bonus.findByIdAndUpdate(id, updates, {
      new: true,
    });

    const salary = await Salary.findById(currentBonus.teacherId);
    if (!salary) {
      return res.status(404).send("Salary record not found");
    }

    const bonusIndex = salary.bonus.findIndex((b) => b._id.toString() === id);

    if (bonusIndex === -1) {
      return res.status(404).send("Bonus not found in salary record");
    }

    const amountDiff = updatedBonus.amount - currentBonus.amount;

    salary.bonus[bonusIndex] = {
      _id: updatedBonus._id,
      amount: updatedBonus.amount,
      comment: updatedBonus.comment,
      date: updatedBonus.date,
    };

    salary.totalSalary = (salary.totalSalary || 0) + amountDiff;

    await salary.save();

    res.status(200).json({ message: "Bonus updated", updatedBonus });
  } catch (err) {
    console.error("Error editing bonus:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addBonus,
  editBonus,
  deleteBonus,
  getBonuses,
};

