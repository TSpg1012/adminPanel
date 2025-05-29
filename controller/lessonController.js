const Lesson = require("../models/lessonModel");
const Teacher = require("../models/teacherModel");
const Classes = require("../models/classesModel");
const Salary = require("../models/salaryModel");
const Student = require("../models/studentModel");
const cron = require("node-cron");
// const moment = require("moment");
const moment = require("moment-timezone");

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

const date = new Date();
date.setFullYear(2025);
date.setMonth(4);
date.setDate(26);
date.setHours(5, 0, 0, 0);

// console.log(date.toString());

//0 0 * * 1
//* * * * *
cron.schedule("0 0 * * 1", async () => {
  console.log("salam");

  // const now = moment().tz("Asia/Baku");
  // console.log(now);

  try {
    //custom
    const lastWeekStart = moment(date)
      .subtract(1, "week")
      .startOf("isoWeek")
      .toDate();

    const lastWeekEnd = moment(date)
      .subtract(1, "week")
      .endOf("isoWeek")
      .toDate();

    //dynamic
    // const lastWeekStart = now
    //   .clone()
    //   .subtract(1, "week")
    //   .startOf("isoWeek")
    //   .toDate();
    // const lastWeekEnd = now
    //   .clone()
    //   .subtract(1, "week")
    //   .endOf("isoWeek")
    //   .toDate();

    const salaries = await Salary.find({ lessonCount: { $gt: 0 } });

    for (const sal of salaries) {
      const teacherId = sal._id;
      let remainingLessons = sal.lessonCount;

      if (!teacherId || remainingLessons <= 0) continue;

      const lastWeekLessons = await Lesson.find({
        teacherId: teacherId,
        date: { $gte: lastWeekStart, $lte: lastWeekEnd },
        tableType: "main",
      }).sort({ date: 1 });

      for (const lesson of lastWeekLessons) {
        if (remainingLessons <= 0) break;

        const lessonDay = moment(lesson.date).isoWeekday();

        //custom
        const thisWeekDate = moment
          .tz(date, "Asia/Baku")
          .startOf("isoWeek")
          .add(lessonDay - 1, "days")
          .hour(4)
          .minute(0)
          .second(0)
          .millisecond(0)
          .toDate();

        //dynamic
        // const thisWeekDate = now
        //   .clone()
        //   .startOf("isoWeek")
        //   .add(lessonDay - 1, "days")
        //   .hour(4)
        //   .minute(0)
        //   .second(0)
        //   .millisecond(0)
        //   .toDate();

        const newLesson = new Lesson({
          classId: lesson.classId,
          teacherId: lesson.teacherId,
          teacherName: lesson.teacherName,
          date: thisWeekDate,
          className: lesson.className,
          time: lesson.time,
          teacherNote: "",
          tasks: "",
          status: "confirmed",
          tableId: lesson.tableId,
          students: lesson.students,
        });

        await newLesson.save();

        remainingLessons -= 1;
        const studentCount = lesson.students?.length || 0;

        await Salary.findByIdAndUpdate(lesson.teacherId, {
          $inc: {
            confirmed: 1,
            participantCount: studentCount,
            lessonCount: -1,
          },
        });
      }
    }

    console.log("Keçmiş həftənin dərsləri növbəti həftəyə kopyalandı.");
  } catch (error) {
    console.error("Cron xətası:", error);
  }
});

const addLesson = async (req, res) => {
  const { id } = req.params;
  const {
    teacherName,
    className,
    date,
    time,
    students,
    role,
    tableType,
    lessonCount,
  } = req.body;

  try {
    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to add lessons" });
    }

    const teacher = await Teacher.findOne({ _id: id });
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const weekday = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const tableId = getTableId(weekday, time);

    const studentIds = students.map((s) => s.studentId);

    const lesson = new Lesson({
      teacherId: teacher._id,
      teacherName: teacher.fullname,
      className: className,
      date,
      time,
      students,
      tableType,
      tableId,
      lessonCount,
      teacherNote: "",
      tasks: "",
    });

    await lesson.save();

    res.status(201).json({
      message: "Lesson added",
      lesson,
    });
  } catch (err) {
    console.error("Error adding lesson:", err);
    res.status(500).send("Server error");
  }
};

