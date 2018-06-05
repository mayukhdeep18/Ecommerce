'use strict';

const express = require('express');
const router = express.Router();
const dbOperations = require("../config/crudoperations/profile");
const commonOperations=require("../config/crudoperations/commonoperations");
const validate =require("../config/validate");
const multer = require('multer');
const logger = require("../config/logger");

//upload picture

exports.upload_picture = (req, res, next) => {
    logger.debug('routes profile uploadPic');
    var isValidSessionid=false;
    var webSessionExist=false;

    //multer code for image upload
    var picStorage = multer.diskStorage({
        destination: function (request, file, callback) {


            callback(null, "./uploads/User_data");
        },
        filename: function (request, file, callback) {
            callback(null,request.uploadEmail+"profile.jpeg");
        }
    });

    var uploadPic = multer({
        storage: picStorage,
        limits: { fileSize: 1024 * 1024 * 5 },
        fileFilter: function (request, file, cb) {

            if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
                request.fileValidationError = true;
                return cb(null, false, new Error('Invalid file type'));
            }
            cb(null, true);
        }
    }).single('file');


    var callUpload = function (request, response) {
        request.fileValidationError = false;
        try {
            uploadPic(request, response, function (error) {
                if (error) {
                    logger.error(error);
                    response.json({ message: "uploadPic fail"});
                } else if (request.fileValidationError === true) {
                    logger.error("request.fileValidationError", request.fileValidationError);
                    response.json({ message: "fileValidation fail" });
                }
                else {
                    response.json({ message: "success" });
                }
            })
        }
        catch (error) {
            logger.error(error);
        }
    };

    if(req.body.appCall===true && req.body.sessionid!=undefined){
        isValidSessionid=validate.string(req.body.sessionid);
    }
    else if(req.session.user){
        webSessionExist=true;
    }

    if(webSessionExist===true){

        req.uploadEmail =  req.session.user.useremail;
        callUpload(req, res);
    }
    else if(isValidSessionid===true){
        var userData={};
        commonOperations.getProfileData(req.body.sessionid,userData,function(userData){
            if(userData!=undefined){
                req.uploadEmail = userData.useremail;
                callUpload(req, res);
            }
            else {
                res.json({message:"unknown"});
            }
        });
    }
    else{
        res.json({message:"unknown"});
    }
};

/////////////Change Username

exports.change_username = (request, response, next) => {
    logger.debug('routes profile changeUsername');

    var isValidSessionid=false;
    var webSessionExist=false;

    if(request.body.appCall===true && request.body.sessionid!=undefined){
        isValidSessionid=validate.string(request.body.sessionid);
    }
    else if(request.session.user){
        webSessionExist=true;
    }

    request.body.Username=request.body.Username.toLowerCase();
    var isValidUsername=validate.username(request.body.Username);

    if(isValidUsername===true && webSessionExist===true){
        var userData=request.session.user;
        dbOperations.changeUsername(request,response,userData);
    }
    else if(isValidUsername===true && isValidSessionid===true){
        var userData={};
        commonOperations.getProfileData(request.body.sessionid,userData,function(userData){
            if(userData!=undefined){
                dbOperations.changeUsername(request,response,userData);
            }
            else{
                response.json({message:"unknown"});
            }
        });
    }
    else{
        response.json({message:"unknown"});
    }
};

