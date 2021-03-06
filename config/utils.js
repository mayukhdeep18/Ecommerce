'use strict';

const config =require("./config");
const AppSession=require('../models/appsessdbschema');
const logger = require("./logger");
//const twilio = require("twilio");
var Cryptr = require('cryptr'),cryptr = new Cryptr('myTotalySecretKey');

const utils={

    fillWebSession:function(request,userData) {
        logger.debug('config utils fillWebSession');
        request.session.user=userData;
        if(userData.rememberMe==true){
            var thirtyDays = 30*24*60*60*1000;
            request.session.cookie.expires = new Date(Date.now() + thirtyDays);
        }
    },

    fillAppSession:function(userData,responseObject,response){
        logger.debug('config utils fillAppSession');

        userData._id=undefined; //prevent duplicate record error
        userData=userData.toObject();
        userData.sessionid=responseObject.sessionid;

        AppSession.create(userData,function(error,result){
            if(error){
                logger.error(error);
            }
            else{
                response.send(responseObject);
            }
        });
    },

    fillSession:function(request,response,result,responseObject){
        logger.debug('config utils fillSession');

        //data is freezed object so no issue till not adding any new property
        var Data=result;
        Data.password1=undefined;
        Data.salt=undefined;
        Data.passwordtokenstamp=undefined;
        Data.emailactivationtoken=undefined;
        Data.forgotpasswordtoken=undefined;
        Data.mobileverificationcode=undefined;
        Data.social=undefined;

        if(request.body.appCall===true){
            if(request.body.sessionid!=undefined){
                AppSession.find({sessionid:request.body.sessionid}).remove(function(error,result){
                    if(error){
                        logger.error(error);
                    }
                });
            }
            var randomString=this.randomStringGenerate(32);
            responseObject.sessionid=randomString+Data.username;
            responseObject.Data=Data;
            this.fillAppSession(Data,responseObject,response);
        }
        else{
            this.fillWebSession(request,Data);
            responseObject.Data=Data;
            response.send(responseObject);
        }
    },

    webSessionDestroy:function(request,response){
        logger.debug('config utils webSessionDestroy');
        request.session.destroy(function(error) {
            if(error){
                logger.error(error);
            }
            else{
                response.json({message:"success"});
            }
        });
    },

    appSessionDestroy:function(id,response){
        logger.debug('config utils appSessionDestroy');

        AppSession.find({sessionid:id}).remove(function(error,result){
            if(error){
                logger.error(error);
            }
            else{
                logger.debug('crud result'+ result);
                response.json({message:"success"});
            }
        });
    },

    sendMail:function(To,Subject,EmailText,Html_Body){
        logger.debug('config utils sendMail');
        const nodeMailer = require("nodemailer");
        var URL="smtps://"+config.SMTPS_EMAIL+":"+config.SMTPS_PASSWORD+"@"+config.SMTPS_URL;


        var transporter = nodeMailer.createTransport(URL);
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.COMPANY_NAME+ '<h='+config.SMTPS_EMAIL+'>' , // sender address
            to: To, // list of receivers
            subject: Subject, // Subject line
            text: EmailText, // plaintext body
            html: Html_Body // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                logger.error(error);
                console.log("this is the error",error);
            }
            if (info != undefined) {
                console.log("true");
                logger.info('Message sent: ' + info.response);
            } else {
                logger.error("error sending mail");
            }
        });
    },

    randomStringGenerate:function(x){
        logger.debug('config utils randomStringGenerate');
        const randomString = require("randomstring");
        return randomString.generate(x);
    },

    sendSms:function(number,body){
        logger.debug('config utils sendSms');
        const accountSid = 'AC53aff46e6aa0c284b7a6271b0a58a1e4';
        const authToken = '219e21f85b404556b179a6f17b0030fe';
        const client = require('twilio')(accountSid, authToken);

        client.messages.create({
            body: body,
            to: number,  // Text this number
            from: '+12345678901', // From a valid Twilio number
        }, function(error, message) {
            if(error){
                logger.error(error);
            }
            else{
                logger.info(message.sid);
            }
        });
    },

    createMail: function (userdata, type) {
        logger.debug('utils create mail',type,userdata);
        var email_id = cryptr.decrypt(userdata.email)


        const emails = require('./emails');
        var that = this;
        var text = "";
        switch (type) {
            case "verificationlink":
                text = "Please verify your email by clicking " + userdata.url;
                that.sendMail(email_id, emails.verification.subject, text, emails.verification.htmlBody);
                break;

            case "forgotpassword":
                text = "Set a new password by clicking " + userdata.url;
                that.sendMail(email_id, emails.password.subject, text, emails.password.htmlBody);
                break;

            case "signupadmin":
                var to = [emails.admin];
                text = "New " + userdata.role + " registered with email: " + userdata.useremail;
                that.sendMail(to, emails.signupAdmin.subject, text, emails.signupAdmin.htmlBody);
                break;

        }
    }

};

module.exports=utils;