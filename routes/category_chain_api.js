const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const CategoryController = require('../controllers/category_chain_api');

router.get("/:categoryId", CategoryController.category_get_all);

module.exports = router;