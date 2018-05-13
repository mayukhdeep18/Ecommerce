const express = require("express");
const router = express.Router();
const SubcategoryFlagController = require("../controllers/subcategory_flag");

router.get("/:activeFlag", SubcategoryFlagController.subcategory_get_all_flag);

module.exports = router;