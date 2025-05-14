const Bonus = require("../models/bonusModel");
const Teacher = require("../models/teacherModel");
const Stimulation = require("../models/stimulationModel");

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
  const { teacherId, amount, comment, fullname } = req.body;

  try {
    const bonus = new Bonus({ teacherId, amount, comment, fullname });
    await bonus.save();

    await Stimulation.findOneAndUpdate(
      { teacherId },
      { $addToSet: { bonuses: bonus._id } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Bonus added", bonus });
  } catch (err) {
    console.error("Error adding bonus:", err);
    res.status(500).send("Server error");
  }
};

const deleteBonus = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBonus = await Bonus.findOneAndDelete({ teacherId: id });

    if (!deletedBonus) {
      return res.status(404).send("Bonus not found");
    }

    await Stimulation.findOneAndDelete(
      { teacherId: deletedBonus.teacherId },
      { $pull: { bonuses: deletedBonus._id } }
    );
    
    res.status(200).json({ message: "Bonus deleted" });
  } catch (err) {
    console.error("Error deleting bonus:", err);
    res.status(500).send("Server error");
  }
};

const editBonus = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBonus = await Bonus.findOneAndUpdate(
      { teacherId: id },
      req.body,
      { new: true }
    );

    if (!updatedBonus) {
      return res.status(404).send("Bonus not found");
    }

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
