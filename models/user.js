const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// Hash the password before saving
userSchema.pre("save", function (next) {
  // this, refers to the model itself
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Generate Salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // Hash Password with salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// Compare user password against hashed password
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);

    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
