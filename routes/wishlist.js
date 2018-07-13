const express = require("express");
const router = express.Router();
const WishlistController = require("../controllers/wishlist");
const checkAuth = require('../middleware/check-auth');


router.get("/",checkAuth, WishlistController.wishlist_conn_get_all);

router.post("/",checkAuth, WishlistController.wishlist_conn_create);

//router.get("/:wishlistId", WishlistController.wishlist_conn_get_by_id);

//router.patch("/:wishlistId",/*checkAuth,*/  WishlistController.wishlist_conn_update);

router.delete("/:wishlistId",checkAuth, WishlistController.wishlist_conn_delete);

module.exports = router;