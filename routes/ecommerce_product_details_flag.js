const express = require("express");
const router = express.Router();
const EcommProdController = require("../controllers/ecommerce_product_details_flag");


router.get("/:activeFlag", EcommProdController.ecommerce_product_get_by_flag);

module.exports = router;