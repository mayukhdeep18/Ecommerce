const express = require("express");
const router = express.Router();
const FilterOptionController = require("../controllers/filter_options");
const checkAuth = require('../middleware/check-auth');


router.get("/", FilterOptionController.filters_options_conn_get_all);

router.post("/",/*checkAuth,*/ FilterOptionController.filters_options_conn_create);

router.get("/:filtercategoryId", FilterOptionController.filters_options_conn_get_by_id);

router.patch("/:filtercategoryId",/*checkAuth,*/  FilterOptionController.filters_options_conn_update);

router.delete("/:filtercategoryId",/*checkAuth,*/ FilterOptionController.filters_options_conn_delete);

module.exports = router;