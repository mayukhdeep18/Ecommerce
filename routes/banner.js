const express = require("express");
const router = express.Router();
const BannerController = require("../controllers/banner");
const checkAuth = require('../middleware/check-auth');


router.post("/", BannerController.banner_create);

router.get("/", BannerController.get_all_banner);

router.get("/:bannerId", BannerController.banner_get_by_id);

router.patch("/:bannerId",/*checkAuth,*/ BannerController.banner_update_by_id);

router.delete("/:bannerId",/*checkAuth,*/ BannerController.banner_delete);

module.exports = router;