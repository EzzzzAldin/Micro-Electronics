const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");

const addCartSchema = require("./validation/cartValidation");

const addCartController = async (req, res) => {
  try {
    const { error, value } = addCartSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.json({
        msg: "Validation Errors",
        errors: error.details.map((err) => err.message),
      });
    }

    // get Data

    const { productId, quantity } = value;
    // Validated Data
    // if (!userId || !productId || !quantity)
    //   return res.status(400).json({ msg: "Missing Data" });

    // const user = await User.findById(userId);

    // if (!user) return res.status(404).json({ msg: "User Not Found" });

    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ msg: "Product Not Found" });

    if (quantity > product.stock)
      return res.json({ msg: "quantity Large Stock " });

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) cart = await Cart.create({ user: req.user.userId, items: [] });

    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId),
    );

    if (itemIndex > -1) cart.items[itemIndex].quantity += quantity;
    else cart.items.push({ product: productId, quantity });

    await cart.save();
    product.stock -= quantity;
    await product.save();

    res.json({ msg: "Added to cart", cart });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
};

const getCartController = async (req, res) => {
  try {
  } catch (error) {}
};
const removeItemCartController = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
