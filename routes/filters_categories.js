const express = require("express");
const router = express.Router();
const FilterCategoryController = require("../controllers/filters_categories");
const checkAuth = require('../middleware/check-auth');


router.get("/:filtercategoryId", FilterCategoryController.filters_categories_conn_get_by_id);
router.patch("/:filtercategoryId",/*checkAuth,*/  FilterCategoryController.filters_categories_conn_update);



//ONLY THE BELOW APIs ARE TO BE USED TO ADD/DELETE FILTERS AND ESTABLISH FILTER AND CATEGORY/SUB/SUB SUB CATEGORY CONNECTIONS

router.get("/", FilterCategoryController.filters_categories_conn_get_all);

router.post("/",/*checkAuth,*/ FilterCategoryController.filters_categories_conn_create);

router.delete("/:filtercategoryId",/*checkAuth,*/ FilterCategoryController.filters_categories_conn_delete);

module.exports = router;