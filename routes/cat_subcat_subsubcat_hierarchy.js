const express = require("express");
const router = express.Router();
const SubcategoryController = require("../controllers/cat_subcat_subsubcat_hierarchy");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /subcategory by category id

router.get("/:categoryId", SubcategoryController.get_category_hierarchy);

module.exports = router;