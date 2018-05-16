const express = require("express");
const router = express.Router();
const SubSubcategoryController = require("../controllers/subcategory_subsubcategory_hierarchy");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /subsubcategory by sub category id

router.get("/:subcategoryId", SubSubcategoryController.subsubcategory_get_by_subcategoryId);

module.exports = router;