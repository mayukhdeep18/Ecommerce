const express = require("express");
const router = express.Router();
const SubSubCategoryFilController = require("../controllers/subsubcat_based_products_with_sorting_filter");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by category id

router.get("/:subsubcategoryId/:page/:fil_id", SubSubCategoryFilController.get_product_by_subsubcategoryId);

module.exports = router;