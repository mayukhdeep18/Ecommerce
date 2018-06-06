const express = require("express");
const router = express.Router();
const SortingFilterController = require("../controllers/sorting_filter");
const checkAuth = require('../middleware/check-auth');


router.get("/", SortingFilterController.filter_category_get_all);

router.post("/",/*checkAuth,*/ SortingFilterController.filter_create_category);

router.get("/:filter_categoryId", SortingFilterController.filter_category_get_by_id);

router.patch("/:filter_categoryId",/*checkAuth,*/  SortingFilterController.filter_category_update_by_id);

router.delete("/:filter_categoryId",/*checkAuth,*/ SortingFilterController.filter_category_delete_by_id);

module.exports = router;