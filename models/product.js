const mongoose = require("mongoose");

//  Collection Schema
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  richDescription: { type: String },
  image: { type: String, required: true },
  images: [{ type: String }], //Array of images
  brand: { type: String, default: "" },
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }, //points to Category Id
  stock: { type: Number, required: true, min: 0 }, // no negative
  rating: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  dateCreated: { type: Date, default: Date.now() },
});

// Model from Schema
module.exports = mongoose.model("Product", productSchema);
