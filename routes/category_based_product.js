const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category_based_product");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by category id

router.get("/:categoryId", CategoryController.get_product_by_categoryId);

module.exports = router;