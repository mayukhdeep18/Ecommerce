const express = require("express");
const router = express.Router();
const OfferController = require("../controllers/offer_details_flag");


router.get("/:activeFlag", OfferController.offer_get_all_flag);

module.exports = router;