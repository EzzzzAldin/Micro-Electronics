const express = require("express");

const router = express.Router();

const {
  addProductController,
  getProductController,
  getSearchProductController,
} = require("../controllers/productController");

const authMiddleware = require("../Middlewares/authMiddleware");

router.post("/product", authMiddleware, addProductController);

router.get("/products", getProductController);
router.get("/products/search", getSearchProductController);

module.exports = router;
