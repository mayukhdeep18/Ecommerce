'use strict';

const User = require("../../models/user");
const logger = require("../logger");
const jwt = require("jsonwebtoken");
const nodemon = require("nodemon");


const dbOperations={

    //Check login id and password > Fill Session
    doLogin:function (request,response){
        logger.debug('crud login doLogin');
        const utils =require("../utils");
        var loginObject=request.body;

        User.find({
                "$or": [{
                    "useremail":loginObject.loginid
                },
                    {
                        "username": loginObject.loginid
                    },
                    {
                        "mobile": { "$regex": loginObject.loginid, "$options": "i" }
                    }]
            },
            function(error,result){
                if(error){
                    logger.error(error);
                }
                else{
                    logger.debug('crud result'+ result);

                    if(result.length<1){
                        response.json(
                            {
                                status: "failed",
                                message:"Auth failed!"
                            }
                            );
                    }
                    else{
                        var i=0;
                        var numberOfUsersFound=0;
                        const encrypt=require('../encrypt');
                        while(i<result.length){
                            if(result[i].salt===undefined){
                                i++;
                            }
                            else{
                                var salt=result[i].salt;
                                var encryptedData=encrypt.sha512(loginObject.loginpassword,salt);

                                var encryptedPassword=encryptedData.hash;
                                if(result[i].password1===encryptedPassword){
                                    result[i].rememberMe=loginObject.rememberMe;
                                    numberOfUsersFound++;
                                    var sessionData=result[i];
                                }
                                i++;
                            }
                        }
                        if(numberOfUsersFound===1){

                            if(sessionData.role ==="Administrator")
                            {
                                const token_val = jwt.sign(
                                    {
                                        email: sessionData.useremail,
                                        userId: sessionData._id,
                                        role: sessionData.role
                                    },
                                    sessionData.role,
                                    {
                                        expiresIn: "1h"
                                    }
                                );
                                var responseObject={
                                    status: "success",
                                    message:"You are logged in!",
                                    token_id: token_val
                                };
                                utils.fillSession(request,response,sessionData,responseObject);
                            }
                            else
                            {
                                const token_val = jwt.sign(
                                    {
                                        email: sessionData.useremail,
                                        userId: sessionData._id,
                                        role: sessionData.role
                                    },
                                    sessionData.role,
                                    {
                                        expiresIn: "1y"
                                    }
                                    );
                                var responseObject={
                                    status: "success",
                                    message:"You are logged in!",
                                    token_id: token_val
                                };
                                utils.fillSession(request,response,sessionData,responseObject);
                            }

                        }
                        else if(numberOfUsersFound>1){
                            response.json(
                                {
                                    status: "failed",
                                    message:"Already signed in!"
                                });
                        }
                        else{
                            response.json(
                                {
                                    status: "failed",
                                    message:"Incorrect password!"
                                }
                                );
                        }
                    }
                }
            });
    },

};

module.exports =dbOperations;