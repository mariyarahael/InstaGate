const express = require("express");
const { register, login, logout, dashboard } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/login", (req, res) => res.render("login",{message:null}));
router.get("/register", (req, res) => res.render("register"));
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/dashboard", authenticateToken, dashboard);

// API Endpoints
router.post("/api/register", register);
router.post("/api/login", login);
router.post("/api/logout", logout);
router.get("/api/dashboard", authenticateToken, (req, res) => res.json({ message: "Welcome to dashboard" }));

module.exports = router;
