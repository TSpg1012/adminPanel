const Fine = require("../models/fineModel")
const Teacher = require("../models/teacherModel");

const addFine = async (req, res) => {
  const { teacherId, type, amount, comment } = req.body;

  if (!teacherId) {
    return res.status(400).json({ message: "Teacher ID is required" });
  }

  if (!type || type.trim() === "") {
    return res.status(400).json({ message: "Fine type is required" });
  }

  if (!amount) {
    return res.status(400).json({ message: "Fine amount is required" });
  }

  try {
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const newFine = new Fine({
      teacherId,
      fullname: teacher.fullname, 
      type: type.trim(),
      amount,
      comment: comment ? comment.trim() : undefined,
    });

    await newFine.save();
    return res.status(201).json({ message: "Fine created successfully", newFine });
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

        const updatedFine = await Fine.findByIdAndUpdate(
            fineId,
            req.body,
            { new: true }
        );

        return res.status(200).json({ message: "Fine updated successfully", updatedFine });
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
          $options: "i" 
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
    deleteFine
};