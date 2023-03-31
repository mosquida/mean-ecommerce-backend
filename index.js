const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json()); // JSON parser
app.use(morgan("tiny")); // HTTP logger
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "/public/uploads"))
);
// Handling Middleware Error, Beutifies Return Message
app.use((err, req, res, next) => {
  if (err) return res.json(err);
  next();
});

// Routes
app.use("/api/v1/products", require("./routes/product"));
app.use("/api/v1/categories", require("./routes/category"));
app.use("/api/v1/users", require("./routes/user"));
app.use("/api/v1/orders", require("./routes/order"));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connected ...");

    app.listen(process.env.PORT, () => {
      console.log(`API running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
