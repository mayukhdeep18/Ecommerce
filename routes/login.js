const express = require("express");
const router = express.Router();
const LoginUserController = require('../controllers/login');
const checkAuth = require('../middleware/check-auth');


router.post("/",/*checkAuth,*/ LoginUserController.loginUser);


module.exports = router;