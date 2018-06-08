const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/search");
const checkAuth = require('../middleware/check-auth');

router.post("/:page", SearchController.search_get_all);

module.exports = router;