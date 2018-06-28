const express = require("express");
const router = express.Router();
const SubcategoryController = require("../controllers/subcategory");
const checkAuth = require('../middleware/check-auth');


router.get("/", SubcategoryController.subcategory_get_all);

router.post("/", SubcategoryController.subcategory_create);

router.get("/:subcategoryId", SubcategoryController.subcategory_get_subcategory);

router.patch("/:subcategoryId", SubcategoryController.subcategory_update);

router.delete("/:subcategoryId", SubcategoryController.subcategory_delete);

module.exports = router;