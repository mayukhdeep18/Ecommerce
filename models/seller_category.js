const mongoose = require('mongoose');

const sellercategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SELLER_CATEGORY_NAME: {type: String, required: true, unique: true},
    SELLER_CATEGORY_DESCRIPTION: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Seller_Category'},{strict: true});

module.exports = mongoose.model('Seller_Category', sellercategorySchema);