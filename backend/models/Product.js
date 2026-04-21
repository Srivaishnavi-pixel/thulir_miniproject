const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    vendorId: String,
    name: String,
    category: String,
    quantity: Number,
    price: Number,
    image: String
});

module.exports = mongoose.model("Product", productSchema);