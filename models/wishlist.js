const mongoose = require('mongoose');

const WishlistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    CUSTOMER_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    PRODUCT_ID: {type: mongoose.Schema.Types.ObjectId, ref: 'Product_details', required: true },
    UPDATED_BY: {type: String, default: "Zoom_admin"},
    UPDATED_DATE: {type: Date, default: Date()},
    ACTIVE_FLAG: {type: String, required: true, max: 1}
},{collection: 'Wishlist'},{strict: true});

module.exports = mongoose.model('Wishlist', WishlistSchema);