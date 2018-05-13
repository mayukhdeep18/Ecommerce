const mongoose = require('mongoose');

const sellersubcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SELLER_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller_Category', required: true },
    SELLER_SUB_CATEGORY_NAME: {type: String, required: true, unique: true},
    SELLER_SUB_CATEGORY_DESCRIPTION: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Seller_Sub_Cateogry'},{strict: true});

module.exports = mongoose.model('Seller_Sub_Cateogry', sellersubcategorySchema);