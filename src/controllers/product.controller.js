const express = require("express");

const client = require("../configs/redis");

const Product = require("../models/product.model");

const router = express.Router();


router.post("", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    const products = await Product.find().lean().exec();

    client.set("productsData", JSON.stringify(products));

    return res.status(201).send(product);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("", async (req, res) => {
  try {
    client.get("productsData", async function (err, fetchedProducts) {


      if (fetchedProducts) {
        const products = JSON.parse(fetchedProducts);

        return res.status(200).send(products);
      } else {
        try {
          const products = await Product.find().lean().exec();

          client.set("productsData", JSON.stringify(products));

          return res.status(200).send(products);
        } catch (err) {
          return res.status(500).send(err.message);
        }
      }
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    client.get(`productsData.${req.params.id}`, async function (err, fetchedProducts) {
      if (fetchedProducts) {

        const product = JSON.parse(fetchedProducts);

        return res.status(200).send(product);
      } else {
        try {
          const product = await Product.findById(req.params.id).lean().exec();

          client.set(`productsData.${req.params.id}`, JSON.stringify(product));

          return res.status(200).send(product);
        } catch (err) {
          return res.status(500).send(err.message);
        }
      }
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .lean()
      .exec();

    const products = await Product.find().lean().exec();

    client.set(`productsData.${req.params.id}`, JSON.stringify(product));
    client.set("productsData", JSON.stringify(products));

    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id).lean().exec();

    const products = await Product.find().lean().exec();

    client.del(`productsData.${req.params.id}`);
    client.set("productsData", JSON.stringify(products));

    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
