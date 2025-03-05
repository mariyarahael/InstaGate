const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = req.cookies.token || (authHeader && authHeader.split(" ")[1]);


    if (!token) {
        if (req.headers["content-type"] === "application/json") {
            return res.status(401).json({ message: "Access Denied" });
        }
        return res.redirect("/login");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (req.headers["content-type"] === "application/json") {
                return res.status(403).json({ message: "Invalid Token" });
            }
            return res.redirect("/login");
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
