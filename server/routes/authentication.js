//authentication.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const secretKey = require('../config');
const secretKey = "c6480460a2aa42ec51250b087614b3c8";

router.get("/api/authentication", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const token = authHeader.substring(7); // Remove the "Bearer " prefix from the authorization header

  console.log("Received Token:", token); // Add this line to verify the received token

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log("Token Verification Error:", err); // Add this line to log the token verification error
      return res.status(401).json({ error: "Invalid token" });
    }

    console.log("Decoded Token:", decoded); // Add this line to verify the decoded token

    const email = decoded.email;
    const logintype = decoded.logintype;

    res.json({ message: "Access granted", email, logintype });
  });
});

module.exports = router;
