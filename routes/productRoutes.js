const express = require("express");

const router = express.Router();

const {
  addProductController,
  getProductController,
  getSearchProductController,
  removeProductController,

} = require("../controllers/productController");

router.post("/product", addProductController);

router.get("/products", getProductController);
router.get("/products/search", getSearchProductController);
router.delete("/product", removeProductController);

module.exports = router;

