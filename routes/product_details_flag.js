const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/product_details_flag");


router.get("/:activeFlag", ProdController.product_get_by_flag);

module.exports = router;