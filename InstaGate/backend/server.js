const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB with the 'test' database
mongoose.connect("mongodb+srv://instagate100820:MarNatIrin@cluster0.tbtgh.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define Schema & Model
const DataSchema = new mongoose.Schema({
  name: String,
  message: String,
});

const DataModel = mongoose.model("Student", DataSchema); // No need for collection name unless custom

// API Routes
app.get("/data", async (req, res) => {
  const data = await DataModel.find();
  res.json(data);
});

app.post("/data", async (req, res) => {
  const newData = new DataModel(req.body);
  await newData.save();
  res.json({ message: "Data saved!" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
