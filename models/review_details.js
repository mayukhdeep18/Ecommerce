const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ECOMMERCE_PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_product_details'},
    CUSTOMER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_details' },
    REVIEW_TITLE: {type: String},
    REVIEW_DESCRIPTION: {type: String},
    REVIEWER_NAME: {type: String},
    ECOMMERCE_REVIEW: {type: String},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1, default: "N"}
},{collection: 'Review_details'},{strict: true});

module.exports = mongoose.model('Review_details', ReviewSchema);