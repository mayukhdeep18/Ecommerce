const mongoose = require("mongoose");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");
const EcommProduct = require("../models/ecommerce_product_details");
const Product = require("../models/product_details");
const Review = require("../models/review_details");
const Trending = require("../models/trending_products");
const Hot = require("../models/hot_deals");
const Rating = require("../models/rating_details");
const FilterValues = require("../models/filter_options_products");


//get all active product details
exports.product_get_all = (req, res, next) => {
    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var rev_arr = [];
    var prod_final_rev_arr = [];

    var perPage = 9;
    var page = req.params.page || 1;

    if( page > 0 && page < 20)
    {
        Product.find()
            .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_CATEGORY_ID')
            .populate('PRODUCT_SUB_CATEGORY_ID')
            .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
            .populate('ECOMMERCE_CATEGORY_ID')
            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
            .exec()
            .then(docs => {

                Product.count()
                    .exec()
                    .then(count => {
                        if(docs.length > 0)
                        {

                            for( var prod_item of docs)
                            {

                                var product_sub_sub_category_name;
                                var product_sub_sub_category_id;
                                if(prod_item.PRODUCT_SUB_SUB_CATEGORY_ID !=null)
                                {
                                    product_sub_sub_category_name = prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                                    product_sub_sub_category_id = prod_item.PRODUCT_SUB_SUB_CATEGORY_ID._id;
                                }
                                //create an array with the basic product details
                                prod_cat_arr.push({prod_id: prod_item._id,
                                    product_id: prod_item.PRODUCT_ID,
                                    prod_category_id: prod_item.PRODUCT_CATEGORY_ID._id,
                                    prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                    prod_sub_category_id: prod_item.PRODUCT_SUB_CATEGORY_ID._id,
                                    product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                    product_sub_sub_category_id: product_sub_sub_category_id,
                                    product_sub_sub_category_name: product_sub_sub_category_name,
                                    prod_name: prod_item.PRODUCT_NAME,
                                    prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                                    product_sub_title: prod_item.PRODUCT_SUB_TITLE,
                                    product_description: prod_item.PRODUCT_DESCRIPTION,
                                    prod_url: prod_item.PRODUCT_URL,
                                    prod_rating: parseFloat(prod_item.MEAN_RATING).toFixed(2),
                                    prod_rating_count: prod_item.RATING_COUNT,
                                    prod_review_count: prod_item.REVIEW_COUNT,
                                    prod_price: prod_item.PRODUCT_PRICE,
                                    prod_price_ecomm: prod_item.LEAST_PRICE_ECOMMERCE,
                                    product_images: JSON.parse(prod_item.PRODUCT_IMAGE_LINKS),
                                    updated_by_user: prod_item.UPDATED_BY,
                                    updated_on: prod_item.UPDATED_DATE,
                                    isActive: prod_item.ACTIVE_FLAG})
                            }
                            //look up ecommerce details
                                    EcommProduct.find({ACTIVE_FLAG:'Y'})
                                        .select("ECOMMERCE_PRODUCT_ID ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                        .populate('ECOMMERCE_CATEGORY_ID')
                                        .populate('PRODUCT_ID')
                                        .exec()
                                        .then(ecom_doc => {
                                            //traverse through array with product details
                                            for (var prod_cat_item of prod_cat_arr) {

                                                //console.log("img",prod_cat_item);

                                                //traverse through the ecommerce details object
                                                for (var ecom_item of ecom_doc) {

                                                    //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                    var outer_id = prod_cat_item.prod_id;

                                                    var inner_id = ecom_item.PRODUCT_ID._id;

                                                    //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                                    if (outer_id.equals(inner_id)) {
                                                        prod_arr.push({
                                                            ecomm_doc_id: ecom_item._id,
                                                            ecomm_aff_id: ecom_item.ECOMMERCE_PRODUCT_ID,
                                                            ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                            ecomm_url: ecom_item.PRODUCT_URL,
                                                            ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                            ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                        });

                                                    }
                                                }

                                                //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                prod_final_arr.push({prod_details: prod_cat_item, ecom_details: prod_arr})

                                                //clear the temporary array to store ecommerce details value
                                                prod_arr = [];


                                            }

                                            Review.find({ACTIVE_FLAG:'Y'})
                                                .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                .populate('CUSTOMER_ID')
                                                .populate('PRODUCT_ID')
                                                .exec()
                                                .then(rev_doc => {
                                                    //traverse through array with product details
                                                    for (var prod_cat_item of prod_final_arr) {

                                                        //console.log("details",prod_cat_item);

                                                        //traverse through the review details object
                                                        for (var rev_item of rev_doc) {
                                                            //store the product id from the product table and product id from the review details table in a temp variable
                                                            var outer_id = prod_cat_item.prod_details.prod_id;
                                                            //console.log('rev_outer',outer_id);

                                                            var inner_id = rev_item.PRODUCT_ID._id;
                                                            //console.log('rev_inner',outer_id);
                                                            //if both the above product id are equal then create an array with the review detail values for the corresponding array
                                                            if (outer_id.equals(inner_id)) {
                                                                rev_arr.push({
                                                                    reviews: JSON.parse(rev_item.ECOMMERCE_REVIEW)
                                                                });
                                                            }
                                                        }

                                                        //push the review details array and the corresponding updated product details above in the final array
                                                        prod_final_rev_arr.push({ prod_details: prod_cat_item, review_details: rev_arr})

                                                        //clear the temporary array to store review details value
                                                        rev_arr = [];
                                                    }

                                                    //final output
                                                    res.status(200).json({
                                                        status: "success",
                                                        data: {
                                                            product_details: prod_final_rev_arr,
                                                            pages: Math.ceil(count / perPage)
                                                        }
                                                    });
                                                }).catch(err => {
                                                console.log(err);
                                                res.status(500).json({
                                                    status: "error",
                                                    data: {
                                                        message: "Internal server error!"
                                                    }
                                                });
                                            })

                                        }).catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: "error",
                                            data: {
                                                message: "Internal server error!"
                                            }
                                        });
                                    });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "error",
                                data: {
                                    message: "No product details found"
                                }
                            });
                        }
                    }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        status: "error",
                        data: {
                            message: "Internal server error!"
                        }
                    });
                });

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Internal server error!"
                    }
                });
            });
    }
    else
    {
        res.status(500).json({
            status: "error",
            data: {
                message: "Invalid page number"
            }
        });
    }
};

