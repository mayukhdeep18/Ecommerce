const mongoose = require('mongoose');

const AnalyticsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CUSTOMER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true },
    CUSTOMER_PRODUCT_CLICK_COUNT: {type: String, required: true},
    CUSTOMER_PRODUCT_SHARE_COUNT: {type: String, required: true},
    ADDED_TO_WISHLIST_FLAG: {type: String, required: true},
    INTERNET_PROTOCOL_ADDRESS: {type: String, required: true},
    MEDIA_ACCESS_CONTROL_ADDRESS: {type: String, required: true},
    INTRNATNL_MOBIL_EQUIPMNT_IDNTY: {type: String, required: true},
    MOBILE_NETWORK_CODE: {type: String, required: true},
    MOBILE_COUNTRY_CODE: {type: String, required: true},
    OPERATING_SYSTEM_TYPE: {type: String, required: true},
    OPERATING_SYSTEM_VERSION: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Customer_analytics'},{strict: true});

module.exports = mongoose.model('Customer_analytics', AnalyticsSchema);