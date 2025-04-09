const mongoose = require("mongoose")

const teacherSchema = mongoose.Schema(
    {
        id: Number,
        name: String,
        age: Number,
        fincode: String,
        mobile_number: Number,
        password: String,
    },
    {
        collection: "Teachers",
    }
);

const Teacher = mongoose.model("Teacher",teacherSchema);

module.exports = Teacher;



