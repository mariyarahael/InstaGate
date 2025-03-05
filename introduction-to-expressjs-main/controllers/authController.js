const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });

        if (req.headers["content-type"] === "application/json") {
            return res.status(201).json({ message: "User registered successfully" });
        }

        res.redirect("/login");
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });
      
            if (!user || !(await bcrypt.compare(password, user.password))) {
                if (req.headers["content-type"] === "application/json") {
                return res.status(400).json({ message: "Invalid credentials" });
                }

                res.render("login", { message: "Login Error" });
            }

        

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        if (req.headers["content-type"] === "application/json") {
            return res.status(200).json({ message: "Login successful", token });
        }

        res.cookie("token", token, { httpOnly: true }).redirect("/dashboard");
    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
};

exports.logout = (req, res) => {
    res.clearCookie("token");

    if (req.headers["content-type"] === "application/json") {
        return res.status(200).json({ message: "Logout successful" });
    }

    res.redirect("/login");
};

exports.dashboard = async (req, res) => {
    if (req.headers["content-type"] === "application/json") {
        return res.status(200).json({ message: `Welcome ${req.user.username}` });
    }
    
    res.render("dashboard", { username: req.user.username });
};
