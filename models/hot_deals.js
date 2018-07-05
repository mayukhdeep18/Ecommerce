const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    PRODUCT_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true, unique: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Hot_deals'},{strict: true});

module.exports = mongoose.model('Hot_deals', ProductSchema);