const mongose = require("mongoose")

const studentSchema = mongoose.Schema(
    {
        name:String,
        age:Number,
        password:String
    },
    {
        collection: "Student",
    }
);

const Student = mongoose.model("Students",studentSchema);

module.export = Student;