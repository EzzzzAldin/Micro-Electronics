const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");

const addCartController = async (req, res) => {
  try {
    // get Data
    const { userId, productId, quantity } = req.body;
    // Validated Data
    if (!userId || !productId || !quantity)
      return res.status(400).json({ msg: "Missing Data" });

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
    const {user ,items}= req.body

    if(!user || !items) return res.status(400).json({msg:"must add all data"})
        const authHeader = req.headers.authorization;
      
          const token = authHeader.split(" ")[1];
      
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      
          if (decodedToken.role !== "user") {
            return res.status(400).json({ msg: "Only admin can add products" });
          }
    
      const cart = await Cart.find()
      res.status(201).json({data : cart, msg:"geted"})
  } catch (error) {res.status(500).json({msg:"server error"})}
};
const removeItemCartController = async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
    
        const token = authHeader.split(" ")[1];
    
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
        if (decodedToken.role !== "admin") {
          return res.status(400).json({ msg: "Only admin can add products" });
        }

    if(!cart) return res.status(404).json({msg:"not found"})

    const cart = await Cart.findByIdAndDelete(req.params.id)

    res.status(201).json({msg:"deleted"})
    
  } catch (error) {}
};

module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
