const express = require("express");
const router = express.Router();
const ImageFlagController = require("../controllers/product_images_flag");


router.get("/:activeFlag", ImageFlagController.images_get_all_flag);

module.exports = router;