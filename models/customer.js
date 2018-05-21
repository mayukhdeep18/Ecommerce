const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CUSTOMER_NAME: { type: String, required:true },
    CUSTOMER_DATE_OF_BIRTH: { type: Date, required:true },
    CUSTOMER_GENDER: { type: String, required:true },
    CUSTOMER_EMAIL_ID:{
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    CUSTOMER_ADDRESS_LINE_1: { type: String, required:true },
    CUSTOMER_ADDRESS_LINE_2: { type: String},
    CUSTOMER_CITY_NAME: { type: String, required:true },
    CUSTOMER_STATE_NAME: { type: String, required:true },
    CUSTOMER_ZIP: { type: String, required:true },
    CUSTOMER_PHONE_NUMBER: { type: String, required:true },
    CUSTOMER_PROFILE_PICTURE_LINK: { type: String},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Customer'},{strict: true});

module.exports = mongoose.model('Customer', customerSchema);
