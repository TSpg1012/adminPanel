let router = require("express").Router();

const studentController = require("../controller/studentController");

router.get("/students", studentController.getAllStudents);
router.post("/students/add", studentController.addStudent);
router.put("/students/update/:id", studentController.updateStudent);
router.delete("/students/delete/:id", studentController.deleteStudentById);
router.delete("/students/deleteMe", studentController.addStudent);

module.exports = router;
