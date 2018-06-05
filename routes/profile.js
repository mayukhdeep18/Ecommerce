const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProfileController = require("../controllers/profile");


router.post("/upload_profile_pic", ProfileController.upload_picture);

router.post("/username_change",ProfileController.change_username);

router.post("/edit_profile_data",ProfileController.edit_profile_data);

router.post("/mobile_send_verification",ProfileController.mobile_send_verification);

router.post("/verify_code",ProfileController.mobile_code_verification);

router.post("/change_password",ProfileController.change_password);

module.exports = router;