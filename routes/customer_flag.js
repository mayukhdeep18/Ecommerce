const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customer_flag");


router.get("/:activeFlag", CustomerController.customer_get_all_flag);

module.exports = router;