////////////Edit/Update profile data
exports.edit_profile_data = (request, response, next) => {
    logger.debug('routes profile updateProfileData');
    var isValidSessionid=false;
    var webSessionExist=false;

    if(request.body.appCall===true && request.body.sessionid!=undefined){
        isValidSessionid=validate.string(request.body.sessionid);
    }
    else if(request.session.user){
        webSessionExist=true;
    }

    var profileObject=request.body;
    var isValidName=validate.name(profileObject.fullname);
    var isValidArea=validate.string(profileObject.area);
    var isValidCity=validate.string(profileObject.city);
    var isValidState=validate.string(profileObject.state);
    var isValidPincode=validate.number(profileObject.pincode);
    var isValidCountry=validate.string(profileObject.country);

    if(isValidName===true && isValidArea===true && isValidCity===true && isValidState===true
        && isValidPincode===true && isValidCountry===true && webSessionExist===true){
        var userData=request.session.user;
        dbOperations.updateProfileData(request,response,userData);
    }
    else if(isValidName===true && isValidArea===true && isValidCity===true && isValidState===true
        && isValidPincode===true && isValidCountry===true && isValidSessionid===true){
        var userData={};
        commonOperations.getProfileData(request.body.sessionid,userData,function(userData){
            if(userData!=undefined){
                dbOperations.updateProfileData(request,response,userData);
            }
            else{
                response.json({message:"unknown"});
            }
        });
    }
    else{
        response.json({message:"unknown"});
    }
};

////////////Mobile no. verification
/////Send Code

exports.mobile_send_verification = (request, response, next) => {
    logger.debug('routes profile updateMobile');

    var isValidSessionid=false;
    var webSessionExist=false;

    if(request.body.appCall===true && request.body.sessionid!=undefined){
        isValidSessionid=validate.string(request.body.sessionid);
    }
    else if(request.session.user){
        webSessionExist=true;
    }

    var mobileObject=request.body;
    var isValidCountryCode=validate.code(mobileObject.CountryCode);
    var isValidMobile=validate.mobile(mobileObject.MobileNumber);

    if(isValidCountryCode===true && isValidMobile===true && webSessionExist===true){
        var userData=request.session.user;
        dbOperations.sendVerificationCode(request,response,userData);
    }
    else if(isValidCountryCode===true && isValidMobile===true && isValidSessionid===true){
        var userData={};
        commonOperations.getProfileData(request.body.sessionid,userData,function(userData){
            if(userData!=undefined){
                dbOperations.sendVerificationCode(request,response,userData);
            }
            else{
                response.json({message:"unknown"});
            }
        });
    }
    else{
        response.json({message:"unknown"});
    }
};

//////////////Verify Code

exports.mobile_code_verification = (request, response, next) => {
    logger.debug('routes profile verifyCode');

    var isValidSessionid=false;
    var webSessionExist=false;

    if(request.body.appCall===true && request.body.sessionid!=undefined){
        isValidSessionid=validate.string(request.body.sessionid);
    }
    else if(request.session.user){
        webSessionExist=true;
    }

    var codeObject=request.body;
    var isValidCode=validate.code(codeObject.VCode);

    if(isValidCode===true && webSessionExist===true){
        var userData=request.session.user;
        dbOperations.verifyCode(request,response,userData);
    }
    else if(isValidCode===true && isValidSessionid===true){
        var userData={};
        commonOperations.getProfileData(request.body.sessionid,userData,function(userData){
            if(userData!=undefined){
                dbOperations.verifyCode(request,response,userData);
            }
            else{
                response.json({message:"unknown"});
            }
        });
    }
    else{
        response.json({message:"unknown"});
    }
};


////////////Change Password
exports.change_password = (request, response, next) => {
    logger.debug('routes profile setNewPassword');

    var isValidSessionid=false;
    var webSessionExist=false;

    if(request.body.appCall===true && request.body.sessionid!=undefined){
        isValidSessionid=validate.string(request.body.sessionid);
    }
    else if(request.session.user){
        webSessionExist=true;
    }

    var passwordObject=request.body;
    var isValidOldPassword=validate.password(passwordObject.oldpassword);
    var isValidNewPassword=validate.password(passwordObject.password1);

    if(isValidOldPassword===true && isValidNewPassword===true && webSessionExist===true){
        var userData=request.session.user;
        dbOperations.checkPassword(request,response,userData);
    }
    else if(isValidOldPassword===true && isValidNewPassword===true && isValidSessionid===true){
        var userData={};
        commonOperations.getProfileData(request.body.sessionid,userData,function(userData){
            if(userData!=undefined){
                dbOperations.checkPassword(request,response,userData);
            }
            else{
                response.json({message:"unknown"});
            }
        });
    }
    else{
        response.json({message:"unknown"});
    }
};
