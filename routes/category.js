const router = require("express").Router();
const Category = require("../models/category");
const auth = require("../utils/auth");
const admin = require("../utils/admin");

router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories)
      return res.status(404).json({ message: "No categories found" });

    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({ message: "No category found" });

    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", [auth, admin], async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon,
    });

    category = await category.save();

    if (!category)
      return res.status(404).json({ message: "No category created" });

    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put("/:id", [auth, admin], async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        color: req.body.color,
        icon: req.body.icon,
      },
      { new: true }
    );
    // {new: true}, returns the new updated data

    if (!category)
      return res.status(404).json({ message: "No category found" });

    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);

    if (!category)
      return res.status(404).json({ message: "No category deleted" });

    return res.json(category);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
