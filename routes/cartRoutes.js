const express = require("express");

const router = express.Router();

const {
  addCartController,
  getCartController,
  removeItemCartController,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");
router.post("/cart", addCartController);

router.get("/cart",authMiddleware, getCartController);
router.delete("/cart/:productId",authMiddleware, removeItemCartController);
module.exports = router;
