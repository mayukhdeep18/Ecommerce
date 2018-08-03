const express = require("express");
const router = express.Router();
const FilterOptionController = require("../controllers/filter_options");
const checkAuth = require('../middleware/check-auth');

router.get("/", FilterOptionController.filters_options_conn_get_all);
router.get("/:filtercategoryId", FilterOptionController.filters_options_conn_get_by_id);
router.get("/fil_by_prod/:prodId", FilterOptionController.filters_get_by_product);

//ONLY THE BELOW APIs WILL BE USED TO ADD/GET/UPDATE/DELETE FILTER VALUES
router.post("/",/*checkAuth,*/ FilterOptionController.filters_options_conn_create);

router.get("/filtype/:filtertypeid/:filtercategoryId", FilterOptionController.filters_options_get_by_fil);

router.patch("/:filtercategoryId",/*checkAuth,*/  FilterOptionController.filters_options_conn_update);

router.delete("/:filtercategoryId",/*checkAuth,*/ FilterOptionController.filters_options_conn_delete);

module.exports = router;