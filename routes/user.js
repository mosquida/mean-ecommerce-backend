const router = require("express").Router();
const user = require("../models/user");
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select(["-password"]); //excludes passwords using "-"

    if (!users) return res.status(404).json({ message: "No users found" });

    return res.json(users);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(["-password"]);

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

module.exports = router;
