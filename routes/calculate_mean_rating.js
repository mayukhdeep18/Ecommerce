const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/calculate_mean_rating");
const checkAuth = require('../middleware/check-auth');


router.get("/:productId", ProdController.product_update_rating);

module.exports = router;