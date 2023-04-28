const router = require("express").Router();
const Order = require("../models/order");
const Product = require("../models/product");
const OrderItem = require("../models/order-item");
const auth = require("../utils/auth");
const admin = require("../utils/admin");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.get("/", [auth], async (req, res) => {
  try {
    //.populate("user", ["name", "email"] = populate and return only selected fields
    // .sort("dateOrdered") = sort old to new by default,
    // .sort({"dateOrdered": -1}); = sort new to old
    const orders = await Order.find()
      .populate("user", ["name", "email", "phone"])
      .sort({ dateOrdered: -1 });

    if (!orders) return res.status(404).json({ message: "No orders found" });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/:id", [auth], async (req, res) => {
  try {
    //.populate("user", ["name", "email"] = populate and return only selected fields
    // .populate({ path: "orderItems", populate: "product" }) (path: field to populate) (populate: sub populate the result)
    //     population sequence : order => orderItems => products
    // when need to 3 populate
    //     .populate({ path: "orderItems", populate: {path: "produc:"", populate: "category"} })
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

router.post("/", [auth], async (req, res) => {
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
        // Return only id to be save on array
        return newOrderItem._id;
      })
    );

    // Resolves the promise above by waiting
    const orderItemsResolved = await orderItems;

    let totalPrice = 0;

    // Calculate Total Price
    // Wait to resolved
    totalOrder = await Promise.all(
      orderItemsResolved.map(async (item) => {
        const orderItem = await OrderItem.findById(item).populate("product", [
          "price",
        ]);

        const orderPrice = orderItem.product.price * orderItem.quantity;

        totalPrice += orderPrice;
      })
    );

    let order = new Order({
      orderItems: orderItemsResolved,
      shippingAddress: req.body.shippingAddress,
      country: req.body.country,
      phone: req.body.phone,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    order = await order.save();

    if (!order) return res.status(404).json({ message: "No order created" });

    return res.json(order);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Used to change deliveryStatus from pending to something
router.put("/:id", [auth], async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { shippingStatus: req.body.shippingStatus },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "No order modified" });

    return res.json(order);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id", [auth], async (req, res) => {
  try {
    // Delete Order
    const order = await Order.findByIdAndRemove(req.params.id);
    // Delete Order.OrderItems
    order.orderItems.map(async (item) => {
      await OrderItem.findByIdAndRemove(item);
    });

    if (!order) return res.status(404).json({ message: "No order deleted" });

    return res.json(order);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/get/totalsales", async (req, res) => {
  try {
    // aggregate = process data by passing to stages
    // { $group: { _id: null} => group by id
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    if (!totalSales)
      return res.status(404).json({ message: "No totalSales generated" });

    return res.json({ totalSales: totalSales[0].total });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/get/userorders/:id", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id }).populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

    if (!orders)
      return res.status(404).json({ message: "No orders generated" });

    return res.json(orders);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.post("/create-checkout-session", async (req, res) => {
  const orderItems = req.body;
  const line_items = await Promise.all(
    orderItems.map(async (item) => {
      const product = await Product.findById(item.product);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      };
    })
  );
  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/success`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  });

  res.json({ id: session.id });
});

module.exports = router;
