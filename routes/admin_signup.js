const express = require("express");
const router = express.Router();
const SignUpController = require("../controllers/admin_signup");
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check_admin_auth');


router.post("/registerUser",checkAdmin, SignUpController.registerAdminUser);


module.exports = router;