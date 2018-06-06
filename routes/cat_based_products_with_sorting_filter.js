const express = require("express");
const router = express.Router();
const CategoryFilController = require("../controllers/cat_based_products_with_sorting_filter");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by category id

router.get("/:categoryId/:page/:fil_id", CategoryFilController.get_product_by_categoryId);

module.exports = router;