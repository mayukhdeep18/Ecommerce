const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const SellerCategoryController = require('../controllers/seller_category');

router.get("/", SellerCategoryController.seller_category_get_all);

router.post("/", checkAuth, SellerCategoryController.seller_category_create);

router.get("/:seller_categoryId", SellerCategoryController.seller_category_get_by_id);

router.patch("/:seller_categoryId",checkAuth, SellerCategoryController.seller_category_update_by_id);

router.delete("/:seller_categoryId",checkAuth, SellerCategoryController.seller_category_delete_by_id);

module.exports = router;