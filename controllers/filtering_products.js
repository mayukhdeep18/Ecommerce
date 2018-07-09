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
const Filter_category = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");
const Filter_options_product = require("../models/filter_options_products");
const Ecommerce_prod_details = require("../models/ecommerce_product_details");
const Review = require("../models/review_details");


//get all active product details
exports.product_get_all = (req, res, next) => {

    const id = req.params.categoryId;
    var perPage = 9;
    var page = req.params.page || 1;

    var fil_arr = [];
    var fil_opt_arr = [];
    var prod_id_arr = [];

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var rev_arr = [];
    var prod_final_rev_arr = [];

    var final_arr = [];


    Filter_options_product.find()
        .select("FILTER_OPTION_ID PRODUCT_ID _id")
        .exec()
        .then(doc => {

            fil_arr = req.body.FILTER_ID;

            for (var item_1 of doc)
            {
                fil_opt_arr.push({FILTER_OPT_ID: item_1.FILTER_OPTION_ID, PROD_ID: item_1.PRODUCT_ID})
            }

            for (var item of fil_arr)
            {
                //traverse through the filter options object looked up on the basis of category id
                for(var item_2 of fil_opt_arr)
                {
                    //store the filter type id from the filter table and filter type id from the filter options table in a temp variable
                    var outer_id = item;
                    var inner_id = item_2.FILTER_OPT_ID;

                    //if both the above filter id are equal then create an array with the filter option values for the corresponding array
                    if (outer_id.toString() === inner_id.toString())
                    {
                        prod_id_arr.push(item_2.PROD_ID);

                    }
                }
            }

            // look up ecommerce product details and product details on the basis of category id
            Product.find({ACTIVE_FLAG: 'Y'})
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
                .then(doc_2 => {

                    Product.count()
                        .exec()
                        .then(count => {

                            //iterate through all the product details fetched
                            for( var prod_item of doc_2)
                            {
                                //create an array with the product id, product name, product specifications, product price, product image url
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

                            //look up ecommerce details on the basis of category id
                            Ecommerce_prod_details.find({ACTIVE_FLAG: 'Y'})
                                .select("ECOMMERCE_PRODUCT_ID ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                .populate('ECOMMERCE_CATEGORY_ID')
                                .populate('PRODUCT_ID')
                                .exec()
                                .then(ecom_doc => {

                                    //traverse through array with product details
                                    for (var prod_cat_item of prod_cat_arr) {

                                        //traverse through the ecommerce details object
                                        for (var ecom_item of ecom_doc) {

                                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                            var outer_id1 = prod_cat_item.prod_id;

                                            var inner_id1 = ecom_item.PRODUCT_ID._id;

                                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                            if (outer_id1.equals(inner_id1)) {
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

                                            for (var item_3 of prod_id_arr)
                                            {
                                                for (var item_4 of prod_final_rev_arr)
                                                {
                                                    var outer_id2 = item_3;
                                                    var inner_id2 = item_4.prod_details.prod_details.prod_id;

                                                    //if both the above filter id are equal then create an array with the filter option values for the corresponding array
                                                    if (outer_id2.toString() === inner_id2.toString())
                                                    {
                                                        final_arr.push(item_4);

                                                    }
                                                }
                                            }
                                            //final output
                                            res.status(200).json({
                                                status: "success",
                                                data: {
                                                    product_id: prod_id_arr,
                                                    product_details: final_arr,
                                                    pages: Math.ceil(count / perPage)
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
                       }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: "error",
                            data: {
                                message: "Internal server error!"
                            }
                        });
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Internal server error!"
                    }
                });
            });
        }).catch(err => {
        console.log(err);
        res.status(500).json({
            status: "error",
            data: {
                message: "Internal server error!"
            }
        });
    });
};


