var mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   // _id: mongoose.Schema.Types.ObjectId,
    userid: {type: String, trim: true, unique: true, sparse: true},
    useremail: {type: String, trim: true, unique: true, sparse: true},
    username: {type: String, trim: true, unique: true, sparse: true},
    password1: String,
    salt: String,
    mobile: String,
    userinfo: {
        fullname: String,
        area: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    emailverified: Boolean,
    emailactivationtoken: String,
    forgotpasswordtoken: String,
    passwordtokenstamp: Date,
    mobileverificationcode: String,
    temporarymobile: String,
    role: String,
    registrationdate: Date,
    /*social: [
        {
            connection: String,
            sId: String,
            accessToken: String
        }
    ]*/
},
    {autoIndex: false });

const User = mongoose.model('User', userSchema);

module.exports = User;
