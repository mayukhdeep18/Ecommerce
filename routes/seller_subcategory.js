const express = require("express");
const router = express.Router();
const SellerSubcategoryController = require("../controllers/seller_subcategory");
const checkAuth = require('../middleware/check-auth');


router.get("/", SellerSubcategoryController.seller_subcategory_get_all);

router.post("/",/*checkAuth,*/ SellerSubcategoryController.seller_subcategory_create);

router.get("/:sellersubcategoryId", SellerSubcategoryController.seller_subcategory_get_subcategory);

router.patch("/:sellersubcategoryId",/*checkAuth,*/  SellerSubcategoryController.seller_subcategory_update);

router.delete("/:sellersubcategoryId",/*checkAuth,*/  SellerSubcategoryController.seller_subcategory_delete);

module.exports = router;