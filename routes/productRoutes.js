const express = require("express");

const router = express.Router();

const {
  addProductController,
  getProductController,
  getSearchProductController,
  removePorductByAdmin
} = require("../controllers/productController");
const protect = require("../midllware/protect");

router.post("/product", addProductController);
router.get("/products", getProductController);
router.get("/products/search", getSearchProductController);
router.delete("/products/:id", protect ,removePorductByAdmin);

module.exports = router;
