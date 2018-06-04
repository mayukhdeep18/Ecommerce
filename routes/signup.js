const express = require("express");
const router = express.Router();
const SignUpController = require("../controllers/signup");
const checkAuth = require('../middleware/check-auth');


router.post("/registerUser",/*checkAuth,*/ SignUpController.registerUser);


module.exports = router;