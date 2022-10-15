const router = require("express").Router();
const Order = require("../models/order");
const OrderItem = require("../models/order-item");

router.get("/", async (req, res) => {
  try {
    //.populate("user", ["name", "email"] = populate and return only selected fields
    // .sort("dateOrdered") = sort old to new by default,
    // .sort({"dateOrdered": -1}); = sort new to old
    const orders = await Order.find()
      .populate("user", ["name", "email"])
      .sort({ dateOrdered: -1 });

    if (!orders) return res.status(404).json({ message: "No orders found" });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    //.populate("user", ["name", "email"] = populate and return only selected fields
    // .populate({ path: "orderItems", populate: "product" }) (path: field to populate) (populate: sub populate the result)
    //     population sequence : order => orderItems => products
    // .sort("dateOrdered") = sort old to new by default,
    // .sort({"dateOrdered": -1}); = sort new to old
    const order = await Order.findById(req.params.id)
      .populate({ path: "orderItems", populate: "product" })
      .populate("user", ["name", "email"]);

    if (!order) return res.status(404).json({ message: "No order found" });

    return res.json(order);
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
