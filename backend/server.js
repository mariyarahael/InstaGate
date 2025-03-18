const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Load environment variables
dotenv.config();

const app = express();                  
app.use(express.json());
app.use(cors());

// Get MongoDB URI and JWT Secret Key from .env file
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.JWT_SECRET_MINE ; // Change this in production!

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
    process.exit(1);
  });





/* ======================== Define User Schemas ======================== */

// Student Schema
const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  admno:{type: String, required:true, unique:true},
  studyYear: { type: String, required: true },
  department: { type: String, required: true },
  address: { type: String, required: true },
  hostelName: { type: String, required: true },
  hostelRoom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true }, // Hashed Password
  role: { type: String, default: "student" } // Assigning Role
});
const StudentModel = mongoose.model("Student", StudentSchema);

// Parent Schema
const ParentSchema = new mongoose.Schema({
  parName: { type: String, required: true },
  childName: { type: String, required: true }, // Auto-filled from Student
  admno: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // ✅ Fix: Reference to Student
  childDep: { type: String, required: true }, // Auto-filled from Student
  addressp: { type: String, required: true },
  parRole: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "parent" }
});
const ParentModel = mongoose.model("Parent", ParentSchema);

// Warden Schema
const WardenSchema = new mongoose.Schema({
  warName: { type: String, required: true },
  warAddress: { type: String, required: true },
  hosNameWar: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Changed `emailw` to `email` for consistency
  phone: { type: String, required: true },
  password: { type: String, required: true }, // Hashed Password
  role: { type: String, default: "warden" } // Assigning Role
});
const WardenModel = mongoose.model("Warden", WardenSchema);

/* ======================== API Routes ======================== */

// 🔹 Register Student
app.post("/register", async (req, res) => {
  try {
    const { fullName, admno, studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password } = req.body;

    // Check if email already exists
    if (await StudentModel.findOne({ email })) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash password
    const newStudent = new StudentModel({ fullName, admno , studyYear, department, address, hostelName, hostelRoom, email, phoneNumber, password: hashedPassword });
    
    await newStudent.save();
    res.status(201).json({ message: "✅ Student registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error registering student", details: error.message });
  }
});

// 🔹 Register Parent

const registerParent = async (req, res) => {
  try {
    const { parName, admno, email, phone, password, addressp, parRole, childName, childDep } = req.body;

    // ✅ Check if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required for parent registration." });
    }

    // 1️⃣ Find the Student using `admno`
    const student = await StudentModel.findOne({ admno: admno });

    if (!student) {
      return res.status(400).json({ error: "No student found with this admission number." });
    }
   /*
    // 2️⃣ Check if parent-entered values match student data
    if (childName !== student.fullName) {
      return res.status(400).json({ error: "Child name does not match our records." });
    }

    if (childDep !== student.department) {
      return res.status(400).json({ error: "Child department does not match our records." });
    }
  */
 
    // 3️⃣ Use the Student's `_id` instead of `admno`
    const parent = new ParentModel({
      parName,
      childName: student.fullName, // Use actual student name
      admno: student._id, // Store Student's `_id`, not `admno`
      childDep: student.department, // Use actual student department
      addressp,
      parRole,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
    });

    await parent.save();
    res.status(201).json({ message: "Parent registered successfully!" });

  } catch (error) {
    res.status(500).json({ error: "❌ Error registering parent", details: error.message });
  }
};

// ✅ ADD THIS ROUTE
app.post("/register-parent", registerParent);

//const parent = await ParentModel.findOne({ email: "parent@example.com" }).populate("admno");
//console.log(parent);

/*
app.post("/register-parent", async (req, res) => {
  try {
    const { parName, admno, addressp, parRole, email, phone, password } = req.body;

    // ✅ Fix: Check if student exists with the given admno
    const student = await StudentModel.findOne({ admno });
    if (!student) {
      return res.status(404).json({ error: "❌ No student found with this admission number" });
    }

    // ✅ Fix: Check if parent email is already registered
     if (await ParentModel.findOne({ email })) {
        return res.status(400).json({ error: "❌ Email already registered" });
      }

    // ✅ Fix: Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newParent = new ParentModel({
      parName,
      childName: student.fullName, // Auto-fill from Student
      admno,
      childDep: student.department, // Auto-fill from Student
      addressp,
      parRole,
      email,
      phone,
      password: hashedPassword
    });

    await newParent.save();
    res.status(201).json({ message: "✅ Parent registered successfully!"});
  } catch (error) {
    console.log(req.body);
    res.status(500).json({ error: "❌ Error registering parent", details: error.message });
  }
});     */


