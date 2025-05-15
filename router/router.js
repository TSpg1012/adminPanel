let router = require("express").Router();

const studentController = require("../controller/studentController");
const teacherController = require("../controller/teacherController");
const userController = require("../controller/userController");
const adminController = require("../controller/adminController");
const classesController = require("../controller/classesController");
const bonusController = require("../controller/bonusController");
const fineController = require("../controller/fineController");
const lessonController = require("../controller/lessonController");
const notificationController = require("../controller/notificationController");
const salaryController = require("../controller/salaryController");

router.get("/students", studentController.getAllStudents);
router.post("/students/add", studentController.addStudent);
router.put("/students/update/:id", studentController.updateStudent);
router.delete("/students/delete/:id", studentController.deleteStudentById);

router.get("/teachers", teacherController.getAllTeachers);
router.post("/teachers/add", teacherController.addTeacher);
router.put("/teachers/update/:id", teacherController.updateTeacher);
router.delete("/teachers/delete/:id", teacherController.deleteTeacherById);

router.post("/login", userController.loginUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-code", userController.verifyResetCode);
router.post("/reset-password", userController.resetPassword);

router.post("/admin/addUser", adminController.addUser);
router.put("/admin/editUser/:id", adminController.editUser);
router.delete("/admin/deleteUser/:id", adminController.deleteUser);

router.get("/classes", classesController.getAllClasses);
router.post("/classes/add", classesController.addClass);
router.put("/classes/update/:id", classesController.updateClass);
router.delete("/classes/delete/:id", classesController.deleteClass);

router.get("/bonus", bonusController.getBonuses);
router.post("/bonus/:id", bonusController.addBonus);
router.delete("/bonus/:id", bonusController.deleteBonus);
router.put("/bonus/:id", bonusController.editBonus);

router.get("/fine", fineController.getAllFines);
router.post("/fine/:id", fineController.addFine);
router.put("/fine/:id", fineController.updateFine);
router.delete("/fine/:id", fineController.deleteFine);

router.get("/lesson", lessonController.getAllLessons);
router.post("/lesson", lessonController.addLesson);
router.put("/lesson/:id", lessonController.editLesson);
router.delete("/lesson/:id", lessonController.deleteLesson);

router.post("/notifications/add", notificationController.createNotification);
router.get("/notifications", notificationController.getNotifications);
router.delete(
  "/notifications/delete/:id",
  notificationController.deleteNotification
);
router.put(
  "/notifications/update/:id",
  notificationController.updateNotification
);

router.get("/salary", salaryController.getSalaries);

module.exports = router;
