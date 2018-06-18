const mongoose = require('mongoose');

const EcommerceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ECOMMERCE_ID: {type: String, required: true, unique: true},
    ECOMMERCE_NAME: {type: String, required: true, unique: true},
    ECOMMERCE_DESCRIPTION: {type: String},
    ECOMMERCE_LOGO: {type: String, required: true},
    ECOMMERCE_WEB_URL: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Ecommerce_category'},{strict: true});

module.exports = mongoose.model('Ecommerce_category', EcommerceSchema);