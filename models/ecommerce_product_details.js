const mongoose = require('mongoose');

const ecommerceProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ECOMMERCE_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_category', required: true },
    ECOMMERCE_NAME: {type: String, required: true},
    ECOMMERCE_PRODUCT_ID: {type: String , required: true},
    ECOMMERCE_PRODUCT_NAME: {type: String, required: true},
    ECOMMERCE_PRODUCT_PRICE: {type: Number, required: true},
    ECOMMERCE_PRODCT_SHPMNT_DURATN: {type: String },
    PRODUCT_URL: {type: String, required: true },

    PRODUCT_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product_details'},
    CATEGORY_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    SUB_CATEGORY_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Category'},
    SUB_SUB_CATEGORY_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Sub_Category'},

    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, max: 1,default: "N"}
},{collection: 'Ecommerce_product_details'},{strict: true});

module.exports = mongoose.model('Ecommerce_product_details', ecommerceProductSchema);