// 🔹 Register Warden
app.post("/register-warden", async (req, res) => {
  try {
    const { warName, warAddress, hosNameWar, email, phone, password } = req.body;

    if (await WardenModel.findOne({ email })) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newWarden = new WardenModel({ warName, warAddress, hosNameWar, email, phone, password: hashedPassword });

    await newWarden.save();
    res.status(201).json({ message: "✅ Warden registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Error registering warden", details: error.message });
  }
});

// 🔹 Login Route (for all users)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user in all three collections
    const user = await StudentModel.findOne({ email }) ||
                 await ParentModel.findOne({ email }) ||
                 await WardenModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare password
    console.log("admno===="+user.admno);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token with role
    const token = jwt.sign({ userId: user._id, role: user.role , admno:user.admno}, SECRET_KEY, { expiresIn: "24h" });

    res.json({ message: "✅ Login successful!", token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "❌ Error logging in", details: error.message });
  }
});


const GatepassreqSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  requestDate: { type: Date, required: true, default: Date.now },
  requestTime: { type: String, required: true },
  passType: { type: String, required: true },
  reason: { type: String, required: true, trim: true },
  place: { type: String, required: true, trim: true },
  goingDate: { type: Date, required: true },
  goingTime: { type: String, required: true },
  returnDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected", "Pending Parent Approval"], default: "Pending Parent Approval" }
}, { timestamps: true });

const GatepassRequest = mongoose.model("GatepassRequest", GatepassreqSchema);

module.exports = GatepassRequest;

// API Routes




//authenticate route

const authenticateUser = require("./middleware/authMiddleware");

// gatepass
app.post("/reqgatepass", authenticateUser, async (req, res) => {
  try {
    const { requestDate, requestTime, passType, reason, place, goingDate, goingTime, returnDate } = req.body;
    const studentId = req.user.userId;  // Get logged-in student's ObjectId

    console.log("📌 Student ObjectId:", studentId);

    const student = await StudentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Find parent using studentId
    const parent = await ParentModel.findOne({ admno: student._id });
    if (!parent) {
      return res.status(404).json({ error: "Parent not found for this student" });
    }

    const newGatepass = new GatepassRequest({
      studentId: student._id,
      requestDate,
      requestTime,
      passType,
      reason,
      place,
      goingDate,
      goingTime,
      returnDate,
      status: "Pending Parent Approval"
    });

    await newGatepass.save();
    res.status(201).json({ message: "✅ Gate pass request sent to parent!", gatepassRequest: newGatepass });

  } catch (error) {
    res.status(500).json({ error: "❌ Error", details: error.message });
  }
});



/*
app.post("/reqgatepass", authenticateUser, async (req, res) => {
  try {
    const { requestDate, requestTime, passType, reason, place, goingDate, goingTime, returnDate } = req.body;
    const admno=req.user.admno;
    
    console.log("Received admno:", admno); // ✅ Log admno

    // ✅ Check if admno exists
    if (!admno) {
      return res.status(400).json({ error: "Admission number is required" });
    }

    // ✅ Find student using provided admno
    const student = await StudentModel.findOne({ admno });
    if (!student) {
      return res.status(404).json({ error: `Student with admno ${admno} not found` });
    }

    console.log("Student found:", student); // ✅ Log student info

    // ✅ Find the corresponding parent
    const parent = await ParentModel.findOne({ admno: student._id });
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    console.log("Parent found:", parent); // ✅ Log parent info

    // ✅ Create new gate pass request with parent reference
    const newGatepass = new GatepassRequest({
      studentId: student.admno,
      parentId: parent._id,
      requestDate,
      requestTime,
      passType,
      reason,
      place,
      goingDate,
      goingTime,
      returnDate,
      status: "Pending Parent Approval"
    });
    
    await newGatepass.save();
    res.status(201).json({ message: "✅ Gate pass request sent to parent!", gatepassRequest: newGatepass });
  } catch (error) {
    res.status(500).json({ error: "❌ Error", details: error.message });
  }
});

*/



