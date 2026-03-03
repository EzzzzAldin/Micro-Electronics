const express = require("express");

const router = express.Router();

const {
  addProductController,
  getProductController,
  getSearchProductController,
  removeProductByAdmin,
} = require("../controllers/productController");

router.post("/product", addProductController);

router.get("/products", getProductController);
router.get("/products/search", getSearchProductController);
router.delete("/product/:id", removeProductByAdmin); // we put the : before the id 
// cause we are tilling express that this id is dynamic paramter not fixed string

module.exports = router;
