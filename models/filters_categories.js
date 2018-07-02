const mongoose = require('mongoose');

const FilterCategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    FILTER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Filters', required: true },
    CATEGORY_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    SUB_CATEGORY_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Category'},
    SUB_SUB_CATEGORY_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Sub_Category'},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Filters_categories'},{strict: true});

module.exports = mongoose.model('Filters_categories', FilterCategorySchema);