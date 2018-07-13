'use strict';



const commonOperations=require("./commonoperations");
const mongoose = require("mongoose");
const logger = require("../logger");
const User = require("../../models/user");
const encrypt=require('../encrypt');
var Cryptr = require('cryptr'),cryptr = new Cryptr('myTotalySecretKey');

const dbOperations={

    ////Check Email > Username if already exists
    checkUser:function (request,response){
        logger.debug('crud signup checkUser');
        var that=this;
        var userObject =request.body;

        User.find({
                "useremail":userObject.useremail
            },
            function(error,result){
                if(error){
                    logger.error(error);
                }
                else{
                    logger.debug('crud result'+ result);
                    if(result[0]!=undefined){
                        response.json(
                            {
                                status: "failed",
                                message:"Email already registered"
                            }
                            );
                    }
                    else
                    {
                        var obj={
                            "username":userObject.username.toLowerCase(),
                            "notFound":undefined
                        };
                        commonOperations.checkUsername(obj,function(){

                            if(obj.notFound===true){
                                that.addUser(request,response);
                            }
                            else{
                                response.json(
                                    {
                                        status: "failed",
                                        message:"Username already taken"
                                    }
                                    );
                            }
                        });
                    }
                }
            });
    },
    /////////////Adding new user
    addUser:function(request,response){


        logger.debug('crud signup addUser');
        const utils =require("../utils");

        var data={};
       // data._id = new mongoose.Types.ObjectId(),
        data.useremail=request.body.useremail.toLowerCase();
        data.username=request.body.username.toLowerCase();
        data.password1=request.body.password1;


        data.role="Customer";


        var salt=encrypt.genRandomString(16);
        var encryptedData=encrypt.sha512(data.password1,salt);

        data.password1=encryptedData.hash;
        data.salt=encryptedData.salt;

        data.userid = utils.randomStringGenerate(32);

        data.registrationdate=new Date();
        data.emailverified=false;

        User.create(data,function(error,result){
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'+ result);
                var crypt_email = cryptr.encrypt(result.useremail);

                commonOperations.sendLink(crypt_email,"emailactivate","emailactivationtoken");
                var responseObject={
                    status: "success",
                    message:"Please activate your email using the verification link sent at your email address!",
                };
                utils.fillSession(request,response,result,responseObject);
            }
        });
    },

    ////Check Email > Username if already exists
    checkAdminUser:function (request,response){
        logger.debug('crud signup checkUser');
        var that=this;
        var userObject =request.body;

        User.find({
                "useremail":userObject.useremail
            },
            function(error,result){
                if(error){
                    logger.error(error);
                }
                else{
                    logger.debug('crud result'+ result);
                    if(result[0]!=undefined){
                        response.json(
                            {
                                status: "failed",
                                message:"Email already registered"
                            }
                        );
                    }
                    else
                    {
                        var obj={
                            "username":userObject.username,
                            "notFound":undefined
                        };
                        commonOperations.checkUsername(obj,function(){

                            if(obj.notFound===true){
                                that.addAdminUser(request,response);
                            }
                            else{
                                response.json(
                                    {
                                        status: "failed",
                                        message:"Username already taken"
                                    }
                                );
                            }
                        });
                    }
                }
            });
    },
    /////////////Adding new user
    addAdminUser:function(request,response){


        logger.debug('crud signup addUser');
        const utils =require("../utils");

        var data={};
        // data._id = new mongoose.Types.ObjectId(),
        data.useremail=request.body.useremail;
        data.username=request.body.username;
        data.password1=request.body.password1;


        data.role="Administrator";


        var salt=encrypt.genRandomString(16);
        var encryptedData=encrypt.sha512(data.password1,salt);

        data.password1=encryptedData.hash;
        data.salt=encryptedData.salt;

        data.userid = utils.randomStringGenerate(32);

        data.registrationdate=new Date();
        data.emailverified=false;

        User.create(data,function(error,result){


            if(error){
                logger.error(error);

            }
            else{


                logger.debug('crud result'+ result);
                var crypt_email = cryptr.encrypt(result.useremail);

                commonOperations.sendLink(crypt_email,"emailactivate","emailactivationtoken");
                var responseObject={
                    status: "success",
                    message:"Please activate your email using the verification link sent at your email address!",
                };
                utils.fillSession(request,response,result,responseObject);
            }
        });
    },
};

module.exports =dbOperations;