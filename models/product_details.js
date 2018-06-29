const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
    PRODUCT_ID: {type: String, required: true},
    PRODUCT_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    PRODUCT_SUB_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Category', required: true },
    PRODUCT_SUB_SUB_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Sub_Category', required: true },
    SELLER_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller_Category'},
    SELLER_SUB_CATEGORY_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller_Sub_Cateogry'},
    ECOMMERCE_CATEGORY_ID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_category'}],
    ECOMMERCE_PRODUCT_DETAILS_ID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ecommerce_product_details' }],
    PRODUCT_IMAGE_LINKS: { type: String},
    PRODUCT_NAME: {type: String, required: true},
    PRODUCT_SUB_TITLE: {type: String, required: true},
    PRODUCT_DESCRIPTION: {type: String, required: true},
    PRODUCT_PRICE: {type: Number},
    PRODUCT_AVAILABILITY_COUNT: {type: String},
    PERCENTAGE_DISCOUNT_ON_PRODUCT: {type: String},
    PRODUCT_SPECIAL_OFFER_PRICE: {type: String},
    SPECIAL_OFFER_DISCOUNT_FACTOR: {type: String},
    MINIMUM_ALLOWED_BUY_QUANTITY: {type: String},
    MAXIMUM_ALLOWED_BUY_QUANTITY: {type: String},
    PRODUCT_SPECIFICATIONS: {type: String, required: true},
    PRODUCT_URL: {type: String},
    LEAST_PRICE_ECOMMERCE: {type: String},
    MEAN_RATING: {type: Number},
    RATING_COUNT: {type: Number},
    REVIEW_COUNT: {type: Number},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Product_details'},{strict: true});

module.exports = mongoose.model('Product_details', ProductSchema);