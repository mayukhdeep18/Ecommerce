const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/filtering_products");
const checkAuth = require('../middleware/check-auth');


router.post("/:categoryId/:page", ProdController.product_get_all);

module.exports = router;