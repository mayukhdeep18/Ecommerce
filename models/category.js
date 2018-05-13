const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    PRODUCT_CATEGORY_NAME: {type: String, required: true, unique: true},
PRODUCT_CATEGORY_DESCRIPTION: {type: String, required: true},
UPDATED_BY: {type: String, default: "Zoom_admin"},
UPDATED_DATE: {type: Date, default: Date()},
ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Category'},{strict: true});

module.exports = mongoose.model('Category', categorySchema);