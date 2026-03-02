const express = require("express");

const router = express.Router();

const {
  addProductController,
  getProductController,
  getSearchProductController,
  deleteProduct,
} = require("../controllers/productController");

router.post("/product", addProductController);

router.get("/products", getProductController);
router.get("/products/search", getSearchProductController);
router.delete("/product/:id", deleteProduct);

module.exports = router;
