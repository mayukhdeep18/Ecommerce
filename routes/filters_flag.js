const express = require("express");
const router = express.Router();
const FilterCategoryFlagController = require('../controllers/filters_flag');

router.get("/:activeFlag", FilterCategoryFlagController.filter_category_get_by_flag);

module.exports = router;