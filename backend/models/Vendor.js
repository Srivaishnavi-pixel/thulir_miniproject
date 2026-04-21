const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
    registrationId: String,
    name: String,
    email: String,
    password: String,
    state: String,
    address: String,
    mobile: String,
    certificate: String,
    photo: String
});

module.exports = mongoose.model("Vendor", vendorSchema);