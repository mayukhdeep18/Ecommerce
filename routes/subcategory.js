const express = require("express");
const router = express.Router();
const SubcategoryController = require("../controllers/subcategory");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /subcategory
router.get("/", SubcategoryController.subcategory_get_all);

router.get("/:activeFlag", SubcategoryController.subcategory_get_all_flag);

router.post("/",checkAuth, SubcategoryController.subcategory_create);

router.get("/:subcategoryId", SubcategoryController.subcategory_get_subcategory);

router.patch("/:subcategoryId",checkAuth, SubcategoryController.subcategory_update);

router.delete("/:subcategoryId",checkAuth, SubcategoryController.subcategory_delete);

module.exports = router;