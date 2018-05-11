const express = require("express");
const router = express.Router();
const SubSubcategoryFlagController = require("../controllers/subsubcategory_flag");



router.get("/:activeFlag", SubSubcategoryFlagController.subsubcategory_get_all_flag);


module.exports = router;