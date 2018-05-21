const express = require("express");
const router = express.Router();
const FilterOptProdFlagController = require('../controllers/filter_options_products_flag');

router.get("/:activeFlag", FilterOptProdFlagController.filter_opt_prod_get_by_flag);

module.exports = router;