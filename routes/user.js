const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); //excludes passwords using "-"

    if (!users) return res.status(404).json({ message: "No users found" });

    return res.json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
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
      apartment: req.body.apartment,
      street: req.body.street,
      city: req.body.city,
      zipcode: req.body.zipcode,
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

router.put("/:id", async (req, res) => {
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
        apartment: req.body.apartment,
        street: req.body.street,
        city: req.body.city,
        zipcode: req.body.zipcode,
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

module.exports = router;
