const express = require("express");
const router = express.Router();
const SubCategoryController = require("../controllers/sub_category_based_product");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by category id

router.get("/:categoryId/:page", SubCategoryController.get_product_by_categoryId);

router.get("/:categoryId/:page/:fil_id", SubCategoryController.get_product_by_sorting_filter);

router.post("/:categoryId/:page", SubCategoryController.product_get_all);

router.post("/:categoryId/:page/:fil_id", SubCategoryController.get_product_by_filter_sorting_filter);

module.exports = router;