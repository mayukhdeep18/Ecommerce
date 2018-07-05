const mongoose = require('mongoose');

const FilterOptProdSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    PRODUCT_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true },
    FILTER_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Filters', required: true },
    FILTER_OPTION_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Filter_options', required: true },
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Filter_options_products'},{strict: true});

module.exports = mongoose.model('Filter_options_products', FilterOptProdSchema);