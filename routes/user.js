const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require("../controllers/user");

// Handle incoming GET requests to signup

router.get("/",checkAuth, UserController.user_get_all);

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.get("/:userId",checkAuth, UserController.user_get_user);

router.delete("/:userId",checkAuth, UserController.user_delete);

module.exports = router;