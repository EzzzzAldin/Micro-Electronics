const Product = require("../models/Product");
const User = require("../models/User");

const addProductSchema = require("./validation/productsValidation");

const addProductController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Product image is required" });
    }

    const { error, value } = addProductSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        msg: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }

    // const { name, price, stock, userId } = value;

    // if (!name || !price || !stock)
    //   return res.status(400).json({ msg: "Missing data" });

    // const checkAdmin = await User.findById(userId);

    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Only admin can add products" });

    // if (!checkAdmin) {
    //   return res.status(400).json({ msg: "User not found" });
    // }

    value.image = req.file.path;

    const product = await Product.create(value);
    res.status(201).json({ msg: "Product created", product });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};
const getProductController = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};
const getSearchProductController = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) return res.status(400).json({ msg: "Missing ID" });

    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ msg: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  addProductController,
  getProductController,
  getSearchProductController,
};
