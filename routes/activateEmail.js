'use strict';

///Routing for shared calls

const express = require('express');
const router = express.Router();
const ActivateEmailController = require("../controllers/activateEmail");
const checkAuth = require('../middleware/check-auth');


router.get("/emailactivate", ActivateEmailController.activate_email);

module.exports = router;