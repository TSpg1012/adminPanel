const cron = require("node-cron");
const Teacher = require("../models/teacherModel");
const Notification = require("../models/notificationModel");

module.exports = (io) => {
  cron.schedule("* * * * *", async () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const birthdayTeachers = await Teacher.find();

    birthdayTeachers.forEach(async (teacher) => {
      const bday = new Date(teacher.birthday);

      if (bday.getDate() === day && bday.getMonth() + 1 === month) {
        const notification = new Notification({
          type: "birthday",
          target: "all",
          message: `It's teacher ${teacher.fullname}'s birthday today.!`,
          isRead: false,
          userId: teacher._id
        });
        await notification.save();

        io.emit("new-notification", {
          message: `It's teacher ${teacher.fullname}'s birthday today.!`,
          type: "birthday",
          data: teacher
        });
      }
    });
  });
};