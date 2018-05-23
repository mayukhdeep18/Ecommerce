const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const RatingController = require("../controllers/rating_product_filter");

//routes to execute controller functions

router.get("/:ratingNumber", RatingController.product_get_by_rating);

module.exports = router;