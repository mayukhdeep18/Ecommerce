const express = require("express");
const router = express.Router();
const SubcategoryController = require("../controllers/category_subcategory_hierarchy");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /subcategory by category id

router.get("/:categoryId", SubcategoryController.subcategory_get_by_categoryId);

module.exports = router;