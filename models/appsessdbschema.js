'use strict';
//Schema for app session database
var mongoose = require("mongoose");
const schema = mongoose.Schema;

const sessionSchema= new schema({
    sessionid: String,
    userid: String,
    useremail: String,
    username: String,
    role: String,
    registrationdate: Date,
    emailverified: Boolean,
    temporarymobile: String,
    mobile: String,
    userinfo:
        {
            fullname: String,
            area: String,
            city: String,
            state: String,
            pincode: String,
            country: String
        }
});

const AppSession = mongoose.model('appsessions',sessionSchema);

module.exports=AppSession;