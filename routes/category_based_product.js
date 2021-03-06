const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/category_based_product");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by category id

router.get("/:categoryId/:page", CategoryController.get_product_by_categoryId);

router.get("/:categoryId/:page/:fil_id", CategoryController.get_product_by_sorting_filter);

router.post("/:categoryId/:page", CategoryController.product_get_all);

router.post("/:categoryId/:page/:fil_id", CategoryController.get_product_by_filter_sorting_filter);

module.exports = router;