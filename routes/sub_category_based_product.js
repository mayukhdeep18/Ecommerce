const express = require("express");
const router = express.Router();
const SubCategoryController = require("../controllers/sub_category_based_product");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /product by sub category id

router.get("/:subcategoryId/:page", SubCategoryController.get_product_by_subcategoryId);

router.post("/:subcategoryId/:page", SubCategoryController.product_get_all);

module.exports = router;