const express = require("express");
const router = express.Router();
const SubSubCategoryController = require("../controllers/sub_sub_category_based_product");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by category id

router.get("/:categoryId/:page", SubSubCategoryController.get_product_by_categoryId);

router.get("/:categoryId/:page/:fil_id", SubSubCategoryController.get_product_by_sorting_filter);

router.post("/:categoryId/:page", SubSubCategoryController.product_get_all);

router.post("/:categoryId/:page/:fil_id", SubSubCategoryController.get_product_by_filter_sorting_filter);

module.exports = router;