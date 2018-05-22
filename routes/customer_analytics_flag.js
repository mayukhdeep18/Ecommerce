const express = require("express");
const router = express.Router();
const AnalyticsFlagController = require("../controllers/customer_analytics_flag");

router.get("/:activeFlag", AnalyticsFlagController.customer_analytics_get_all_flag);

module.exports = router;