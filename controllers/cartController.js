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
    const { userId } = req.query;

    if ( !userId ) return res.status( 400 ).json( { msg: "Missing User ID" } );

    const cart = await Cart.findOne( { user: userId } ).populate( "items.product" );

    if ( !cart ) return res.status( 404 ).json( { msg: "Cart Not Found" } );

    res.json( cart );

  } catch ( error ) {
    res.status( 500 ).json( { msg: "Server Error" } );
  }
};



const removeItemCartController = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if ( !userId || !productId ) return res.status( 400 ).json( { msg: "Missing Data" } );

    const cart = await Cart.findOne( { user: userId } );

    if ( !cart ) return res.status( 404 ).json( { msg: "Cart Not Found" } );

    const itemsIndex = cart.items.findIndex( ( item ) => {
      item.product.equals( productId );
    } );

    if ( itemsIndex === -1 ) return res.status( 404 ).json( { msg: "Product Not Found In Cart" } );

    const product = await Product.findById( productId );

    if ( !product ) return res.status( 404 ).json( { msg: "Product Not Found" } );

    product.stock += cart.items[ itemsIndex ].quantity;
    
    await product.save();

    cart.items.splice( itemsIndex, 1 );

    await cart.save();

    res.json( { msg: "Done Remove Product From Cart", data: cart } );

    
  } catch (error) {
    res.status( 500 ).json( { msg: "Server Error" } );
    }
};

module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
