const express = require("express");
const router = express.Router();
const EcommProdController = require("../controllers/ecommerce_product_details");
const checkAuth = require('../middleware/check-auth');


router.get("/", EcommProdController.ecommproduct_get_all);

router.post("/",checkAuth, EcommProdController.ecommproduct_create);

router.get("/:ecommcategoryId", EcommProdController.ecommproduct_details_get_by_id);

router.patch("/:ecommcategoryId",checkAuth,  EcommProdController.ecommproduct_update_by_id);

router.delete("/:ecommcategoryId",checkAuth, EcommProdController.ecommproduct_delete_by_id);

module.exports = router;