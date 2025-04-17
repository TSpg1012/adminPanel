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

module.exports = {
    addClass,
};