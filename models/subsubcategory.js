const mongoose = require('mongoose');

const subsubcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    PRODUCT_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    PRODUCT_SUB_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Category', required: true },
    PRODUCT_SUB_SUB_CATEGORY_NAME: {type: String, required: true, unique: true},
    PRODCT_SUB_SUB_CATGRY_DESCRPTN: {type: String, required: true},
    PRODUCT_BRAND_NAME: {type: String },
    AVERAGE_CUSTOMER_REVIEW: {type: String },
    PRODUCT_PRICE_RANGE: {type: String , required: true},
    PRODUCT_DISCOUNT_RANGE: {type: String },
    PRODUCT_SELLER_NAME: {type: String },

    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Sub_Sub_Category'},{strict: true});

module.exports = mongoose.model('Sub_Sub_Category', subsubcategorySchema);