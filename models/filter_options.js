const mongoose = require('mongoose');

const FilterOptionsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    FILTER_ID: { type: mongoose.Schema.Types.ObjectId, ref:'Filters', required: true },
    CATEGORY_ID: {type: mongoose.Schema.Types.ObjectId, ref:'Category', required: true},
    URL_SLUG: {type: String},
    DISPLAY_TEXT: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Filter_options'},{strict: true});

module.exports = mongoose.model('Filter_options', FilterOptionsSchema);