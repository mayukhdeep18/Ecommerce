const express = require("express");
const router = express.Router();
const ForgotPwdController = require("../controllers/forgotpassword");
const checkAuth = require('../middleware/check-auth');


router.post("/password_reset_request",/*checkAuth,*/ ForgotPwdController.forgotPassword);

router.post("/forgotpassword",/*checkAuth,*/ ForgotPwdController.password_reset);

module.exports = router;