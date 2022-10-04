const router = require("express").Router();
const Product = require("../models/product");
const Category = require("../models/category");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    if (!products)
      return res.status(404).json({ message: "No products found" });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    // .populate() = populates/displays data of specified field with id instead of objectId

    if (!product) return res.status(404).json({ message: "No product found" });

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    // Verify if category id exist
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Invalid category" });

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      rating: req.body.rating,
      isFeatured: req.body.isFeatured,
    });

    product = await product.save();

    if (!product)
      return res.status(500).json({ message: "Error saving product" });

    return res.json(product);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Invalid category" });

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );

    if (!product)
      return res.status(500).json({ message: "Product not updated" });

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product)
      return res.status(404).json({ message: "No product deleted" });

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
