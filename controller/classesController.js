const Classes = require("../models/classesModel");

const addClass = async(req,res)=>{
    const{className,classId} = req.body

    if (!className || className.trim() === "") {
        return res.status(400).json({ message: "Class name is required" });
    }

    if (!classId || classId.trim() === "") {
        return res.status(400).json({ message: "Class ID is required" });
    }

    try{
        const existingClass = await Classes.findOne({ className: className.trim() });

        if (existingClass) {
            return res.status(409).json({ message: "Class name already exists" });
        }

        const newClass = new Classes({
            className: className.trim(),
            classId: classId,
        });

        await newClass.save();
        return res
        .status(201)
        .json({ message: "Class created successfully", newClass});
    } catch (err) {
        console.error("Error creating user:", err);
        return res.status(500).send("Server error");
    }
}

const updateClass = async (req, res) => {
    try {
        const reqId = req.params.id;
        const classes = await Classes.findOne({ classId: reqId });

        if (!classes) {
            return res.status(404).json({ message: "Class not found" });
        }

        const updatedClass = await Classes.findOneAndUpdate(
            { _id: classes._id },
            req.body,
            { new: true }
        );

        return res.status(200).json({ message: "Class updated successfully", updatedClass });
    } catch (err) {
        console.error("Error updating class:", err);
        return res.status(500).send("Server error");
    }
};

const getAllClasses = async (req, res) => {
    try {
        const classes = await Classes.find();
        return res.status(200).json(classes);
    } catch (err) {
        console.error("Error retrieving classes:", err);
        return res.status(500).send("Server error");
    }
};

const deleteClass = async (req, res) => {
    try {
        const reqId = parseInt(req.params.id);
        const classes = await Classes.findOne({ classId: reqId });  
        

        if (!classes) {
            return res.status(404).json({ message: "Class not found" });
        }

        const deletedClass = await Classes.findOneAndDelete({ _id: classes._id });

        return res.status(200).json({ message: "Class deleted successfully" });
    } catch (err) {
        console.error("Error deleting class:", err);
        return res.status(500).send("Server error");
    }
};

module.exports = {
    addClass,
    updateClass,
    getAllClasses,
    deleteClass
}