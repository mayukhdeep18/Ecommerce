const express = require("express");
const router = express.Router();
//const mongoose = require("mongoose");

const checkAuth = require('../middleware/check-auth');
//const Category = require("../models/category");
const CategoryController = require('../controllers/category');

router.get("/", CategoryController.category_get_all);

router.post("/", checkAuth, CategoryController.category_create_category);

router.get("/:categoryId", CategoryController.category_get_category);

router.get("/:categoryId",checkAuth, CategoryController.category_update_category);

router.delete("/:categoryId",checkAuth, CategoryController.category_delete);

module.exports = router;