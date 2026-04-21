const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* REGISTER */
router.post("/register", async (req, res) => {

    console.log("USER REGISTER API HIT"); // debug

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ message: "All fields required" });
    }

    res.json({ message: "User Registered" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.json({ message: "Wrong password" });
    }

    res.json({
    message: "Login Successful",
    id: user._id,        // ✅ MUST BE PRESENT
    name: user.name
});
});

module.exports = router;