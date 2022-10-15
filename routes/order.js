const router = require("express").Router();
const Order = require("../models/order");
const OrderItem = require("../models/order-item");

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders) return res.status(404).json({ message: "No orders found" });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    //  Create each OrderItems first with map() loop,
    //  then set as value on Order.orderItems

    // Each async-await operation returns a multiple promise
    // We nneed to combine promises as one with Promise.all() to return only one
    // This returns na promise not actual array of OrderItems
    const orderItems = Promise.all(
      req.body.orderItems.map(async (item) => {
        let newOrderItem = new OrderItem({
          quantity: item.quantity,
          product: item.product,
        });

        newOrderItem = await newOrderItem.save();
        console.log(typeof newOrderItem._id);
        // Return only id to be save on array
        return newOrderItem._id;
      })
    );

    // Resolves the promise above by waiting
    const orderItemsResolved = await orderItems;
    console.log(orderItemsResolved);
    let order = new Order({
      orderItems: orderItemsResolved,
      shippingAddress: req.body.shippingAddress,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      shippingStatus: req.body.status,
      totalPrice: req.body.totalPrice,
      user: req.body.user,
    });

    order = await order.save();

    if (!order) return res.status(404).json({ message: "No order created" });

    return res.json(order);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
