const express = require("express");
const router = express.Router();
const SubSubCategoryController = require("../controllers/sub_sub_category_based_product");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by sub category id

router.get("/:subsubcategoryId/:page", SubSubCategoryController.get_product_by_subsubcategoryId);

router.post("/:subsubcategoryId/:page", SubSubCategoryController.product_get_all);

module.exports = router;