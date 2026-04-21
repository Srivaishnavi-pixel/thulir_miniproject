const express = require("express");
const router = express.Router();

// 🧠 Store multiple trucks
// key = orderId
let locations = {};

// 📍 UPDATE LOCATION (farmer)
router.post("/update", (req, res) => {
    const { orderId, lat, lng } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: "orderId required" });
    }

    locations[orderId] = { lat, lng };

    res.json({ message: "Location updated" });
});

// 📍 GET LOCATION BY ORDER
router.get("/:orderId", (req, res) => {
    const { orderId } = req.params;

    const loc = locations[orderId];

    if (!loc) {
        return res.json({ lat: null, lng: null });
    }

    res.json(loc);
});

// 📍 (optional) get all trucks
router.get("/", (req, res) => {
    res.json(locations);
});

module.exports = router;