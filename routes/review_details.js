const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ReviewController = require("../controllers/review_details");

//routes to execute controller functions
router.get("/", ReviewController.review_get_all);

router.post("/",/*checkAuth,*/ ReviewController.review_create);

router.get("/:reviewId", ReviewController.review_get_by_id);

router.patch("/:reviewId",/*checkAuth,*/ ReviewController.review_update);

router.delete("/:reviewId",/*checkAuth,*/ ReviewController.review_delete);

module.exports = router;