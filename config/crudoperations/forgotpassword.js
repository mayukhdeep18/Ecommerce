'use strict';

const User = require("../../models/user");
const commonOperations=require("./commonoperations");
const logger = require("../logger");
var Cryptr = require('cryptr'),cryptr = new Cryptr('myTotalySecretKey');

const dbOperations= {

/////Sending link with token
    checkEmail:function (request,response){
        logger.debug('crud forgotpass checkEmail');

        var ForgotObject =cryptr.decrypt(request);
        console.log("decrypted_id",ForgotObject)
        User.find({"useremail":ForgotObject},function(error,result){
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'+ result);
                if(result[0]!=undefined){
                    commonOperations.sendLink(request,"forgotpassword","forgotpasswordtoken");
                    //need to be a callback function
                    response.json({message:"sent"});
                }
                else
                {
                    response.json({message:"notFound"});
                }
            }
        });
    },

/////checking token
    passwordReset:function(request,response){
        logger.debug('crud forgotpass passwordReset');
        var that=this;
        var PasswordObject=request;

        console.log("object",PasswordObject);

        User.find({
                "$and":[
                    {
                        "useremail":PasswordObject.userEmail
                    },
                    {
                        "forgotpasswordtoken":PasswordObject.token
                    }
                ]
            }
            ,function(error,result){
                if(error){
                    logger.error(error);
                }
                else{
                    logger.debug('crud result'+ result);
                    var date=new Date();

                    if(result.length<1){
                        response.json({message:"failed at result"});
                    }
                    else if((Math.abs(date-result[0].passwordtokenstamp))>86400000){
                        response.json({message:"failed due to timestamp"});
                    }
                    else{
                        if(PasswordObject.NewPassword!=undefined){
                            that.saveNewPassword(request,response);
                        }
                        else{
                            response.json({message:"pass"});
                        }
                    }
                }
            });
    },

/////////Saving new password
    saveNewPassword:function (request,response){
        logger.debug('crud forgotpass saveNewPassword');

        var newPasswordObject=request;

        const encrypt=require('../encrypt');
        var salt=encrypt.genRandomString(16);
        var encryptedData=encrypt.sha512(newPasswordObject.NewPassword,salt);

        newPasswordObject.NewPassword=encryptedData.hash;
        newPasswordObject.salt=encryptedData.salt;

        User.update({
                "useremail":newPasswordObject.userEmail
            },
            {
                $set:{
                    "password1":newPasswordObject.NewPassword,
                    "salt":newPasswordObject.salt,
                    "emailverified":true,
                    "forgotpasswordtoken":undefined,
                }
            },function(error,result){
                if(error){
                    logger.error(error);
                }
                else{
                    logger.debug('crud result'+ result);
                    response.json({message:"successfully changed password"});
                }
            });
    },

};

module.exports =dbOperations;