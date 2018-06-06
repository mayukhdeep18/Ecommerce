const express = require("express");
const router = express.Router();
const SortingFilterFlagController = require('../controllers/sorting_filter_flag');

router.get("/:activeFlag", SortingFilterFlagController.filter_category_get_by_flag);

module.exports = router;