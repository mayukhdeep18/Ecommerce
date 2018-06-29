const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ECOMMERCE_PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_product_details'},
    CUSTOMER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},
    PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_details' },
    RATING_NUMBER: {type: Number},
    RATING_TITLE: {type: String},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, max: 1, default: "N"}
},{collection: 'Rating_details'},{strict: true});

module.exports = mongoose.model('Rating_details', RatingSchema);