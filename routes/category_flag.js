const express = require("express");
const router = express.Router();
const CategoryFlagController = require('../controllers/category_flag');

router.get("/:activeFlag", CategoryFlagController.category_get_all_flag);

module.exports = router;