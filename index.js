const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json()); // JSON parser
app.use(morgan("tiny")); // HTTP logger

// Routes
app.use("/api/v1/product", require("./routes/product"));

// Database Connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connected ...");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`API running on port ${process.env.PORT}`);
});
