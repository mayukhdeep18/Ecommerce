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
const Rating = require("../models/rating_details");
const Review = require("../models/review_details");
const str2json = require("string-to-json");


//get all active product details
exports.product_get_all = (req, res, next) => {
    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];
    Product.find({ACTIVE_FLAG:'Y'})
        .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_AVAILABILITY_COUNT PERCENTAGE_DISCOUNT_ON_PRODUCT PRODUCT_SPECIAL_OFFER_PRICE SPECIAL_OFFER_DISCOUNT_FACTOR MINIMUM_ALLOWED_BUY_QUANTITY MAXIMUM_ALLOWED_BUY_QUANTITY PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
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

            for( var prod_item of docs)
            {
                //create an array with the product id, product name, product specifications, product price, product image url
                prod_cat_arr.push({prod_id: prod_item._id,
                    prod_category: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                    product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                    product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                    seller_category_name: prod_item.SELLER_CATEGORY_ID.SELLER_CATEGORY_NAME,
                    seller_sub_category_name: prod_item.SELLER_SUB_CATEGORY_ID.SELLER_SUB_CATEGORY_NAME,
                    prod_name: prod_item.PRODUCT_NAME,
                    prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                    prod_rating: prod_item.MEAN_RATING,
                    prod_review_count: prod_item.REVIEW_COUNT,
                    prod_price: prod_item.PRODUCT_PRICE,
                    prod_img_url: prod_item.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1,

                    product_sub_title: prod_item.PRODUCT_SUB_TITLE,
                    product_description: prod_item.PRODUCT_DESCRIPTION,

                    product_availability_count: prod_item.PRODUCT_AVAILABILITY_COUNT,
                    percentage_discount_on_product: prod_item.PERCENTAGE_DISCOUNT_ON_PRODUCT,
                    product_special_offer_price: prod_item.PRODUCT_SPECIAL_OFFER_PRICE,
                    special_offer_discount_factor: prod_item.SPECIAL_OFFER_DISCOUNT_FACTOR,
                    minimum_allowed_buy_quantity: prod_item.MINIMUM_ALLOWED_BUY_QUANTITY,
                    maximum_allowed_buy_quantity: prod_item.MAXIMUM_ALLOWED_BUY_QUANTITY,


                    updated_by_user: prod_item.UPDATED_BY,
                    updated_on: prod_item.UPDATED_DATE,
                    isActive: prod_item.ACTIVE_FLAG})
            }

            //look up ecommerce details on the basis of category id
            EcommProduct.find({ACTIVE_FLAG:'Y'})
                .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                .populate('ECOMMERCE_CATEGORY_ID')
                .populate('PRODUCT_ID')
                .exec()
                .then(ecom_doc => {
                    //traverse through array with product details
                    for (var prod_cat_item of prod_cat_arr) {

                        //traverse through the ecommerce details object looked up on the basis of category id
                        for (var ecom_item of ecom_doc) {
                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                            var outer_id = prod_cat_item.prod_id;
                           // console.log('outer_id',outer_id);

                            var inner_id = ecom_item.PRODUCT_ID._id;
                            //console.log('inner_id',inner_id);

                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                            if (outer_id.equals(inner_id)) {
                                prod_arr.push({
                                    ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                    ecomm_url: ecom_item.PRODUCT_URL,
                                    ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                    ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                });

                            }
                        }

                        //console.log('prod_arr',prod_arr);

                        //push the ecommerce details array and the corresponding product details in the final array
                        prod_final_arr.push({prod_details: prod_cat_item, ecom_details: prod_arr})

                        //clear the temporary array to store filter options value
                        prod_arr = [];
                    }

                    //final output
                    res.status(200).json({
                        status: "success",
                        error: "",
                        data: {
                            product_details: prod_final_arr
                        }
                    });
                })
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
            PRODUCT_IMAGE_ID: req.body.PRODUCT_IMAGE_ID,
            PRODUCT_NAME: req.body.PRODUCT_NAME,
            PRODUCT_SUB_TITLE: req.body.PRODUCT_SUB_TITLE,
            PRODUCT_DESCRIPTION: req.body.PRODUCT_DESCRIPTION,

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

                            PRODUCT_IMAGE_ID: result.PRODUCT_IMAGE_ID,
                            PRODUCT_NAME: result.PRODUCT_NAME,
                            PRODUCT_SUB_TITLE: result.PRODUCT_SUB_TITLE,
                            PRODUCT_DESCRIPTION: result.PRODUCT_DESCRIPTION,

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
    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];
    Product.find({_id: id})
        .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_AVAILABILITY_COUNT PERCENTAGE_DISCOUNT_ON_PRODUCT PRODUCT_SPECIAL_OFFER_PRICE SPECIAL_OFFER_DISCOUNT_FACTOR MINIMUM_ALLOWED_BUY_QUANTITY MAXIMUM_ALLOWED_BUY_QUANTITY PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
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

            for (var prod_item of docs) {
                //create an array with the product id, product name, product specifications, product price, product image url
                prod_cat_arr.push({
                    prod_id: prod_item._id,
                    prod_category: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                    product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                    product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                    seller_category_name: prod_item.SELLER_CATEGORY_ID.SELLER_CATEGORY_NAME,
                    seller_sub_category_name: prod_item.SELLER_SUB_CATEGORY_ID.SELLER_SUB_CATEGORY_NAME,
                    prod_name: prod_item.PRODUCT_NAME,
                    prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                    prod_rating: prod_item.MEAN_RATING,
                    prod_review_count: prod_item.REVIEW_COUNT,
                    prod_price: prod_item.PRODUCT_PRICE,
                    prod_img_url: prod_item.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1,

                    product_sub_title: prod_item.PRODUCT_SUB_TITLE,
                    product_description: prod_item.PRODUCT_DESCRIPTION,

                    product_availability_count: prod_item.PRODUCT_AVAILABILITY_COUNT,
                    percentage_discount_on_product: prod_item.PERCENTAGE_DISCOUNT_ON_PRODUCT,
                    product_special_offer_price: prod_item.PRODUCT_SPECIAL_OFFER_PRICE,
                    special_offer_discount_factor: prod_item.SPECIAL_OFFER_DISCOUNT_FACTOR,
                    minimum_allowed_buy_quantity: prod_item.MINIMUM_ALLOWED_BUY_QUANTITY,
                    maximum_allowed_buy_quantity: prod_item.MAXIMUM_ALLOWED_BUY_QUANTITY,


                    updated_by_user: prod_item.UPDATED_BY,
                    updated_on: prod_item.UPDATED_DATE,
                    isActive: prod_item.ACTIVE_FLAG
                })
            }

            //look up ecommerce details on the basis of category id
            EcommProduct.find({ACTIVE_FLAG: 'Y'})
                .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                .populate('ECOMMERCE_CATEGORY_ID')
                .populate('PRODUCT_ID')
                .exec()
                .then(ecom_doc => {
                    //traverse through array with product details
                    for (var prod_cat_item of prod_cat_arr) {

                        //traverse through the ecommerce details object looked up on the basis of category id
                        for (var ecom_item of ecom_doc) {
                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                            var outer_id = prod_cat_item.prod_id;
                            //console.log('outer_id', outer_id);

                            var inner_id = ecom_item.PRODUCT_ID._id;
                            //console.log('inner_id', inner_id);

                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                            if (outer_id.equals(inner_id)) {
                                prod_arr.push({
                                    ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                    ecomm_url: ecom_item.PRODUCT_URL,
                                    ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                    ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                });

                            }
                        }

                        //console.log('prod_arr', prod_arr);

                        //push the ecommerce details array and the corresponding product details in the final array
                        prod_final_arr.push({prod_details: prod_cat_item, ecom_details: prod_arr})

                        //clear the temporary array to store filter options value
                        prod_arr = [];
                    }

                    //final output
                    res.status(200).json({
                        status: "success",
                        error: "",
                        data: {
                            product_details: prod_final_arr
                        }
                    });
                })
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
            })
        })
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