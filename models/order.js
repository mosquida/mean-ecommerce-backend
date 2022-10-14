const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderItem",
      required: true,
    },
  ],
  shippingAddress: { type: String, default: "" },
  city: { type: String, default: "" },
  zip: { type: String, default: "" },
  country: { type: String, default: "" },
  phone: { type: String, default: "" },
  status: { type: String, default: "" },
  totalPrice: { type: Number },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shippingStatus: { type: String, default: "pending", required: true },
  dateOrdered: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Order", orderSchema);
