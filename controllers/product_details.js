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

    var img_arr = [];
    var prod_img_arr = [];
    var prod_final_img_arr = [];

    var rev_arr = [];
    var prod_rev_arr = [];
    var prod_final_rev_arr = [];

    Product.find({ACTIVE_FLAG:'Y'})
        .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID')
        .populate('PRODUCT_SUB_CATEGORY_ID')
        .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
        .populate('ECOMMERCE_CATEGORY_ID')
        .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
       // .populate('PRODUCT_IMAGE_ID')
        .exec()
        .then(docs => {

//console.log(docs);

            for( var prod_item of docs)
            {
                //console.log(prod_item.LEAST_PRICE_ECOMMERCE);
                //console.log(prod_item.RATING_COUNT);
                //create an array with the product id, product name, product specifications, product price, product image url
                prod_cat_arr.push({prod_id: prod_item._id,
                    product_id: prod_item.PRODUCT_ID,
                    prod_category: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                    product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                    product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                    prod_name: prod_item.PRODUCT_NAME,
                    prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                 //   prod_img_url: prod_item.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1,
                    product_sub_title: prod_item.PRODUCT_SUB_TITLE,
                    product_description: prod_item.PRODUCT_DESCRIPTION,
                    prod_url: prod_item.PRODUCT_ID,
                    prod_rating: prod_item.MEAN_RATING,
                    prod_rating_count: prod_item.RATING_COUNT,
                    prod_review_count: prod_item.REVIEW_COUNT,
                    prod_price: prod_item.PRODUCT_PRICE,
                    prod_price_ecomm: prod_item.LEAST_PRICE_ECOMMERCE,
                    updated_by_user: prod_item.UPDATED_BY,
                    updated_on: prod_item.UPDATED_DATE,
                    isActive: prod_item.ACTIVE_FLAG})
            }

            //console.log('prod_cat_arr',prod_cat_arr);

            Productimages.find({ACTIVE_FLAG:'Y'})
                .select("PRODUCT_IMAGE_REF_1 PRODUCT_ID _id")
               // .populate('PRODUCT_ID')
                .exec()
                .then(img_doc => {



                    for (var prod_img_item of prod_cat_arr) {

                        //traverse through the ecommerce details object looked up on the basis of category id
                        for (var img_item of img_doc) {
                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                            var outer_id = prod_img_item.product_id;
                            // console.log('outer_id',outer_id);

                            var inner_id = img_item.PRODUCT_ID;
                            //console.log('inner_id',inner_id);

                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                            if (outer_id === inner_id) {
                                img_arr.push({
                                    image_url: img_item.PRODUCT_IMAGE_REF_1
                                });

                            }
                        }

                        //console.log('prod_arr',prod_arr);

                        //push the ecommerce details array and the corresponding product details in the final array
                        prod_final_img_arr.push({prod_details: prod_img_item, image_details: img_arr})

                        //clear the temporary array to store filter options value
                        img_arr = [];
                    }
                   // console.log('prod_final_img_arr',prod_final_img_arr);

                    //look up ecommerce details on the basis of category id
                    EcommProduct.find({ACTIVE_FLAG:'Y'})
                        .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                        .populate('ECOMMERCE_CATEGORY_ID')
                        .populate('PRODUCT_ID')
                        .exec()
                        .then(ecom_doc => {
                            //traverse through array with product details
                            for (var prod_cat_item of prod_final_img_arr) {

                                //traverse through the ecommerce details object looked up on the basis of category id
                                for (var ecom_item of ecom_doc) {
                                    //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                    var outer_id = prod_cat_item.prod_details.prod_id;
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

                            Review.find({ACTIVE_FLAG:'Y'})
                                .select("PRODUCT_ID REVIEW_TITLE REVIEW_DESCRIPTION REVIEWER_NAME ACTIVE_FLAG _id")
                                .populate('CUSTOMER_ID')
                                .exec()
                                .then(rev_doc => {
                                    //traverse through array with product details
                                    for (var prod_cat_item of prod_final_arr) {

                                        //traverse through the ecommerce details object looked up on the basis of category id
                                        for (var rev_item of rev_doc) {
                                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                            var outer_id = prod_cat_item.prod_details.prod_details.product_id;
                                             //console.log('rev_outer_id',outer_id);

                                            var inner_id = rev_item.PRODUCT_ID;
                                            //console.log('rev_inner_id',inner_id);

                                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                            if (outer_id === inner_id) {
                                                rev_arr.push({
                                                    rev_title: rev_item.REVIEW_TITLE,
                                                    reviewer_name: rev_item.REVIEWER_NAME,
                                                    review_description: rev_item.REVIEW_DESCRIPTION,
                                                    cust_name: rev_item.CUSTOMER_ID.CUSTOMER_NAME
                                                });

                                            }
                                        }

                                        //console.log('prod_arr',prod_arr);

                                        //push the ecommerce details array and the corresponding product details in the final array
                                        prod_final_rev_arr.push({prod_details: prod_cat_item, review_details: rev_arr})

                                        //clear the temporary array to store filter options value
                                        prod_arr = [];
                                    }

                                    //final output
                                    res.status(200).json({
                                        status: "success",
                                        error: "",
                                        data: {
                                            product_details: prod_final_rev_arr
                                        }
                                    });
                                }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: "error",
                                    error: err,
                                    data: {
                                        message: "An error has occurred as mentioned above"
                                    }
                                });
                                })

                        }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: "error",
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
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
};

//create a new product detail
exports.product_create = (req, res, next) => {

    var Prod_id = req.body.PRODUCT_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    console.log('Prod_id',Prod_id.toLowerCase());

    if(
        Category.findById(req.body.PRODUCT_CATEGORY_ID)&&
        Subcategory.findById(req.body.PRODUCT_SUB_CATEGORY_ID)&&
        Subsubcategory.findById(req.body.PRODUCT_SUB_SUB_CATEGORY_ID)&&
        Prod_id.length > 0
    )
    {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            PRODUCT_ID: Prod_id.toLowerCase(),
            PRODUCT_CATEGORY_ID: req.body.PRODUCT_CATEGORY_ID,
            PRODUCT_SUB_CATEGORY_ID: req.body.PRODUCT_SUB_CATEGORY_ID,
            PRODUCT_SUB_SUB_CATEGORY_ID: req.body.PRODUCT_SUB_SUB_CATEGORY_ID,
            PRODUCT_NAME: req.body.PRODUCT_NAME,
            PRODUCT_SUB_TITLE: req.body.PRODUCT_SUB_TITLE,
            PRODUCT_DESCRIPTION: req.body.PRODUCT_DESCRIPTION,
            PRODUCT_SPECIFICATIONS: JSON.stringify(req.body.PRODUCT_SPECIFICATIONS),
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        product
            .save()
            .then(result => {
                //console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "Product details stored"
                    }
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "Please check all your fields"
                    }
                });
            });

    }
    else {
        res
            .status(404)
            .json({
                status: "error",
                error: "Category, SubCategory or SubSubCateg does not exist"
            });
    }
};


