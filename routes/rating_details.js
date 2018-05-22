const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const RatingController = require("../controllers/rating_details");

//routes to execute controller functions
router.get("/", RatingController.rating_get_all);

router.post("/",/*checkAuth,*/ RatingController.rating_create);

router.get("/:ratingId", RatingController.rating_get_by_id);

router.patch("/:ratingId",/*checkAuth,*/ RatingController.rating_update);

router.delete("/:ratingId",/*checkAuth,*/ RatingController.rating_delete);

module.exports = router;