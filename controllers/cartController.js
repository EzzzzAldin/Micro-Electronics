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
   const authHeader = req.headers.authorization;
       const token = authHeader.split(" ")[1];
       const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        const userId = decodedToken.id;
      const cart = await Cart.findOne({ user: userId });
      if (!cart) return res.status(404).json({ msg: "Cart Not Found" });
      res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};





const removeItemCartController = async (req, res) => {
  try {
// get Data
    const authHeader = req.headers.authorization;
       const token = authHeader.split(" ")[1];
   // Validated Data
       const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.id


        const { productId } = req.body;   
    if (!user || user.role !== "admin") return res.status(404).json({ msg: "User Not Found or Not Admin" });
// Check Cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ msg: "Cart Not Found" });
    
const productIndex = cart.items.findIndex((item) => item.product.equals(productId));
    if (productIndex === -1) return res.status(404).json({ msg: "Item Not Found In Cart" });
    // Remove Item From Cart
    cart.items.splice(productIndex, 1);
    await cart.save();
// Update Stock
    const product = await Product.findById(productId);
    // Check Product
    if (!product) return res.status(404).json({ msg: "Product Not Found" });
    product.stock += cart.items[productIndex].quantity;
        // Save Product
    await product.save(); 
    res.json({ msg: "Item Removed From Cart" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};   

module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
