const Product = require("../models/Product");
const User = require("../models/User");

const jwt = require("jsonwebtoken");

const addProductController = async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    if (!name || !price || !stock)
      return res.status(400).json({ msg: "Missing data" });

    // const checkAdmin = await User.findById(userId);

    // if (checkAdmin.role !== "admin")
    //   return res.status(403).json({ msg: "Only admin can add products" });

    // if (!checkAdmin) {
    //   return res.status(400).json({ msg: "User not found" });
    // }

    // get Token
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    if (decodedToken.role !== "admin") {
      return res.status(400).json({ msg: "Only admin can add products" });
    }

    const product = await Product.create({
      name,
      price,
      stock,
    });
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


const removeProductController = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ msg: "Missing ID" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ msg: "Product not found" });


    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken.role !== "admin") {
      return res.status(400).json({ msg: "Only admin can add products" });
    }
    const deletedPoredct = await User.findByIdAndDelete(id)
    if (!deletedPoredct) return res.status(400).json({ msg: "failed delet porodcte products" });
     res.status(500).json({ msg: "Delet scssful", Date:  deletedPoredct})

  } 
  catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};


module.exports = {
  addProductController,
  getProductController,
  getSearchProductController,
  removeProductController
};
