const express = require("express");
const router = express.Router();
const SubCategoryFilController = require("../controllers/subcat_based_products_with_sorting_filter");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by category id

router.get("/:subcategoryId/:page/:fil_id", SubCategoryFilController.get_product_by_subcategoryId);

module.exports = router;