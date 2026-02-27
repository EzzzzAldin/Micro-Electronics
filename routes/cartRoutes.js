const express = require("express");

const router = express.Router();

const {
  addCartController,
  getCartController,
  removeItemCartController,
} = require("../controllers/cartController");

const authMiddleware = require("../Middlewares/authMiddleware");

router.post("/cart", authMiddleware, addCartController);

router.get("/cart", getCartController);

module.exports = router;
