'use strict';

///Routing for shared calls

const express = require('express');
const router = express.Router();

const dbOperations = require("../config/crudoperations/commonoperations");
const validate =require("../config/validate");
const logger = require("../config/logger");


////////////Activate Email
router.get('/activateEmail/:url_link',function(request,response){
    logger.debug('routes common activateemail');
    var activationObject_body=request.params.url_link;

    console.log("request_url",activationObject_body);

    var activationObject={
        "userEmail":activationObject_body.search().e,
        "token":activationObject_body.search().t,
    }

    console.log("email:",activationObject_body.search().e);
    console.log("token",activationObject_body.search().t);

    var isValidUserEmail=validate.email(activationObject.userEmail);
    var isValidToken=validate.string(activationObject.token);
    if(isValidUserEmail===true && isValidToken===true){
        dbOperations.checkToken(request,response);
    }
    else{
        response.json({message:"fail"});
    }
});

// /////////////Social SignIn
// router.post('/socialSignin',function(request,response){
//     var socialObject=request.body;
//     var isValidUserEmail=validate.email(socialObject.Email);
//     var isValidName=validate.name(socialObject.FullName);
//     var isValidSocial=validate.name(socialObject.Social);
//     if(isValidUserEmail===true && isValidSocial===true && isValidName===true){
//         dbOperations.socialSignin(request,response);
//     }
//     else{
//         response.json({message:"fail"});
//     }
// });

////////////CheckUsername if already exists
router.post('/checkUsername',function(request,response){
    logger.debug('routes common checkUsername');
    request.body.username=request.body.username.toLowerCase();
    var usernameObj=request.body;
    usernameObj.notFound=undefined;
    dbOperations.checkUsername(usernameObj,function(){
        if(usernameObj.notFound==true){
            response.json({"message":"notfound"});
        }
        else{
            response.json({"message":"found"});
        }
    });
});

module.exports = router;