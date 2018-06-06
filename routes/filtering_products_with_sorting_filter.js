const express = require("express");
const router = express.Router();
const FilProdController = require("../controllers/filtering_products_with_sorting_filter");
const checkAuth = require('../middleware/check-auth');


router.post("/:categoryId/:page/:fil_id", FilProdController.product_get_all);

module.exports = router;