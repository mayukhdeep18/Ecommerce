const express = require("express");
const router = express.Router();
const SubSubCategoryController = require("../controllers/sub_sub_category_based_product");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by sub category id

router.get("/:subsubcategoryId/:page", SubSubCategoryController.get_product_by_subsubcategoryId);

module.exports = router;