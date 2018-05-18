const mongoose = require("mongoose");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");
const Sellercategory = require("../models/seller_category");
const Sellersubcategory = require("../models/seller_subcategory");
const EcommCategory = require("../models/ecommerce_category");
const EcommProduct = require("../models/ecommerce_product_details");
const Productimages = require("../models/product_images");
const Product = require("../models/product_details");
const str2json = require("string-to-json");


//get all active product details
exports.product_get_all = (req, res, next) => {
    Product.find({ACTIVE_FLAG:'Y'})
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
                    product: docs.map(doc => {
                        return {
                            product_id: doc._id,
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
                status: "error",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//create a new product detail
exports.product_create = (req, res, next) => {

    if(
        Category.findById(req.body.PRODUCT_CATEGORY_ID)&&
        Subcategory.findById(req.body.PRODUCT_SUB_CATEGORY_ID)&&
        Subsubcategory.findById(req.body.PRODUCT_SUB_SUB_CATEGORY_ID)&&
        Sellercategory.findById(req.body.SELLER_CATEGORY_ID)&&
        Sellersubcategory.findById(req.body.SELLER_SUB_CATEGORY_ID)&&
        EcommCategory.findById(req.body.ECOMMERCE_CATEGORY_ID)&&
        EcommProduct.findById(req.body.ECOMMERCE_PRODUCT_DETAILS_ID)&&
        Productimages.findById(req.body.PRODUCT_IMAGE_ID)
    )
    {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            PRODUCT_CATEGORY_ID: req.body.PRODUCT_CATEGORY_ID,
            PRODUCT_SUB_CATEGORY_ID: req.body.PRODUCT_SUB_CATEGORY_ID,
            PRODUCT_SUB_SUB_CATEGORY_ID: req.body.PRODUCT_SUB_SUB_CATEGORY_ID,
            SELLER_CATEGORY_ID: req.body.SELLER_CATEGORY_ID,
            SELLER_SUB_CATEGORY_ID: req.body.SELLER_SUB_CATEGORY_ID,
            ECOMMERCE_CATEGORY_ID: req.body.ECOMMERCE_CATEGORY_ID,
            ECOMMERCE_PRODUCT_DETAILS_ID: req.body.ECOMMERCE_PRODUCT_DETAILS_ID,
            PRODUCT_IMAGE_ID: req.body.PRODUCT_IMAGE_ID,
            PRODUCT_NAME: req.body.PRODUCT_NAME,
            PRODUCT_SUB_TITLE: req.body.PRODUCT_SUB_TITLE,
            PRODUCT_DESCRIPTION: req.body.PRODUCT_DESCRIPTION,
            PRODUCT_PRICE: req.body.PRODUCT_PRICE,
            PRODUCT_AVAILABILITY_COUNT: req.body.PRODUCT_AVAILABILITY_COUNT,
            PERCENTAGE_DISCOUNT_ON_PRODUCT: req.body.PERCENTAGE_DISCOUNT_ON_PRODUCT,
            PRODUCT_SPECIAL_OFFER_PRICE: req.body.PRODUCT_SPECIAL_OFFER_PRICE,
            SPECIAL_OFFER_DISCOUNT_FACTOR: req.body.SPECIAL_OFFER_DISCOUNT_FACTOR,
            MINIMUM_ALLOWED_BUY_QUANTITY: req.body.MINIMUM_ALLOWED_BUY_QUANTITY,
            MAXIMUM_ALLOWED_BUY_QUANTITY: req.body.MAXIMUM_ALLOWED_BUY_QUANTITY,
            PRODUCT_SPECIFICATIONS: JSON.stringify(req.body.PRODUCT_SPECIFICATIONS),
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        product
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "Product details stored",
                        product_details: {
                            _id: result._id,
                            PRODUCT_CATEGORY_ID: result.PRODUCT_CATEGORY_ID,
                            PRODUCT_SUB_CATEGORY_ID: result.PRODUCT_SUB_CATEGORY_ID,
                            PRODUCT_SUB_SUB_CATEGORY_ID: result.PRODUCT_SUB_SUB_CATEGORY_ID,
                            SELLER_CATEGORY_ID: result.SELLER_CATEGORY_ID,
                            SELLER_SUB_CATEGORY_ID: result.SELLER_SUB_CATEGORY_ID,
                            ECOMMERCE_CATEGORY_ID: result.ECOMMERCE_CATEGORY_ID,
                            ECOMMERCE_PRODUCT_DETAILS_ID: result.ECOMMERCE_PRODUCT_DETAILS_ID,
                            PRODUCT_IMAGE_ID: result.PRODUCT_IMAGE_ID,
                            PRODUCT_NAME: result.PRODUCT_NAME,
                            PRODUCT_SUB_TITLE: result.PRODUCT_SUB_TITLE,
                            PRODUCT_DESCRIPTION: result.PRODUCT_DESCRIPTION,
                            PRODUCT_PRICE: result.PRODUCT_PRICE,
                            PRODUCT_AVAILABILITY_COUNT: result.PRODUCT_AVAILABILITY_COUNT,
                            PERCENTAGE_DISCOUNT_ON_PRODUCT: result.PERCENTAGE_DISCOUNT_ON_PRODUCT,
                            PRODUCT_SPECIAL_OFFER_PRICE: result.PRODUCT_SPECIAL_OFFER_PRICE,
                            SPECIAL_OFFER_DISCOUNT_FACTOR: result.SPECIAL_OFFER_DISCOUNT_FACTOR,
                            MINIMUM_ALLOWED_BUY_QUANTITY: result.MINIMUM_ALLOWED_BUY_QUANTITY,
                            MAXIMUM_ALLOWED_BUY_QUANTITY: result.MAXIMUM_ALLOWED_BUY_QUANTITY,
                            PRODUCT_SPECIFICATIONS: JSON.parse(result.PRODUCT_SPECIFICATIONS),
                            UPDATED_BY: result.UPDATED_BY,
                            UPDATED_DATE: result.UPDATED_DATE,
                            ACTIVE_FLAG: result.ACTIVE_FLAG
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            });

    }
    else {
        res
            .status(404)
            .json({
                status: "error",
                error: "ID doesn't exist",
                data: {
                    message: "Foreign key id does not exist"
                }
            });
    }
};


//get product details by id
exports.product_details_get_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    Product.findById(id)
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
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        product_id: doc._id,
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
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        message: "No valid entry found for provided product ID"
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//update product details by id
exports.product_update_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'product details updated'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "success",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};

//delete product details by id
exports.product_delete_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'product deleted'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:
                    {
                        message: "An error has occurred as mentioned above"
                    }
            });
        });
};