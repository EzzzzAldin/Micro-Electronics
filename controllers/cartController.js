const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const addCartController = async (req, res) => {
  try {
    // get data
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    // validated data
    if (!userId || !productId || !quantity)
      return res.status(400).json({ msg: "Missing Data" });

    const user = await User.findById(decodedToken.id);

    if (!user) return res.status(404).json({ msg: "User Not Found" });

    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ msg: "Product Not Found" });

    if (quantity > product.stock)
      return res.json({ msg: "quantity Large Stock " });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) cart = await Cart.create({ user, items: [] });

    // add product or updated quantity
    const itemsIndex = cart.items.findIndex((item) => 
      item.product.equals(productId)
    );

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
   const userId = req.user.id;
    // const {userId} = req.body; // getting params from the body
    if(!userId) return res.status(400).json({msg: "missing data userId not founded"}) // second we check that we got the data we wnated
    // after we need to check if this user is in the collection data or not
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({msg: "there is no user with this userId in the collection database, please create one or check the current userId"})
    // now we need to check if this user has a cart or not.
  // and if yes then we need to find his cart
  const cart = await Cart.findOne({user: userId}).populate("items.product")
  if (!cart) return res.status(404).json({msg: "not founded"});
  // when we found it
  res.status(200).json({msg: "success", data: cart});
  } catch (err) { 
     res.status(500).json({ msg: "server srror", details: err.message });
}
};

// const getcaaar= async (req, res)=>{
//   try {

//     // const authHeader = req.headers.authorization;
//     // // console.log(authHeader)
//     // const token = authHeader.split(" ")[1];
//     // // console.log(token);
//     // const decodedToken = jwt.verify(token, secret);
//     // // console.log(decodedToken);
//     // const userId = decodedToken.id
//     const userId = req.user.id;
// // const userId = req.user.id;

//     const cart = await Cart.findOne({user: userId})
//     console.log(cart);

//   }catch(err){

//   }
// }



const removeItemCartController = async (req, res) => {
  try {
    // get data from the body
    // const { userId} = req.body;
    const userId = req.user.id;

    const {productId} = req.params;

    // check that we found the data we requset for
    if (!userId || !productId)
      return res.status(400).json({ msg: "Missing Data" });

    // check if the user is exist in the database 
    // cause we dont want to work on cart for someone else
    const user = await User.findById(userId); //findById returns the id or null 
    if (!user) return res.status(404).json({ msg: "User Not Found" });

    // after we check that the user is existed we need to 
    // find the cart that belongs to this user
    const cart = await Cart.findOne({ user: userId }); // now we are getting the userId that is inside its data body (field), 
    // and wyh like this { user: userId }? cause findOne returns one object or null,
    //  and this is how we write it in the Schema code:
    //   user: {
        //   type: mongoose.Schema.Types.ObjectId,
        //   ref: "User",
        // },
        // فاحنا هنا بنعرفه انه يجيب اليوزر اي دي بتاع اليوزر اللي احنا معرفينه في الداتا بيز عشان كدا كتبناها بالشكل ده
    if (!cart) return res.status(404).json({ msg: "Cart Not Found" }); // check

    // search for the product inside the cart items (array)
    // .equals() is used instead of === because product is an ObjectId not a string
    const itemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    // check if the product was not found in the cart
    if (itemIndex === -1) // here we use -1 cause the index in any array started form 0
      return res.status(404).json({ msg: "Product Not Found In Cart" });

    //  restore product to its stock
    const product = await Product.findById(productId);
    if (product) {
      // Add back the quantity that was reserved when the item was added to cart
      product.stock += cart.items[itemIndex].quantity;
      await product.save();
    }
    //alterntive fast code 
// await Product.findByIdAndUpdate(productId, {
//   $inc: { stock: cart.items[itemIndex].quantity }
// });
    // after we return it to the stock now we need to remove the item from the cart array using its index
    cart.items.splice(itemIndex, 1);

// why splice not filter?
//  filter makes a new array in momery and this is not good for prefomence
// cart.items = cart.items.filter(item => !item.product.equals(productId));

//  splice updat the original array and its what we need
// cart.items.splice(itemIndex, 1);


    // save the updated cart to the database
    await cart.save();

    // return the responed to the client
    res.status(200).json({ msg: "Item Removed From Cart", data: cart });
  } catch (err) {
    res.status(500).json({ msg: "Server Error", details: err.message});
  }
};



// const removeItemCartController = async (req, res) => {
//   try {
//   } catch (error) {}
// };

module.exports = {
  addCartController,
  getCartController,
  removeItemCartController,
};
