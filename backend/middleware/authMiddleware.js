const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const SECRET_KEY = process.env.JWT_SECRET_MINE;
    const authHeader = req.headers.authorization;
    
    console.log("🟡 Received Authorization Header:", authHeader); // ✅ Debugging log
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("🔴 No valid token provided");
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔍 Extracted Token:", token); // ✅ Debugging log

    try {
        const decoded = jwt.verify(token.trim(), SECRET_KEY);
        req.user = decoded; // Now req.user contains { userId, role, admno }
        
        console.log("✅ Decoded User:", req.user); // ✅ Debugging log
        console.log("📌 Admission Number:", req.user.admno);
        
        next();
    } catch (error) {
        console.log("❌ Error in catch block:", error.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = authenticateUser;

/*
const jwt = require("jsonwebtoken");


const authenticateUser = (req, res, next) => {
const SECRET_KEY = process.env.JWT_SECRET_MINE || "4d0275f9e2b1496d78817623bb1282a79faf99f0dbceb35363861c6bb97d963e";
    const authHeader = req.headers.authorization;
    console.log("🟡 Received Authorization Header:", authHeader); // ✅ Debugging log
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🔴 No valid token provided");
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

  const token = req.headers.authorization?.split(" ")[1];
  console.log("Extracted Token:", token); //✅ Debugging log


  try {
    const decoded = jwt.verify(token.replace("Bearer ", "").trim(), SECRET_KEY);
    req.user = decoded; // Now req.user contains { userId, role, admno }
    console.log("Decoded User:", req.user);//✅Debugging log
console.log("Admission number",req.user.admno);
    next();
  } catch (error) {
console.log("Error in catch block",error.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;

*/