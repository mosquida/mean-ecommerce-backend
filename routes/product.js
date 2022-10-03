const router = require("express").Router();
const Product = require("../models/product");

router.get("/", async (req, res) => {
  // Get all products
  const products = await Product.find();
  return res.status(200).json(products);
});

router.post("/", (req, res) => {
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

module.exports = router;
