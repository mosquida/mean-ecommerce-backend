const express = require("express");
const app = express();
const morgan = require("morgan");
require("dotenv").config();

// Middlewares
app.use(express.json()); // JSON parser
app.use(morgan("tiny")); // HTTP logger

app.get("/", (req, res) => {
  const product = {
    id: 1,
    name: "Intel CPU",
    price: 200,
  };
  res.json(product);
});

app.post("/", (req, res) => {
  res.json(req.body);
});

app.listen(process.env.PORT, () => {
  console.log(`Running on port ${process.env.PORT}`);
});
