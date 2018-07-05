const express = require("express");
const router = express.Router();
const TrendingController = require("../controllers/trending_products");
const checkAuth = require('../middleware/check-auth');


router.post("/searchtrend", TrendingController.trending_product_search);

router.post("/", TrendingController.trending_create);

router.get("/", TrendingController.get_all_trending);

router.get("/:prodId", TrendingController.product_get_by_id);

router.patch("/:trendId",/*checkAuth,*/ TrendingController.trending_update_by_id);

router.delete("/:trendId",/*checkAuth,*/ TrendingController.trending_delete);

module.exports = router;