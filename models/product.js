const mongoose = require("mongoose");

//  Collection Schema
const productSchema = mongoose.Schema({
  name: String,
  price: Number,
});

// Model from schema
module.exports = mongoose.model("Product", productSchema);
