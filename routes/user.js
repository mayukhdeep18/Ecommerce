const express = require("express");
const router = express.Router();
const checkAdminAuth = require('../middleware/check_admin_auth');
const UserController = require('../controllers/user');

router.get("/", UserController.user_get_all);

router.get("/:userId",checkAdminAuth, UserController.user_get_by_id);

router.patch("/:userId",checkAdminAuth, UserController.user_update_by_id);

router.delete("/:userId",checkAdminAuth, UserController.user_delete);

module.exports = router;