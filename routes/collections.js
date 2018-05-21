const express = require("express");
const router = express.Router();
const CollectionsController = require("../controllers/collections");
const checkAuth = require('../middleware/check-auth');


router.get("/", CollectionsController.collections_get_all);

router.post("/",/*checkAuth,*/ CollectionsController.collections_create);

router.get("/:collectionsId", CollectionsController.collections_get_collections);

router.patch("/:collectionsId",/*checkAuth,*/ CollectionsController.collections_update);

router.delete("/:collectionsId",/*checkAuth,*/ CollectionsController.collections_delete);

module.exports = router;