const mongoose = require('mongoose');

const FilterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    FILTER_CATEGORY_NAME: {type: String, required: true},
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Filters'},{strict: true});

module.exports = mongoose.model('Filters', FilterSchema);