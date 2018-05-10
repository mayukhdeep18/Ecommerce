const mongoose = require('mongoose');

const productimageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //PRODUCT_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true },
    PRODUCT_IMAGE_REF_1: { type: String, required:true },
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Product_images'},{strict: true});

module.exports = mongoose.model('Product_images', productimageSchema);