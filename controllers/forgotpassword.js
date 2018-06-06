'use strict';

///Routing for forgotpassword factory only calls

const express = require('express');
const router = express.Router();
var Cryptr = require('cryptr'),cryptr = new Cryptr('myTotalySecretKey');
const dbOperations = require("../config/crudoperations/forgotpassword");
const validate =require("../config/validate");
const logger = require("../config/logger");


//////Send Link
exports.forgotPassword = (request, response, next) => {
    logger.debug('routes forgotpass sendlink');
    request.body.Email=request.body.Email.toLowerCase();
    var forgotObject=request.body;


    var isValidUserEmail=validate.email(forgotObject.Email);
    if(isValidUserEmail===true){
        var encryptedString = cryptr.encrypt(forgotObject.Email);
        console.log('encrypted_email',encryptedString);
        dbOperations.checkEmail(encryptedString,response);
    }
    else{
        response.json({message:"fail"});
    }
};

//router.post('/sendLink',function(request,response){});

///////Check Token

exports.password_reset = (request, response, next) => {
    logger.debug('routes forgotpass passwordReset');
    var passwordObject=request.body;
    var email_id = cryptr.decrypt(request.query.e);

    var activationObject={
        "userEmail": email_id,
        "token":request.query.t,
        "NewPassword": passwordObject.NewPassword
    }


    var isValidUserEmail=validate.email(activationObject.userEmail);
    var isValidToken=validate.string(activationObject.token);
    var isValidPassword;
    if(passwordObject.NewPassword!=undefined){
        isValidPassword=validate.password(passwordObject.NewPassword);
        if(isValidUserEmail===true && isValidToken===true && isValidPassword===true){
            dbOperations.passwordReset(activationObject,response);
        }
        else{
            response.json({message:"failed due to validation level 1"});
        }
    }
    else if(isValidUserEmail===true && isValidToken===true){
        dbOperations.passwordReset(request,response);
    }
    else{
        response.json({message:"failed out of validation"});
    }
};

//router.post('/passwordReset',function(request,response){});

