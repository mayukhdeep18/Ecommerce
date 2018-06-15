const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ECOMMERCE_PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_product_details'},
    CUSTOMER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    PRODUCT_ID: { type: String, required: true},
    REVIEW_TITLE: {type: String, required: true},
    REVIEW_DESCRIPTION: {type: String, required: true},
    REVIEWER_NAME: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Review_details'},{strict: true});

module.exports = mongoose.model('Review_details', ReviewSchema);