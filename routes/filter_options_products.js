const express = require("express");
const router = express.Router();
const FilterOptProdController = require("../controllers/filter_options_products");
const checkAuth = require('../middleware/check-auth');


router.get("/", FilterOptProdController.filter_opt_prod_conn_get_all);

router.post("/",/*checkAuth,*/ FilterOptProdController.filter_opt_prod_conn_create);

router.get("/:filtercategoryId", FilterOptProdController.filter_opt_prod_conn_get_by_id);

router.get("/filopt/:prodId", FilterOptProdController.filter_opt_prod_get_by_prod);

router.patch("/",/*checkAuth,*/  FilterOptProdController.filter_opt_prod_conn_update);

router.delete("/:filtercategoryId",/*checkAuth,*/ FilterOptProdController.filter_opt_prod_conn_delete);

module.exports = router;