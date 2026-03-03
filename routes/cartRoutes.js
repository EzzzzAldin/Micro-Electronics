const express = require("express");

const router = express.Router();

const {
  addCartController,
  getCartController,
  removeItemCartController,
} = require("../controllers/cartController");

router.post("/cart", addCartController);

router.get("/cart", getCartController);
router.delete("cart/:productId", removeItemCartController);
module.exports = router;
