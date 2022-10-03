const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv").config();

// Middlewares
app.use(express.json()); // JSON parser
app.use(morgan("tiny")); // HTTP logger

// Collection Schema
const productSchema = mongoose.Schema({
  name: String,
  price: Number,
});
// Model from schema
const Product = mongoose.model("Product", productSchema);

// USING ASYNC AWAIT
app.get("/", async (req, res) => {
  // Get all products
  const products = await Product.find();
  return res.status(200).json(products);
});

// USING THEN CATCH
app.post("/", (req, res) => {
  // Create new item at product collection
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
  });
  // Save to database
  product
    .save()
    .then((data) => res.status(200).json(data))
    .catch((err) => res.status(500).json(err));

  return;
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connected ...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`API running on port ${process.env.PORT}`);
});
