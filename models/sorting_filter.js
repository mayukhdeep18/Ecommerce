const mongoose = require('mongoose');

const SortingFilterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    SORTING_FILTER_ID: {type: String, required: true},
    SORTING_FILTER_NAME: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Sorting_Filters'},{strict: true});

module.exports = mongoose.model('Sorting_Filters', SortingFilterSchema);