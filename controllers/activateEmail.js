const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/commonoperations");
const validate =require("../config/validate");
const logger = require("../config/logger");
var Cryptr = require('cryptr'),cryptr = new Cryptr('myTotalySecretKey');

//get all active wishlist  details
exports.activate_email= (req, res, next) => {

    logger.debug('routes common activateemail');

    var activationObject={
        "userEmail":cryptr.decrypt(req.query.e),
        "token":req.query.t,
    }


    var isValidUserEmail=validate.email(activationObject.userEmail);
    var isValidToken=validate.string(activationObject.token);



    if(isValidUserEmail===true && isValidToken===true){
        dbOperations.checkToken(activationObject,res);
    }
    else{
        //console.log("coming here");
        res.json(
            {
                status: "failed",
                message:"Verification failed!"
            }
            );
    }
};