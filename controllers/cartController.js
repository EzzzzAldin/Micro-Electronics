const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");

const jwt = require("jsonwebtoken")



const addCartController = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    
    const token = authHeader.split(" ")[1];
        
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken.id;
    // get Data
    const { productId, quantity } = req.body;
    // Validated Data
    if (!decodedToken || !productId || !quantity)  return res.status(400).json({ msg: "Missing Data" });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ msg: "Product Not Found" });

    if (quantity > product.stock)
      return res.json({ msg: "quantity Large Stock " });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) cart = await Cart.create({ user, items: [] });

    // Add Product Or Updated quantity
    const itemsIndex = cart.items.findIndex((item) => {
      item.product.equals(productId);
    });

    if (itemsIndex > -1) {
      cart.items[itemsIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    product.stock -= quantity;
    await product.save();

    res.status(201).json({
      msg: "Done Add Product In Cart",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const getCartController = async (req, res) => {
  try {

    const data = await Cart.find().populate({path:"items.product",select:"name price"});

    if (!data) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ msg: "Server Error", error: error.message }); 
  }
};



const removeItemCartController = async (req, res) => {
try {
  const authHeader = req.headers.authorization;
    
  const token = authHeader.split(" ")[1];
      
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // const userId = decodedToken.id;

  const { userId, productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: "Product not found in cart" });
    }

    // 🔥 هنا بنستخدم splice
    cart.items.splice(itemIndex, 1);

    await cart.save();

    res.status(200).json({
      msg: "Item removed successfully",
      cart
    });

  } catch (error) {
    res.status(500).json({
      msg: "Server Error",
      error: error.message
    });
  }
};

module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
