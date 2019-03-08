const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/product_details");
const checkAuth = require('../middleware/check-auth');


//router.get("/:page", ProdController.product_get_all);

router.post("/", ProdController.product_create);

router.get("/product/:prodcategoryId", ProdController.product_details_get_by_id);

router.patch("/:prodcategoryId",  ProdController.product_update_by_id);

router.delete("/:prodcategoryId", ProdController.product_delete_by_id);

//router.get("/api/", ProdController.product_get_from_amazon);

module.exports = router;

