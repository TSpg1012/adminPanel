const Lesson = require("../models/lessonModel");
const Teacher = require("../models/teacherModel");
const Classes = require("../models/classesModel");

function getTableId(weekday, timeSlot) {
  const weekdayMap = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  const timeSlotMap = {
    "10:00-11:30": 1,
    "11:30-13:00": 2,
    "13:00-14:30": 3,
    "14:30-16:00": 4,
    "16:00-17:30": 5,
    "17:30-19:00": 6,
  };

  const cleanedTime = timeSlot.replace("–", "-").trim();
  const row = "r" + timeSlotMap[cleanedTime];
  const col = "c" + weekdayMap[weekday];
  return row + col;
}

const addLesson = async (req, res) => {
  const { fullname, className, date, time, students, role, tableType } =
    req.body;

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

    const weekday = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const tableId = getTableId(weekday, time);

    const formattedStudents = students.map((s) => ({
      studentId: s.studentId,
      fullname: s.fullname,
    }));

    const existingLesson = await Lesson.findOne({ tableId, tableType });
    if (existingLesson) {
      return res
        .status(409)
        .json({ message: "This timeslot is already occupied." });
    }

    const lesson = new Lesson({
      teacherId: teacher._id,
      teacherName: teacher.fullname,
      classId: classDoc._id,
      className,
      date,
      time,
      students,
      tableType,
      tableId,
      teacherNote: "",
      tasks: "",
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
  const { role } = req.body;

  try {
    const lesson = await Lesson.findOne({ tableId: id });

    if (!lesson) {
      return res.status(400).send("Lesson not found");
    }

    if (role === "admin") {
      let newTableId = lesson.tableId;

      if (req.body.date && req.body.time) {
        const weekday = new Date(req.body.date).toLocaleDateString("en-US", {
          weekday: "long",
        });
        newTableId = getTableId(weekday, req.body.time);
      }

      const updatedLesson = await Lesson.findOneAndUpdate(
        { tableId: id },
        {
          teacherName: req.body.teacherName || lesson.teacherName,
          className: req.body.className || lesson.className,
          students: req.body.students || lesson.students,
          date: req.body.date || lesson.date,
          time: req.body.time || lesson.time,
          tableId: newTableId,
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Lesson updated by admin", lesson: updatedLesson });
    }

    if (role === "teacher") {
      const updatedLesson = await Lesson.findOneAndUpdate(
        { tableId: id },
        {
          teacherNote: req.body.teacherNote || lesson.teacherNote,
          tasks: req.body.tasks || lesson.tasks,
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ message: "Lesson updated by teacher", lesson: updatedLesson });
    }

    return res
      .status(403)
      .json({ message: "You are not authorized to edit this lesson" });
  } catch (err) {
    console.error("Error editing lesson:", err);
    res.status(500).send("Server error");
  }
};

const deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findOne({ tableId: id });

    if (!lesson) {
      return res.status(400).send("Lesson not found");
    }

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete lessons" });
    }

    await Lesson.deleteOne({ tableId: id });

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (err) {
    console.error("Error deleting lesson:", err);
    res.status(500).send("Server error");
  }
};

const getAllLessons = async (req, res) => {
  try {
    const { teacherName, studentName, status, startDate, endDate } = req.query;

    const filter = {};

    if (teacherName) {
      filter.teacherName = { $regex: teacherName, $options: "i" };
    }

    if (status && ["unviewed", "confirmed", "canceled"].includes(status)) {
      filter.status = status;
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    let lessons = await Lesson.find(filter);

    if (studentName) {
      lessons = lessons.filter((lesson) =>
        lesson.students.some((student) =>
          student.fullname.toLowerCase().includes(studentName.toLowerCase())
        )
      );
    }

    if (!lessons) {
      return res.status(404).json({ message: "No lessons found" });
    }

    return res.status(200).json(lessons);
  } catch (err) {
    console.error("Error fetching lessons:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addLesson,
  editLesson,
  deleteLesson,
  getAllLessons,
};
