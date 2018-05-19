const express = require("express");
const router = express.Router();
const ProdController = require("../controllers/product_details");
const checkAuth = require('../middleware/check-auth');


router.get("/", ProdController.product_get_all);

router.post("/",checkAuth, ProdController.product_create);

router.get("/:prodcategoryId", ProdController.product_details_get_by_id);

router.patch("/:prodcategoryId",checkAuth,  ProdController.product_update_by_id);

router.delete("/:prodcategoryId",checkAuth, ProdController.product_delete_by_id);

module.exports = router;