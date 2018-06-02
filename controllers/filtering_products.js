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

    var final_arr = [];


    //look up filter options on the basis of category id
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
            Product.find({PRODUCT_CATEGORY_ID: id})
                .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
                .populate('PRODUCT_IMAGE_ID')
                .populate('ECOMMERCE_CATEGORY_ID')
                .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                //.count()
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
                                prod_cat_arr.push({prod_id: prod_item._id,
                                    prod_name: prod_item.PRODUCT_NAME,
                                    prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                                    prod_rating: prod_item.MEAN_RATING,
                                    prod_review_count: prod_item.REVIEW_COUNT,
                                    prod_price: prod_item.PRODUCT_PRICE,
                                    prod_img_url: prod_item.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1})
                            }

                            //look up ecommerce details on the basis of category id
                            Ecommerce_prod_details.find({CATEGORY_ID: id})
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
                                            var inner_id = ecom_item.PRODUCT_ID._id;

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

                                        //push the ecommerce details array and the corresponding product details in the final array
                                        prod_final_arr.push({prod_details: prod_cat_item, ecom_details: prod_arr})

                                        //clear the temporary array to store filter options value
                                        prod_arr = [];
                                    }

                                    for (var item_3 of prod_id_arr)
                                    {
                                        for (var item_4 of prod_final_arr)
                                        {
                                            var outer_id = item_3;
                                            var inner_id = item_4.prod_details.prod_id;

                                            //if both the above filter id are equal then create an array with the filter option values for the corresponding array
                                            if (outer_id.toString() === inner_id.toString())
                                            {
                                                final_arr.push(item_4);

                                            }
                                        }
                                    }



                                    //final output
                                    res.status(200).json({
                                        status: "success",
                                        error: "",
                                        data: {
                                            product_id: prod_id_arr,
                                            product_details: final_arr,
                                            pages: Math.ceil(count / perPage)
                                        }
                                    });
                                })
                       })


                })
        })
};


