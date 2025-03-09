const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Get MongoDB URI from .env file
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Check if MongoDB URI is available
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the app if database connection fails
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

// Register a student
app.post("/register", async (req, res) => {
  try {
    const { fullName, studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password } = req.body;

    // Check if email already exists
    const existingStudent = await StudentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newStudent = new StudentModel({ fullName, studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password });
    await newStudent.save();
    
    res.status(201).json({ message: "✅ Student registered successfully!", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: "❌ Error registering student", details: error.message });
  }
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching students", details: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



/*const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Get MongoDB URI from .env file
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Check if MongoDB URI is available
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined. Check your .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the app if database connection fails
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

// Register a student
app.post("/register", async (req, res) => {
  try {
    const { fullName, studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password } = req.body;

    // Check if email already exists
    const existingStudent = await StudentModel.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newStudent = new StudentModel({ fullName, studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password });
    await newStudent.save();
    
    res.status(201).json({ message: "✅ Student registered successfully!", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: "❌ Error registering student", details: error.message });
  }
});

// Get all students
app.get("/students", async (req, res) => {
  try {
    const students = await StudentModel.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching students", details: error.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

*/

/*
var mongoUrl="mongodb+srv://instagate100820:MarNatIrin@cluster0.tbtgh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// var mongoUrl = '"mongodb://tfi-mfgbt.mongodb.net/test"'
var mongoose = require('mongoose')
// updated 2021
mongoose.Promise = global.Promise;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connect(mongoUrl, { useUnifiedTopology: true })
.then(() => { log('Connected to MongoDB: %s \n ', mongoUrl) }) 
.catch((err) => { error('MongoDB connection error: %s \n', err); })*/
