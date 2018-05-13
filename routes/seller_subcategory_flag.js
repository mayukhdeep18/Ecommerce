const express = require("express");
const router = express.Router();
const SellerSubcategoryFlagController = require("../controllers/seller_subcategory_flag");

router.get("/:activeFlag", SellerSubcategoryFlagController.seller_subcategory_get_by_flag);

module.exports = router;