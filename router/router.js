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

router.post("/admin/addUser", adminController.addUser);

router.get("/classes", classesController.getAllClasses);
router.post("/classes/add",classesController.addClass);
router.put("/classes/update/:id",classesController.updateClass);
router.delete("/classes/delete/:id",classesController.deleteClass);

module.exports = router;