// Get all reqs
app.get("/parent/requests", authenticateUser, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "parent") {
      return res.status(401).json({ error: "Unauthorized: Only parents can access requests" });
    }

    // Find parent details
    const parent = await ParentModel.findById(req.user.userId);
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    console.log("📢 Parent logged in:", parent.parName);
    
    // Find gate pass requests where studentId matches parent’s `admno`
    const requests = await GatepassRequest.find({ studentId: parent.admno })
      .populate("studentId", "fullName admno department")
      .sort({ createdAt: -1 });

    if (requests.length === 0) {
      return res.status(404).json({ error: "No gate pass requests found for your child." });
    }

    res.json(requests);
  } catch (error) {
    console.error("❌ Error fetching requests:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});






/*

app.get("/parent/requests", authenticateUser, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "parent") {
      return res.status(401).json({ error: "Unauthorized: Only parents can access requests" });
    }

   // ✅ Find the logged-in parent's details
   const parent = await ParentModel.findById(req.user.userId);
   if (!parent) {
       return res.status(404).json({ error: "Parent not found" });
   }

   console.log("===parent==="+parent.parName);
   // ✅ Find only requests belonging to this parent's child
   const requests = await GatepassRequest.find({ parentId: parent._id })
   .populate("studentId", "fullName admno department") // Fetch student details
   .sort({ createdAt: -1 }); // Sort by latest request

if (requests.length === 0) {
   return res.status(404).json({ error: "No pending gate pass requests found" });
}
console.log("pppppppppp=="+requests.place);
res.json(requests);
} catch (error) {
console.error("❌ Error fetching requests:", error);
res.status(500).json({ error: "Internal server error", details: error.message });
}

*/




/*
    // Fetch pending requests for the logged-in parent's child
    const requests = await GatepassRequest.find({ 
      parentId: req.user.userId, 
      status: "Pending Parent Approval" 
    }).populate("studentId");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching requests", details: error.message });
  }


  
});
*/

app.patch("/parent/respond/:id", authenticateUser, async (req, res) => {
  try {
    if (!req.user || req.user.role !== "parent") {
      return res.status(401).json({ error: "Unauthorized: Only parents can approve/reject requests" });
    }

    const { id } = req.params;
    const { approvalStatus } = req.body; // Expecting "approved" or "rejected"

    const gatepass = await GatepassRequest.findById(id);
    if (!gatepass) {
      return res.status(404).json({ error: "Gate pass request not found" });
    }

    if (gatepass.parentId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized: You cannot approve/reject this request" });
    }

    // Update the request status based on parent's response
    gatepass.status = approvalStatus === "approved" ? "Parent Approved" : "Rejected by Parent";
    await gatepass.save();

    // Notify the student about the decision
    const student = await StudentModel.findById(gatepass.studentId);
    if (student) {
      console.log(`📢 Notification to ${student.email}: Your gate pass request was ${gatepass.status}`);
    }

    res.json({ message: `✅ Request ${gatepass.status}`, gatepass });
  } catch (error) {
    res.status(500).json({ error: "❌ Error updating request", details: error.message });
  }
});



// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


/*

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





// Define Schema & Model for parent
const ParentSchema = new mongoose.Schema({
  parName: { type: String, required: true },
  childName: { type: String, required: true },
  childDep: { type: String, required: true },
  addressp: { type: String, required: true },
  parRole: { type: String, required: true },
  emailp: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  passwordp: { type: String, required: true },
});

const ParentModel = mongoose.model("Parent", ParentSchema);

// API Routes

// Register a parent

app.post("/register-parent", async (req, res) => {
  try {
    const { parName, childName, childDep , addressp , parRole , emailp, phone, passwordp } = req.body;

    // Check if email already exists
    const existingParent = await ParentModel.findOne({ emailp });
    if (existingParent) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newParent = new ParentModel({ parName, childName, childDep , addressp , parRole , emailp, phone, passwordp });
    await newParent.save();
    
    res.status(201).json({ message: "✅ Parent registered successfully!", parent: newParent });
  } catch (error) {
    res.status(500).json({ error: "❌ Error registering parent", details: error.message });
  }
});

// Get all parents
app.get("/parents", async (req, res) => {
  try {
    const parents = await ParentModel.find();
    res.json(parents);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching parents", details: error.message });
  }
});




// Define Schema & Model for warden
const WardenSchema = new mongoose.Schema({
  warName: { type: String, required: true },
  warAddress: { type: String, required: true },
  hosNameWar: { type: String, required: true },
  emailw: { type: String, required: true, unique: true },
  phonew: { type: String, required: true },
  passwordw: { type: String, required: true },
});

const WardenModel = mongoose.model("Warden", WardenSchema);

// API Routes

// Register a warden

app.post("/register-warden", async (req, res) => {
  try {
    const { warName, warAddress, hosNameWar, emailw, phonew, passwordw } = req.body;

    // Check if email already exists
    const existingWarden = await WardenModel.findOne({ emailw });
    if (existingWarden) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newWarden = new WardenModel({ warName, warAddress, hosNameWar, emailw, phonew, passwordw });
    await newWarden.save();
    
    res.status(201).json({ message: "✅ Warden registered successfully!", warden: newWarden });
  } catch (error) {
    res.status(500).json({ error: "❌ Error registering warden", details: error.message });
  }
});

// Get all wardens
app.get("/wardens", async (req, res) => {
  try {
    const wardens = await WardenModel.find();
    res.json(wardens);
  } catch (error) {
    res.status(500).json({ error: "❌ Error fetching wardens", details: error.message });
  }
});




*/