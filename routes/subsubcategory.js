const express = require("express");
const router = express.Router();
const SubSubcategoryController = require("../controllers/subsubcategory");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /subcategory
router.get("/", SubSubcategoryController.subsubcategory_get_all);

router.post("/", SubSubcategoryController.subsubcategory_create);

router.get("/:subsubcategoryId", SubSubcategoryController.subsubcategory_get_subsubcategory);

router.patch("/:subsubcategoryId", SubSubcategoryController.subsubcategory_update);

router.delete("/:subsubcategoryId", SubSubcategoryController.subsubcategory_delete);

module.exports = router;