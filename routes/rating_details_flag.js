const express = require("express");
const router = express.Router();
const RatingController = require("../controllers/rating_details_flag");


router.get("/:activeFlag", RatingController.rating_get_all_flag);

module.exports = router;