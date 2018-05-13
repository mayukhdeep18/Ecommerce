const express = require("express");
const router = express.Router();
const EcommerceCategoryController = require("../controllers/ecommerce_category_flag");


router.get("/:activeFlag", EcommerceCategoryController.ecommerce_category_get_by_flag);

module.exports = router;