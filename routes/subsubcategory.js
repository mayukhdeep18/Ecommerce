const express = require("express");
const router = express.Router();
const SubSubcategoryController = require("../controllers/subsubcategory");
const checkAuth = require('../middleware/check-auth');


// Handle incoming GET requests to /subcategory
router.get("/", SubSubcategoryController.subsubcategory_get_all);

router.post("/",checkAuth, SubSubcategoryController.subsubcategory_create);

router.get("/:subsubcategoryId", SubSubcategoryController.subsubcategory_get_subsubcategory);

router.patch("/:subsubcategoryId",checkAuth, SubSubcategoryController.subsubcategory_update);

router.delete("/:subsubcategoryId",checkAuth, SubSubcategoryController.subsubcategory_delete);

module.exports = router;