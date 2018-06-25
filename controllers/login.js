'use strict';

//Routing for login factory only calls

const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/login");
const validate =require("../config/validate");
const logger = require("../config/logger");

///Logging in
exports.loginUser = (req, res, next) => {
    logger.debug('routes login login');
    req.body.loginid=req.body.loginid.toLowerCase();
    var loginObject=req.body;
    var isValidUserEmail=validate.email(loginObject.loginid);
    var isValidUsername=validate.username(loginObject.loginid);
    var isValidMobile=validate.mobile(loginObject.loginid);
    var isValidPassword=validate.password(loginObject.loginpassword);
    if((isValidUserEmail===true || isValidUsername===true || isValidMobile===true) && isValidPassword===true
        && (loginObject.rememberMe===true || loginObject.rememberMe===false || loginObject.rememberMe===undefined)){
        req.session.authenticated = true;
        dbOperations.doLogin(req,res);

    }
    else{
        res.json(
            {
                status: "failed",
                message:"Please check your email and password"
            }
            );
    }
};

