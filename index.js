const express = require("express");
const app = express();
require("dotenv").config();

// Middleware converts req.body to json format
app.use(express.json());

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
