let router = require("express").Router();

const studentController = require("../controller/studentController");
const teacherController = require("../controller/teacherController");
const userController = require("../controller/userController");
const adminController = require("../controller/adminController");
const classesController = require("../controller/classesController");

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

<<<<<<< HEAD
router.get("/classes", classesController.getAllClasses);
router.post("/classes/add",classesController.addClass);
router.put("/classes/update/:id",classesController.updateClass);
router.delete("/classes/delete/:id",classesController.deleteClass);
=======
router.post("/classes/add", classesController.addClass);
>>>>>>> a2256c5981ea749deadc1f9f6b28d5787d1b92b6

module.exports = router;
