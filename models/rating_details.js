const mongoose = require('mongoose');

const RatingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    ECOMMERCE_PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_product_details'},
    CUSTOMER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true },
    RATING_NUMBER: {type: String, required: true},
    RATING_TITLE: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Rating_details'},{strict: true});

module.exports = mongoose.model('Rating_details', RatingSchema);