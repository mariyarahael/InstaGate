const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://instagate100820:MarNatIrin@cluster0.tbtgh.mongodb.net/instagateDB?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Schema & Model
const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  studyYear: { type: String, required: true },
  department: { type: String, required: true },
  address: { type: String, required: true },
  hostelName: { type: String, required: true },
  hostelRoom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
});

const StudentModel = mongoose.model("Student", StudentSchema);

// API Routes
app.post("/register", async (req, res) => {
  try {
    const { fullName, studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password } = req.body;
    const newStudent = new StudentModel({ fullName, studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password });
    await newStudent.save();
    res.status(201).json({ message: "Student registered successfully!", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: "Error registering student", details: error.message });
  }
});

app.get("/students", async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));