//create a new product detail
exports.product_create = (req, res, next) => {

    //Create product Id on basis of product name
    var Prod_id = req.body.PRODUCT_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    if(Prod_id.length > 0)
    {
        Product.find({PRODUCT_ID: Prod_id.toLowerCase()})
            .select('_id')
            .exec()
            .then(doc=>{
                if(doc.length > 0)
                {
                    res.status(500)
                        .json({
                            status: "error",
                            error: "Product already exists!"
                        });
                }
                else
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
                            PRODUCT_URL: Prod_id.toLowerCase(),
                            PRODUCT_IMAGE_LINKS: JSON.stringify(req.body.PRODUCT_IMAGE_LINKS),
                            UPDATED_DATE: new Date(),
                            ACTIVE_FLAG: req.body.ACTIVE_FLAG
                        });
                        product
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    status: "success",
                                    product_id: result._id,
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
                                        message: "Internal server error!"
                                    }
                                });
                           });

                }
            }).catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error!"
                }
            });
        });
    }
    else
    {
        res
            .status(404)
            .json({
                status: "error",
                error: "Please check all your details!"
            });
    }
};

//get product details by id
exports.product_details_get_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var rev_arr = [];
    var prod_final_rev_arr = [];

    var perPage = 9;
    var page = req.params.page || 1;

    if( page > 0 && page < 20)
    {
        Product.find({PRODUCT_ID:id})
            .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_CATEGORY_ID')
            .populate('PRODUCT_SUB_CATEGORY_ID')
            .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
            .populate('ECOMMERCE_CATEGORY_ID')
            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
            .exec()
            .then(docs => {

                Product.count()
                    .exec()
                    .then(count => {
                        if(docs.length > 0)
                        {

                            for( var prod_item of docs)
                            {

                                var product_sub_sub_category_name;
                                var product_sub_sub_category_id;
                                if(prod_item.PRODUCT_SUB_SUB_CATEGORY_ID!=null)
                                {
                                    product_sub_sub_category_name = prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                                    product_sub_sub_category_id = prod_item.PRODUCT_SUB_SUB_CATEGORY_ID._id;
                                }
                                //create an array with the basic product details
                                prod_cat_arr.push({prod_id: prod_item._id,
                                    product_id: prod_item.PRODUCT_ID,
                                    prod_category_id: prod_item.PRODUCT_CATEGORY_ID._id,
                                    prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                    prod_sub_category_id: prod_item.PRODUCT_SUB_CATEGORY_ID._id,
                                    product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                    product_sub_sub_category_id: product_sub_sub_category_id,
                                    product_sub_sub_category_name: product_sub_sub_category_name,
                                    prod_name: prod_item.PRODUCT_NAME,
                                    prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                                    product_sub_title: prod_item.PRODUCT_SUB_TITLE,
                                    product_description: prod_item.PRODUCT_DESCRIPTION,
                                    prod_url: prod_item.PRODUCT_URL,
                                    prod_rating: parseFloat(prod_item.MEAN_RATING).toFixed(2),
                                    prod_rating_count: prod_item.RATING_COUNT,
                                    prod_review_count: prod_item.REVIEW_COUNT,
                                    prod_price: prod_item.PRODUCT_PRICE,
                                    prod_price_ecomm: prod_item.LEAST_PRICE_ECOMMERCE,
                                    product_images: JSON.parse(prod_item.PRODUCT_IMAGE_LINKS),
                                    updated_by_user: prod_item.UPDATED_BY,
                                    updated_on: prod_item.UPDATED_DATE,
                                    isActive: prod_item.ACTIVE_FLAG})
                            }
                            //look up ecommerce details
                            EcommProduct.find({ACTIVE_FLAG:'Y'})
                                .select("ECOMMERCE_PRODUCT_ID ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                .populate('ECOMMERCE_CATEGORY_ID')
                                .populate('PRODUCT_ID')
                                .exec()
                                .then(ecom_doc => {
                                    //traverse through array with product details
                                    for (var prod_cat_item of prod_cat_arr) {

                                        //console.log("img",prod_cat_item);

                                        //traverse through the ecommerce details object
                                        for (var ecom_item of ecom_doc) {

                                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                            var outer_id = prod_cat_item.prod_id;

                                            var inner_id = ecom_item.PRODUCT_ID._id;

                                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                            if (outer_id.equals(inner_id)) {
                                                prod_arr.push({
                                                    ecomm_doc_id: ecom_item._id,
                                                    ecomm_aff_id: ecom_item.ECOMMERCE_PRODUCT_ID,
                                                    ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                    ecomm_url: ecom_item.PRODUCT_URL,
                                                    ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                    ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                });

                                            }
                                        }

                                        //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                        prod_final_arr.push({prod_details: prod_cat_item, ecom_details: prod_arr})

                                        //clear the temporary array to store ecommerce details value
                                        prod_arr = [];


                                    }

                                    Review.find({ACTIVE_FLAG:'Y'})
                                        .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                        .populate('CUSTOMER_ID')
                                        .populate('PRODUCT_ID')
                                        .exec()
                                        .then(rev_doc => {
                                            //traverse through array with product details
                                            for (var prod_cat_item of prod_final_arr) {

                                                //console.log("details",prod_cat_item);

                                                //traverse through the review details object
                                                for (var rev_item of rev_doc) {
                                                    //store the product id from the product table and product id from the review details table in a temp variable
                                                    var outer_id = prod_cat_item.prod_details.prod_id;
                                                    //console.log('rev_outer',outer_id);

                                                    var inner_id = rev_item.PRODUCT_ID._id;
                                                    //console.log('rev_inner',outer_id);
                                                    //if both the above product id are equal then create an array with the review detail values for the corresponding array
                                                    if (outer_id.equals(inner_id)) {
                                                        rev_arr.push({
                                                            reviews: JSON.parse(rev_item.ECOMMERCE_REVIEW)
                                                        });
                                                    }
                                                }

                                                //push the review details array and the corresponding updated product details above in the final array
                                                prod_final_rev_arr.push({ prod_details: prod_cat_item, review_details: rev_arr})

                                                //clear the temporary array to store review details value
                                                rev_arr = [];
                                            }

                                            //final output
                                            res.status(200).json({
                                                status: "success",
                                                data: {
                                                    product_details: prod_final_rev_arr,
                                                    pages: Math.ceil(count / perPage)
                                                }
                                            });
                                        }).catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: "error",
                                            data: {
                                                message: "Internal server error!"
                                            }
                                        });
                                    })

                                }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: "error",
                                    data: {
                                        message: "Internal server error!"
                                    }
                                });
                            });
                        }
                        else
                        {
                            res.status(404).json({
                                status: "error",
                                data: {
                                    message: "No product details found"
                                }
                            });
                        }
                    }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        status: "error",
                        data: {
                            message: "Internal server error!"
                        }
                    });
                });

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Internal server error!"
                    }
                });
            });
    }
    else
    {
        res.status(500).json({
            status: "error",
            data: {
                message: "Invalid page number"
            }
        });
    }
};

