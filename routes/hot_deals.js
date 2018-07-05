const express = require("express");
const router = express.Router();
const HotController = require("../controllers/hot_deals");
const checkAuth = require('../middleware/check-auth');


router.post("/searchtrend", HotController.hot_product_search);

router.post("/", HotController.hot_create);

router.get("/", HotController.get_all_hot);

router.get("/:prodId", HotController.product_get_by_id);

router.patch("/:trendId",/*checkAuth,*/ HotController.hot_update_by_id);

router.delete("/:trendId",/*checkAuth,*/ HotController.hot_delete);

module.exports = router;