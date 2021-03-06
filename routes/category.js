const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const CategoryController = require('../controllers/category');

router.get("/", CategoryController.category_get_all);

//router.get("/:activeFlag", CategoryController.category_get_all_flag);

router.post("/", CategoryController.category_create_category);

router.get("/:categoryId", CategoryController.category_get_category);

router.patch("/:categoryId", CategoryController.category_update_category);

router.delete("/:categoryId", CategoryController.category_delete);

module.exports = router;