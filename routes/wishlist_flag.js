const express = require("express");
const router = express.Router();
const WishlistController = require('../controllers/wishlist_flag');

router.get("/:activeFlag", WishlistController.wishlist_get_by_flag);

module.exports = router;