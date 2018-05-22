const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const AnalyticsController = require("../controllers/customer_analytics");

//routes to execute controller functions
router.get("/", AnalyticsController.customer_analytics_get_all);

router.post("/",/*checkAuth,*/ AnalyticsController.customer_analytics_create);

router.get("/:analyticsId", AnalyticsController.customer_analytics_get_by_id);

router.patch("/:analyticsId",/*checkAuth,*/ AnalyticsController.customer_analytics_update);

router.delete("/:analyticsId",/*checkAuth,*/ AnalyticsController.customer_analytics_delete);

module.exports = router;