const express = require("express");
const router = express.Router();
const SellerCategoryFlagController = require('../controllers/seller_category_flag');

router.get("/:activeFlag", SellerCategoryFlagController.seller_category_get_by_flag);

module.exports = router;