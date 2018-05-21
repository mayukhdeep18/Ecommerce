const express = require("express");
const router = express.Router();
const CollectionsFlagController = require("../controllers/collections_flag");

router.get("/:activeFlag", CollectionsFlagController.collections_get_all_flag);

module.exports = router;