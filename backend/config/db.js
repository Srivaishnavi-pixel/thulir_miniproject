const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:adminelvina12345@cluster0.opo6bo6.mongodb.net/thulir");
        console.log("MongoDB Connected");
    } catch (err) {
        console.log("Error:", err);
    }
};

module.exports = connectDB;