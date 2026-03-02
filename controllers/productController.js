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
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Unauthorized" });
    } 
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (decodedToken.role !== "admin") {
      return res.status(403).json({ msg: "Only admin can add products" });
    }
      const user = await User.findById(decodedToken.id);  
    if (!user) {
      return res.status(400).json({ msg: "User not found" }); 
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
   
 const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    const { productId } = req.body;
    const userId = decodedToken.id;

    
    if (!productId) return res.status(400).json({ msg: "Missing Product ID" });

    const user = await User.findById(userId);       
    if (!user || user.role !== "admin")
      return res.status(404).json({ msg: "User Not Found or Not Admin" });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product Not Found" });
    await product.remove();

    res.json({ msg: "Product Removed" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

module.exports = {
  addProductController,
  getProductController,
  getSearchProductController,
  removeProductController
};
