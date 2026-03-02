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

//// Get cart controller
const getCartController = async (req, res) => {
  try{
    const authHeader = req.headers.authorization;
    
    const token = authHeader.split(" ")[1];
    
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    let cart = await Cart.findOne({ user: decodedToken.id });
if (!cart) return res.status(404).json({ msg: "cart Not Found" })

res.status(200).json({
      msg: " cart showed ",
      data: cart,
    });
      
  } catch (error) {
    res.status(500).json({msg:"server error"});
  }
};
//////// remove item from cart

const removeItemCartController = async (req, res) => {
  try {async (req, res) => {
  try {
    const { productId } = req.body;



const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

const userId = decodedToken.id


    if (!productId || !userId) return res.status(400).json({ msg: "data invalid" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    const index = cart.items.findIndex(itm => itm.product.toString() === productId);

    if (index > -1) {
      const itemQuantity = cart.items[index].quantity;

      await Product.findByIdAndUpdate(productId, { $inc: { stock: itemQuantity } });

      cart.items.splice(index, 1);

      await cart.save();

      return res.status(200).json({ msg: "Item removed and stock updated", data: cart });
    } else {
      return res.status(404).json({ msg: "Product not found in your cart" });
    }

  } catch (error) {
    res.status(500).json({ msg: "Error server" });
  }
};

  } catch (error) {}
};

 



module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
