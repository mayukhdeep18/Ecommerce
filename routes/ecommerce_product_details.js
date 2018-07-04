const express = require("express");
const router = express.Router();
const EcommProdController = require("../controllers/ecommerce_product_details");
const checkAuth = require('../middleware/check-auth');


router.get("/:page", EcommProdController.ecommproduct_get_all);

router.post("/", EcommProdController.ecommproduct_new_create);

router.post("/product_map/:Ecommerce_id",/*checkAuth,*/  EcommProdController.ecommproduct_map);

router.get("/:ecommcategoryId", EcommProdController.ecommproduct_details_get_by_id);

router.patch("/:ecommcategoryId",/*checkAuth,*/  EcommProdController.ecommproduct_update_by_id);

router.delete("/:ecommcategoryId",checkAuth, EcommProdController.ecommproduct_delete_by_id);

module.exports = router;