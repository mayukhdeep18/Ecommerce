const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/calculate_mean_rating");
const checkAdminAuth = require('../middleware/check_admin_auth');


router.get("/:productId", ProdController.product_update_rating);

module.exports = router;