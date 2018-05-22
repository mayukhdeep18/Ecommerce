const mongoose = require('mongoose');

const OfferSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true },
    ECOMMERCE_PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_product_details'},
    SPECIAL_OFFER_TITLE: {type: String, required: true},
    SPECIAL_OFFER_DESCRIPTION: {type: String, required: true},
    SPECIAL_OFFER_IMAGE_LINK: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Offer_details'},{strict: true});

module.exports = mongoose.model('Offer_details', OfferSchema);