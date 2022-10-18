const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/product");
const Category = require("../models/category");

const ACCEPTED_FILES = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// File Upload Configuration with unique file naming control
// https://www.npmjs.com/package/multer#diskstorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: function (req, file, cb) {
    // Returns extension
    const extension = ACCEPTED_FILES[file.mimetype];

    //cb(null) if extensions is not undefined
    let uploadErr = new Error("Invalid/unaccepted file type");
    if (extension) uploadErr = null;

    const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
    cb(uploadErr, file.fieldname + "_" + uniqueSuffix + `.${extension}`);
  },
});

// USE disk storage engine config defined above
const uploadOptions = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    // /api/v1/products?queryParameter=value
    // /api/v1/products?category=id1,id2   = multiple values
    let filter = {};
    if (req.query.category) {
      // split the query parameter value string into array
      filter = { category: req.query.category.split(",") };
    }

    // Fetch products by optional category query filter
    const products = await Product.find(filter).populate("category");

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

// uploadOptions.single('image') = uploads req.body.image
router.post("/", uploadOptions.single("image"), async (req, res) => {
  try {
    // Verify if category id exist
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Invalid category" });

    // If no imgae wa upload on frontend
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image uploaded" });

    // prettier-ignore
    // Full URL path of image
    const filename = `${req.protocol}://${req.get("host")}/public/uploads/${req.file.filename}}`;

    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: filename,
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

// Returns number of products
router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    if (!productCount)
      return res.status(404).json({ message: "No products found" });

    return res.json({ productCount });
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Returns list of featured products with optional limit
router.get("/get/featured/:count?", async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    // .find() filter = returns data from specified field to match criteria
    const featuredProducts = await Product.find({ isFeatured: true }).limit(
      parseInt(count)
    );

    if (!featuredProducts)
      return res.status(404).json({ message: "No products found" });

    return res.json(featuredProducts);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
