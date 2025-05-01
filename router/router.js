let router = require("express").Router();

const studentController = require("../controller/studentController");
const teacherController = require("../controller/teacherController");
const userController = require("../controller/userController");
const adminController = require("../controller/adminController");
const classesController = require("../controller/classesController");
const bonusController = require("../controller/bonusController");
const fineController = require("../controller/fineController");
const lessonController = require("../controller/lessonController");

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
router.post("/admin/editUser", adminController.editUser);
router.post("/admin/deleteUser", adminController.deleteUser);

router.get("/classes", classesController.getAllClasses);
router.post("/classes/add", classesController.addClass);
router.put("/classes/update/:id", classesController.updateClass);
router.delete("/classes/delete/:id", classesController.deleteClass);

router.get("/bonus", bonusController.getBonuses);
router.post("/bonus", bonusController.addBonus);
router.delete("/bonus/:id", bonusController.deleteBonus);
router.put("/bonus/:id", bonusController.editBonus);

router.get("/fine/search", fineController.getAllFines);
router.post("/fine/add", fineController.addFine);
router.put("/fine/update/:id", fineController.updateFine);
router.delete("/fine/delete/:id", fineController.deleteFine);

router.get("/lesson", lessonController.getAllLessons);
router.post("/lesson", lessonController.addLesson);
router.put("/lesson/:id", lessonController.editLesson);
router.delete("/lesson/:id", lessonController.deleteLesson);

module.exports = router;
