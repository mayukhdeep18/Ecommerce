'use strict';

///Romuting for register factory only calls

const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/signup");
const validate =require("../config/validate");
const logger = require("../config/logger");

////User registration
exports.registerUser = (req, res, next) => {
    logger.debug('routes signup signup');
    req.body.useremail=req.body.useremail.toLowerCase();
    req.body.username=req.body.username.toLowerCase();
    var userObject=req.body;

    var isValidUserEmail=validate.email(userObject.useremail);
    var isValidUsername=validate.username(userObject.username);
    var isValidPassword=validate.password(userObject.password1);

   // var isValidRole=validate.string(userObject.role);
    if(isValidUserEmail===true && isValidUsername===true && isValidPassword===true){
       dbOperations.checkUser(req,res);
    }
    else{
        res.json({message:"fail"});
    }
};
//router.post('/registerUser',function(request,response){

//});

//module.exports = router;