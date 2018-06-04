var mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: String,
    useremail: String,
    username: String,
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
    social: [
        {
            connection: String,
            sId: String,
            accessToken: String
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
