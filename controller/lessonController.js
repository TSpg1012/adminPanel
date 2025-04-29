const Lesson = require("../models/lessonModel");
const Teacher = require("../models/teacherModel");
const Classes = require("../models/classesModel");

// function getTableId(weekday, timeSlot) {
//     const weekdayMap = {
//       Monday: 1,
//       Tuesday: 2,
//       Wednesday: 3,
//       Thursday: 4,
//       Friday: 5,
//       Saturday: 6,
//       Sunday: 7,
//     };

//     const timeSlotMap = {
//       "10:00–11:30": 1,
//       "12:00–13:30": 2,
//       // etc...
//     };

//     const row = "r" + timeSlotMap[timeSlot];
//     const col = "c" + weekdayMap[weekday];
//     return row + col;
//   }

const Lesson = require("../models/lessonModel");
const Teacher = require("../models/teacherModel");
const Class = require("../models/classModel");

const addLesson = async (req, res) => {
  const { fullname, className, date, time, students, role } = req.body;

  try {
    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to add lessons" });
    }

    const teacher = await Teacher.findOne({ fullname: fullname });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const classDoc = await Classes.findOne({ className: className });
    if (!classDoc) {
      return res.status(404).json({ message: "Class not found" });
    }

    const lesson = new Lesson({
      teacherId: teacher._id,
      teacherName: teacher.fullname,
      classId: classDoc._id,
      className,
      date,
      time,
      students,
      tableType: "main",
    });

    await lesson.save();

    res.status(201).json({ message: "Lesson added", lesson });
  } catch (err) {
    console.error("Error adding lesson:", err);
    res.status(500).send("Server error");
  }
};

const editLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const updated = await Lesson.findOne()
    const updatedLesson = await Lesson.findOneAndUpdate(
      { tableId: id },
      req.body,
      { new: true }
    );

    if (!updatedLesson) {
      return res.statsu(400).send("Lesson not found");
    }
  } catch (err) {
    console.error("Error editing lesson:", err);
    res.status(500).send("Server error");
  }
};



module.exports = {
  addLesson,
};