//update product details by id
exports.product_update_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    const updateOps = {};
    const updateRest = {};
    var Prod_id = req.body.PRODUCT_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    updateOps['PRODUCT_CATEGORY_ID'] = req.body.PRODUCT_CATEGORY_ID;
    updateOps['PRODUCT_SUB_CATEGORY_ID'] = req.body.PRODUCT_SUB_CATEGORY_ID;
    updateOps['PRODUCT_SUB_SUB_CATEGORY_ID'] = req.body.PRODUCT_SUB_SUB_CATEGORY_ID;
    updateOps['PRODUCT_NAME'] = req.body.PRODUCT_NAME;
    updateOps['PRODUCT_SUB_TITLE']= req.body.PRODUCT_SUB_TITLE;
    updateOps['PRODUCT_DESCRIPTION'] = req.body.PRODUCT_DESCRIPTION;
    updateOps['PRODUCT_SPECIFICATIONS'] = JSON.stringify(req.body.PRODUCT_SPECIFICATIONS);
    updateOps['PRODUCT_URL'] = Prod_id.toLowerCase();
    updateOps['PRODUCT_IMAGE_LINKS'] = JSON.stringify(req.body.PRODUCT_IMAGE_LINKS);
    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateOps['UPDATED_DATE'] = new Date();
    updateOps['PRODUCT_ID'] = Prod_id.toLowerCase();
    updateRest['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateRest['UPDATED_DATE'] = new Date();
Product.find({PRODUCT_ID: id})
    .select('PRODUCT_ID _id')
    .exec()
    .then(doc => {
        if (doc != null)
        {
            Product.update({ _id: id }, { $set: updateOps })
                .exec()
                .then(result => {
                    Trending.update({ PRODUCT_ID: id }, { $set: updateRest },{multi: true})
                        .exec()
                        .then(res1 => {
                            Hot.update({ PRODUCT_ID: id }, { $set: updateRest },{multi: true})
                                .exec()
                                .then(res2=>{
                                    Rating.update({ PRODUCT_ID: id }, { $set: updateRest },{multi: true})
                                        .exec()
                                        .then(res3 => {
                                            Review.update({ PRODUCT_ID: id }, { $set: updateRest },{multi: true})
                                                .exec()
                                                .then(res4 => {
                                                    FilterValues.update({ PRODUCT_ID: id }, { $set: updateRest },{multi: true})
                                                        .exec()
                                                        .then(res5 => {
                                                            EcommProduct.update({ PRODUCT_ID: id }, { $set: updateRest },{multi: true})
                                                                .exec()
                                                                .then(res6 => {
                                                                    res.status(200).json({
                                                                        status: "success",
                                                                        data: {
                                                                            message: "product and its dependencies updated"
                                                                        }
                                                                    });
                                                                }).catch(err => {
                                                                console.log(err);
                                                                res.status(500).json({
                                                                    status: "error",
                                                                    error: err,
                                                                    data:
                                                                        {
                                                                            message: "Internal server error!"
                                                                        }
                                                                });
                                                            });
                                                        }).catch(err => {
                                                        console.log(err);
                                                        res.status(500).json({
                                                            status: "error",
                                                            error: err,
                                                            data:
                                                                {
                                                                    message: "Internal server error!"
                                                                }
                                                        });
                                                    });
                                                }).catch(err => {
                                                console.log(err);
                                                res.status(500).json({
                                                    status: "error",
                                                    error: err,
                                                    data:
                                                        {
                                                            message: "Internal server error!"
                                                        }
                                                });
                                            });
                                        }).catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: "error",
                                            error: err,
                                            data:
                                                {
                                                    message: "Internal server error!"
                                                }
                                        });
                                    });
                                }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: "error",
                                    error: err,
                                    data:
                                        {
                                            message: "Internal server error!"
                                        }
                                });
                            });
                        }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: "error",
                            error: err,
                            data:
                                {
                                    message: "Internal server error!"
                                }
                        });
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "Internal server error!"
                    }
                })
            });
        }
        else
        {
            res.status(404).json({
                status: "error",
                data: {
                    message: 'product details not found'
                }
            });
        }
    })

};

