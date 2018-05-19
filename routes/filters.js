const express = require("express");
const router = express.Router();
const FilterController = require("../controllers/filters");
const checkAuth = require('../middleware/check-auth');


router.get("/", FilterController.filter_category_get_all);

router.post("/",/*checkAuth,*/ FilterController.filter_create_category);

router.get("/:filter_categoryId", FilterController.filter_category_get_by_id);

router.patch("/:filter_categoryId",/*checkAuth,*/  FilterController.filter_category_update_by_id);

router.delete("/:filter_categoryId",/*checkAuth,*/ FilterController.filter_category_delete_by_id);

module.exports = router;