//get product details by id
exports.product_details_get_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var img_arr = [];
    var prod_img_arr = [];
    var prod_final_img_arr = [];

    var rev_arr = [];
    var prod_rev_arr = [];
    var prod_final_rev_arr = [];

    Product.find({PRODUCT_ID: id})
        .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID')
        .populate('PRODUCT_SUB_CATEGORY_ID')
        .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
        .populate('ECOMMERCE_CATEGORY_ID')
        .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
        // .populate('PRODUCT_IMAGE_ID')
        .exec()
        .then(docs => {

//console.log(docs);

            for( var prod_item of docs)
            {
                //console.log(prod_item.LEAST_PRICE_ECOMMERCE);
                //console.log(prod_item.RATING_COUNT);
                //create an array with the product id, product name, product specifications, product price, product image url
                prod_cat_arr.push({prod_id: prod_item._id,
                    product_id: prod_item.PRODUCT_ID,
                    prod_category: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                    product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                    product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                    prod_name: prod_item.PRODUCT_NAME,
                    prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                    //   prod_img_url: prod_item.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1,
                    product_sub_title: prod_item.PRODUCT_SUB_TITLE,
                    product_description: prod_item.PRODUCT_DESCRIPTION,
                    prod_url: prod_item.PRODUCT_ID,
                    prod_rating: prod_item.MEAN_RATING,
                    prod_rating_count: prod_item.RATING_COUNT,
                    prod_review_count: prod_item.REVIEW_COUNT,
                    prod_price: prod_item.PRODUCT_PRICE,
                    prod_price_ecomm: prod_item.LEAST_PRICE_ECOMMERCE,
                    updated_by_user: prod_item.UPDATED_BY,
                    updated_on: prod_item.UPDATED_DATE,
                    isActive: prod_item.ACTIVE_FLAG})
            }

            //console.log('prod_cat_arr',prod_cat_arr);

            Productimages.find({ACTIVE_FLAG:'Y'})
                .select("PRODUCT_IMAGE_REF_1 PRODUCT_ID _id")
                // .populate('PRODUCT_ID')
                .exec()
                .then(img_doc => {



                    for (var prod_img_item of prod_cat_arr) {

                        //traverse through the ecommerce details object looked up on the basis of category id
                        for (var img_item of img_doc) {
                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                            var outer_id = prod_img_item.product_id;
                            // console.log('outer_id',outer_id);

                            var inner_id = img_item.PRODUCT_ID;
                            //console.log('inner_id',inner_id);

                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                            if (outer_id === inner_id) {
                                img_arr.push({
                                    image_url: img_item.PRODUCT_IMAGE_REF_1
                                });

                            }
                        }

                        //console.log('prod_arr',prod_arr);

                        //push the ecommerce details array and the corresponding product details in the final array
                        prod_final_img_arr.push({prod_details: prod_img_item, image_details: img_arr})

                        //clear the temporary array to store filter options value
                        img_arr = [];
                    }
                    // console.log('prod_final_img_arr',prod_final_img_arr);

                    //look up ecommerce details on the basis of category id
                    EcommProduct.find({ACTIVE_FLAG:'Y'})
                        .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                        .populate('ECOMMERCE_CATEGORY_ID')
                        .populate('PRODUCT_ID')
                        .exec()
                        .then(ecom_doc => {
                            //traverse through array with product details
                            for (var prod_cat_item of prod_final_img_arr) {

                                //traverse through the ecommerce details object looked up on the basis of category id
                                for (var ecom_item of ecom_doc) {
                                    //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                    var outer_id = prod_cat_item.prod_details.prod_id;
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

                            Review.find({ACTIVE_FLAG:'Y'})
                                .select("PRODUCT_ID REVIEW_TITLE REVIEW_DESCRIPTION REVIEWER_NAME ACTIVE_FLAG _id")
                                .populate('CUSTOMER_ID')
                                .exec()
                                .then(rev_doc => {
                                    //traverse through array with product details
                                    for (var prod_cat_item of prod_final_arr) {

                                        //traverse through the ecommerce details object looked up on the basis of category id
                                        for (var rev_item of rev_doc) {
                                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                            var outer_id = prod_cat_item.prod_details.prod_details.product_id;
                                            //console.log('rev_outer_id',outer_id);

                                            var inner_id = rev_item.PRODUCT_ID;
                                            //console.log('rev_inner_id',inner_id);

                                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                            if (outer_id === inner_id) {
                                                rev_arr.push({
                                                    rev_title: rev_item.REVIEW_TITLE,
                                                    reviewer_name: rev_item.REVIEWER_NAME,
                                                    review_description: rev_item.REVIEW_DESCRIPTION,
                                                    cust_name: rev_item.CUSTOMER_ID.CUSTOMER_NAME
                                                });

                                            }
                                        }

                                        //console.log('prod_arr',prod_arr);

                                        //push the ecommerce details array and the corresponding product details in the final array
                                        prod_final_rev_arr.push({prod_details: prod_cat_item, review_details: rev_arr})

                                        //clear the temporary array to store filter options value
                                        prod_arr = [];
                                    }

                                    //final output
                                    res.status(200).json({
                                        status: "success",
                                        error: "",
                                        data: {
                                            product_details: prod_final_rev_arr
                                        }
                                    });
                                }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: "error",
                                    error: err,
                                    data: {
                                        message: "An error has occurred as mentioned above"
                                    }
                                });
                            })

                        }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: "error",
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
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
};


//update product details by id
exports.product_update_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    const updateOps = {};

    for (const ops of req.body) {

        if(typeof ops.value === "string" || typeof ops.value === "number")
        {
            updateOps[ops.propName] = ops.value;
        }
        else{
            updateOps[ops.propName] = JSON.stringify(ops.value);
        }
    }

    Product.update({ PRODUCT_ID: id }, { $set: updateOps })
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
    Product.remove({ PRODUCT_ID: id })
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