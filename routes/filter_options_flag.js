const express = require("express");
const router = express.Router();
const FilterOptionFlagController = require('../controllers/filter_options_flag');

router.get("/:activeFlag", FilterOptionFlagController.filter_options_get_by_flag);

module.exports = router;