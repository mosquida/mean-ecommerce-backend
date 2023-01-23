const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../utils/auth");
const admin = require("../utils/admin");

router.get("/", [auth, admin], async (req, res) => {
  try {
    const users = await User.find().select("-password"); //excludes passwords using "-"

    if (!users) return res.status(404).json({ message: "No users found" });

    return res.json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", [auth], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "No user found" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Register New User
router.post("/", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      address: req.body.address,
      country: req.body.country,
      isAdmin: req.body.isAdmin,
    });

    user = await user.save();

    if (!user)
      return res.status(400).json({ message: "Unable to register user" });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  // Check if user user exist
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) return res.status(404).json({ message: "No user found" });

  // Verify Password
  if (user && (await user.comparePassword(req.body.password))) {
    //Create JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.json({ email: user.email, token: token });
  } else {
    return res.json({ message: "Invalid Password " });
  }
});

router.put("/:id", [auth], async (req, res) => {
  try {
    // Update User without required Password field
    const userExists = await User.findById(req.params.id);

    const newPass = req.body.password
      ? bcrypt.hashSync(req.body.password, 10)
      : userExists.password;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        password: newPass,
        phone: req.body.phone,
        address: req.body.address,
        country: req.body.country,
        isAdmin: req.body.isAdmin,
      },
      { new: true }
    );

    if (!user)
      return res.status(500).json({ message: "Unable to update user" });

    return res.json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    if (!userCount)
      return res.status(404).json({ message: "No userCount found" });

    return res.json({ userCount: userCount });
  } catch (error) {
    return res.status(500).json(err);
  }
});

router.delete("/:id", [auth, admin], async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) return res.status(404).json({ message: "No User deleted" });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
