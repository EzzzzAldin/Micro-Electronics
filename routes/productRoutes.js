const express = require("express");

const router = express.Router();

const {
  addProductController,
  getProductController,
  getSearchProductController,
  deleteProduct
} = require("../controllers/productController");

const uploadProductImage = require("../Middleware/uploadImages");
const authMiddleware = require("../Middleware/authMiddleware");

router.post(
  "/product",
  authMiddleware,
  uploadProductImage,
  addProductController,
);

router.get("/products", getProductController);
router.get("/products/search", getSearchProductController);
router.delete("/products/:id", deleteProduct);

module.exports = router;
