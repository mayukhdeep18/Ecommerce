const mongoose = require("mongoose");
const str2json = require('string-to-json');
const Prod_flag = require("../models/product_details");

//get all product details by active flag
exports.product_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Prod_flag.find({ACTIVE_FLAG: 'Y'})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_AVAILABILITY_COUNT PERCENTAGE_DISCOUNT_ON_PRODUCT PRODUCT_SPECIAL_OFFER_PRICE SPECIAL_OFFER_DISCOUNT_FACTOR MINIMUM_ALLOWED_BUY_QUANTITY MAXIMUM_ALLOWED_BUY_QUANTITY PRODUCT_SPECIFICATIONS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_CATEGORY_ID')
            .populate('PRODUCT_SUB_CATEGORY_ID')
            .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
            .populate('SELLER_CATEGORY_ID')
            .populate('SELLER_SUB_CATEGORY_ID')
            .populate('ECOMMERCE_CATEGORY_ID')
            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
            .populate('PRODUCT_IMAGE_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        product_details: docs.map(doc => {
                            return {
                                product_details_id: doc._id,
                                product_category_id: doc.PRODUCT_CATEGORY_ID._id,
                                product_category_name: doc.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                product_sub_category_id: doc.PRODUCT_SUB_CATEGORY_ID._id,
                                product_sub_category_name: doc.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                product_sub_sub_category_id: doc.PRODUCT_SUB_SUB_CATEGORY_ID._id,
                                product_sub_sub_category_name: doc.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                                seller_category_id: doc.SELLER_CATEGORY_ID._id,
                                seller_category_name: doc.SELLER_CATEGORY_ID.SELLER_CATEGORY_NAME,
                                seller_sub_category_id: doc.SELLER_SUB_CATEGORY_ID._id,
                                seller_sub_category_name: doc.SELLER_SUB_CATEGORY_ID.SELLER_SUB_CATEGORY_NAME,
                                ecommerce_category_id: doc.ECOMMERCE_CATEGORY_ID._id,
                                ecommerce_category_name: doc.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                ecommerce_product_details_id: doc.ECOMMERCE_PRODUCT_DETAILS_ID._id,
                                ecommerce_product_name: doc.ECOMMERCE_PRODUCT_DETAILS_ID.ECOMMERCE_PRODUCT_NAME,
                                product_image_id: doc.PRODUCT_IMAGE_ID._id,
                                product_image_url: doc.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1,
                                product_name: doc.PRODUCT_NAME,
                                product_sub_title: doc.PRODUCT_SUB_TITLE,
                                product_description: doc.PRODUCT_DESCRIPTION,
                                product_price: doc.PRODUCT_PRICE,
                                product_availability_count: doc.PRODUCT_AVAILABILITY_COUNT,
                                percentage_discount_on_product: doc.PERCENTAGE_DISCOUNT_ON_PRODUCT,
                                product_special_offer_price: doc.PRODUCT_SPECIAL_OFFER_PRICE,
                                special_offer_discount_factor: doc.SPECIAL_OFFER_DISCOUNT_FACTOR,
                                minimum_allowed_buy_quantity: doc.MINIMUM_ALLOWED_BUY_QUANTITY,
                                maximum_allowed_buy_quantity: doc.MAXIMUM_ALLOWED_BUY_QUANTITY,
                                product_specifications: JSON.parse(doc.PRODUCT_SPECIFICATIONS),
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    status: "success",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            });
    }
    else if (actFlag === 'N')
    {
        Prod_flag.find({ACTIVE_FLAG: 'N'})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_AVAILABILITY_COUNT PERCENTAGE_DISCOUNT_ON_PRODUCT PRODUCT_SPECIAL_OFFER_PRICE SPECIAL_OFFER_DISCOUNT_FACTOR MINIMUM_ALLOWED_BUY_QUANTITY MAXIMUM_ALLOWED_BUY_QUANTITY PRODUCT_SPECIFICATIONS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_CATEGORY_ID')
            .populate('PRODUCT_SUB_CATEGORY_ID')
            .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
            .populate('SELLER_CATEGORY_ID')
            .populate('SELLER_SUB_CATEGORY_ID')
            .populate('ECOMMERCE_CATEGORY_ID')
            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
            .populate('PRODUCT_IMAGE_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        product_details: docs.map(doc => {
                            return {
                                product_details_id: doc._id,
                                product_category_id: doc.PRODUCT_CATEGORY_ID._id,
                                product_category_name: doc.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                product_sub_category_id: doc.PRODUCT_SUB_CATEGORY_ID._id,
                                product_sub_category_name: doc.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                product_sub_sub_category_id: doc.PRODUCT_SUB_SUB_CATEGORY_ID._id,
                                product_sub_sub_category_name: doc.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                                seller_category_id: doc.SELLER_CATEGORY_ID._id,
                                seller_category_name: doc.SELLER_CATEGORY_ID.SELLER_CATEGORY_NAME,
                                seller_sub_category_id: doc.SELLER_SUB_CATEGORY_ID._id,
                                seller_sub_category_name: doc.SELLER_SUB_CATEGORY_ID.SELLER_SUB_CATEGORY_NAME,
                                ecommerce_category_id: doc.ECOMMERCE_CATEGORY_ID._id,
                                ecommerce_category_name: doc.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                ecommerce_product_details_id: doc.ECOMMERCE_PRODUCT_DETAILS_ID._id,
                                ecommerce_product_name: doc.ECOMMERCE_PRODUCT_DETAILS_ID.ECOMMERCE_PRODUCT_NAME,
                                product_image_id: doc.PRODUCT_IMAGE_ID._id,
                                product_image_url: doc.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1,
                                product_name: doc.PRODUCT_NAME,
                                product_sub_title: doc.PRODUCT_SUB_TITLE,
                                product_description: doc.PRODUCT_DESCRIPTION,
                                product_price: doc.PRODUCT_PRICE,
                                product_availability_count: doc.PRODUCT_AVAILABILITY_COUNT,
                                percentage_discount_on_product: doc.PERCENTAGE_DISCOUNT_ON_PRODUCT,
                                product_special_offer_price: doc.PRODUCT_SPECIAL_OFFER_PRICE,
                                special_offer_discount_factor: doc.SPECIAL_OFFER_DISCOUNT_FACTOR,
                                minimum_allowed_buy_quantity: doc.MINIMUM_ALLOWED_BUY_QUANTITY,
                                maximum_allowed_buy_quantity: doc.MAXIMUM_ALLOWED_BUY_QUANTITY,
                                product_specifications: JSON.parse(doc.PRODUCT_SPECIFICATIONS),
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    status: "success",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            });
    }
    else
    {
        res
            .status(500)
            .json({
                status: "error",
                error: "Incorrect flag",
                data: {
                    message: "Incorrect flag value. Flag must be either Y or N"
                }
            });
    }
};