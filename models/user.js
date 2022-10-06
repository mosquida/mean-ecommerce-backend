const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  apartment: { type: String, default: "" },
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  zipcode: { type: Number, default: "" },
  country: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
