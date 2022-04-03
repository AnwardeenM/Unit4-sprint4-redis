const express = require("express");

const productController = require("./controllers/product.Controller");

const app = express();

app.use(express.json());

app.use("/products", productController);

module.exports = app;