//delete product details by id
exports.product_delete_by_id = (req, res, next) => {
    const id = req.params.prodcategoryId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            Trending.remove({PRODUCT_ID: id})
                .exec()
                .then(res1 => {
                    Hot.remove({PRODUCT_ID: id})
                        .exec()
                        .then(res2=>{
                            Rating.remove({PRODUCT_ID: id})
                                .exec()
                                .then(res3 => {
                                    Review.remove({PRODUCT_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            FilterValues.remove({PRODUCT_ID: id})
                                                .exec()
                                                .then(res5 => {
                                                    EcommProduct.remove({PRODUCT_ID: id})
                                                        .exec()
                                                        .then(res6 => {
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    message: "product and its dependencies deleted"
                                                                }
                                                            });
                                                        }).catch(err => {
                                                        console.log(err);
                                                        res.status(500).json({
                                                            status: "error",
                                                            error: err,
                                                            data:
                                                                {
                                                                    message: "Internal server error!"
                                                                }
                                                        });
                                                    });
                                                }).catch(err => {
                                                console.log(err);
                                                res.status(500).json({
                                                    status: "error",
                                                    error: err,
                                                    data:
                                                        {
                                                            message: "Internal server error!"
                                                        }
                                                });
                                            });
                                        }).catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: "error",
                                            error: err,
                                            data:
                                                {
                                                    message: "Internal server error!"
                                                }
                                        });
                                    });
                                }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: "error",
                                    error: err,
                                    data:
                                        {
                                            message: "Internal server error!"
                                        }
                                });
                            });
                        }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: "error",
                            error: err,
                            data:
                                {
                                    message: "Internal server error!"
                                }
                        });
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    data:
                        {
                            message: "Internal server error!"
                        }
                });
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:
                    {
                        message: "Internal server error!"
                    }
            });
        });
};