const express = require("express");
const router = express.Router();
const CollectionController = require("../controllers/collections");
const checkAuth = require('../middleware/check-auth');


router.post("/searchtrend", CollectionController.collection_product_search);

router.post("/", CollectionController.collection_create);

router.get("/", CollectionController.get_all_collection);

router.get("/:prodId", CollectionController.product_get_by_id);

router.patch("/:trendId",/*checkAuth,*/ CollectionController.collection_update_by_id);

router.delete("/:trendId",/*checkAuth,*/ CollectionController.collection_delete);

module.exports = router;