const editLesson = async (req, res) => {
  const { tableId, id } = req.params;
  const { role } = req.body;

  try {
    const lesson = await Lesson.findOne({ tableId: tableId, _id: id });

    if (!lesson) {
      return res.status(400).send("Lesson not found");
    }

    let updatedLesson;

    if (role === "admin") {
      let newTableId = lesson.tableId;

      if (req.body.date && req.body.time) {
        const weekday = new Date(req.body.date).toLocaleDateString("en-US", {
          weekday: "long",
        });
        newTableId = getTableId(weekday, req.body.time);
      }

      const updatedFields = {
        teacherName: req.body.teacherName || lesson.teacherName,
        className: req.body.className || lesson.className,
        students: req.body.students || lesson.students,
        date: req.body.date || lesson.date,
        time: req.body.time || lesson.time,
        lessonCount: req.body.lessonCount ?? lesson.lessonCount,
        tableId: newTableId,
      };

      if (["confirmed", "canceled", "unviewed"].includes(req.body.status)) {
        updatedFields.status = req.body.status;
      }

      updatedLesson = await Lesson.findOneAndUpdate(
        { tableId: tableId, _id: id },
        updatedFields,
        { new: true }
      );
    } else if (role === "teacher") {
      const updatedFields = {
        teacherNote: req.body.teacherNote || lesson.teacherNote,
        tasks: req.body.tasks || lesson.tasks,
      };

      if (["confirmed", "canceled"].includes(req.body.status)) {
        updatedFields.status = req.body.status;
      }

      updatedLesson = await Lesson.findOneAndUpdate(
        { tableId: tableId, _id: id },
        updatedFields,
        { new: true }
      );
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this lesson" });
    }

    const oldStatus = lesson.status;
    const newStatus = updatedLesson.status;

    if (newStatus && newStatus !== oldStatus) {
      const studentCount = updatedLesson.students?.length || 0;
      const updates = { $inc: {} };

      if (oldStatus === "confirmed") {
        updates.$inc.confirmed = -1;
        updates.$inc.participantCount = -studentCount;
        updates.$inc.lessonCount = 1;
      } else if (oldStatus === "canceled") {
        updates.$inc.canceled = -1;
      }

      if (newStatus === "confirmed") {
        if (oldStatus === "unviewed" || oldStatus === "canceled") {
          updates.$inc.lessonCount = -1;
        }
        updates.$inc.confirmed = (updates.$inc.confirmed || 0) + 1;
        updates.$inc.participantCount =
          (updates.$inc.participantCount || 0) + studentCount;
      } else if (newStatus === "canceled") {
        updates.$inc.canceled = (updates.$inc.canceled || 0) + 1;
      }

      await Salary.findByIdAndUpdate(updatedLesson.teacherId, updates, {
        new: true,
      });
    }

    return res.status(200).json({
      message: `Lesson updated by ${role}`,
      lesson: updatedLesson,
    });
  } catch (err) {
    console.error("Error editing lesson:", err);
    res.status(500).send("Server error");
  }
};

const deleteLesson = async (req, res) => {
  const { tableId, id } = req.params;
  const { role } = req.body;

  try {
    const lesson = await Lesson.findOne({ tableId: tableId, _id: id });

    if (!lesson) {
      return res.status(400).send("Lesson not found");
    }

    if (role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete lessons" });
    }

    const updates = {};

    if (lesson.status === "confirmed") {
      const studentCount = lesson.students?.length || 0;
      updates.confirmed = -1;
      updates.participantCount = -studentCount;
      updates.lessonCount = 1;
    } else if (lesson.status === "canceled") {
      updates.canceled = -1;
    }

    if (Object.keys(updates).length > 0) {
      await Salary.findByIdAndUpdate(
        lesson.teacherId,
        { $inc: updates },
        { new: true }
      );
    }

    await Lesson.deleteOne({ tableId: tableId, _id: id });

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

const getAvailableStudents = async (req, res) => {
  const { tableId, yearMonth } = req.query;

  try {
    const lessons = await Lesson.find({ tableId });
    const busyStudentIds = new Set();

    lessons.forEach((lesson) => {
      lesson.students.forEach((s) => {
        busyStudentIds.add(s.studentId.toString());
        // console.log(s.studentId.toString());
      });
    });

    const allStudents = await Student.find();

    // const availableStudents = await Student.find({
    //   _id: { $nin: Array.from(busyStudentIds) },
    // });

    const availableStudents = allStudents.map((student) => {
      return {
        ...student.toObject(),
        isBusy: busyStudentIds.has(student._id.toString()),
      };
    });

    res.status(200).json(availableStudents);
  } catch (err) {
    console.error("Error getting available students:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  addLesson,
  editLesson,
  deleteLesson,
  getAllLessons,
  getAvailableStudents,
};
