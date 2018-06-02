const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/calculate_review_count");
const checkAuth = require('../middleware/check-auth');


router.get("/:productId", ProdController.product_update_review);

module.exports = router;