const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    BANNER_ID: {type: String, required: true, unique: true},
    BANNER_NAME: {type: String},
    BANNER_PICTURE: {type: String, required: true},
    BANNER_PRODUCT_URL: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Banner'},{strict: true});

module.exports = mongoose.model('Banner', ProductSchema);