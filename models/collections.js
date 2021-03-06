const mongoose = require('mongoose');

const collectionsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    COLLECTIONS_ID: {type: String, required: true, unique: true},
    COLLECTIONS_NAME: {type: String, required: true, unique: true},
    PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true },
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Collections'},{strict: true});

module.exports = mongoose.model('Collections', collectionsSchema);