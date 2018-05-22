const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/review_details_flag");


router.get("/:activeFlag", ReviewController.review_get_all_flag);

module.exports = router;