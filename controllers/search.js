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
//const regexp = require("path-to-regexp")

//get all rating details
/*
exports.search_get_all = (req, res, next) => {

    var perPage = 9;
    var page = req.params.page || 1;

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];



    const search_term = req.body.SearchTerm;
    console.log('search_term',search_term);
    var regex = new RegExp(search_term,"i");

   // var regex = new RegExp(search_term.toString(), 'i');// 'i' makes it case insensitive
    console.log('regex',regex);

//search in product database
    Product.find({$or:[ {PRODUCT_NAME: regex}, {PRODUCT_SUB_TITLE:regex}, {PRODUCT_DESCRIPTION:regex},{PRODUCT_PRICE:regex},{PRODUCT_SPECIFICATIONS:regex} ], ACTIVE_FLAG:'Y'})
        .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_AVAILABILITY_COUNT PERCENTAGE_DISCOUNT_ON_PRODUCT PRODUCT_SPECIAL_OFFER_PRICE SPECIAL_OFFER_DISCOUNT_FACTOR MINIMUM_ALLOWED_BUY_QUANTITY MAXIMUM_ALLOWED_BUY_QUANTITY PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID')
        .populate('PRODUCT_SUB_CATEGORY_ID')
        .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
        .populate('SELLER_CATEGORY_ID')
        .populate('SELLER_SUB_CATEGORY_ID')
        .populate('ECOMMERCE_CATEGORY_ID')
        .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
        .populate('PRODUCT_IMAGE_ID')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
        .exec()
        .then(docs => {
            if(docs.length > 0) {

                Product.count()
                    .exec()
                    .then(count => {
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

                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        message: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });

                            })
                    })
            }

            //search in sub sub category database
            else {
                //var s_perPage = 9;
                //var s_page = req.params.page || 1;


                var subsub_prod_arr = [];
                var subsub_prod_cat_arr = [];
                var subsub_prod_subsub_final_arr = [];

                //look up filter id on basis of sub category id
                Subsubcategory.findOne({
                    $or: [{PRODUCT_SUB_SUB_CATEGORY_NAME: regex}, {PRODCT_SUB_SUB_CATGRY_DESCRPTN: regex}],
                    ACTIVE_FLAG: 'Y'
                })
                    .select('_id')
                    .exec()
                    .then(fil_cat => {
                        var subsub_id;
                        if(fil_cat!= null){
                             subsub_id = fil_cat._id;
                            console.log('subsubcat_id',subsub_id);
                        }
                        else{
                            subsub_id = false;
                        }

                        if (subsub_id) {
                            console.log('came here');
                            // look up ecommerce product details and product details on the basis of sub sub category id
                            Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: subsub_id})
                                .populate('PRODUCT_CATEGORY_ID')
                                .populate('PRODUCT_SUB_CATEGORY_ID')
                                .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                                .populate('SELLER_CATEGORY_ID')
                                .populate('SELLER_SUB_CATEGORY_ID')
                                .populate('ECOMMERCE_CATEGORY_ID')
                                .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                                .populate('PRODUCT_IMAGE_ID')
                                .skip((perPage * page) - perPage)
                                .limit(perPage)
                                .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                                .exec()
                                .then(doc_2 => {

                                    Product.count()
                                        .exec()
                                        .then(count => {
                                            //iterate through all the product details fetched
                                            for (var prod_item of doc_2) {
                                                //create an array with the product id, product name, product specifications, product price, product image url
                                                subsub_prod_cat_arr.push({
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

                                            //look up ecommerce details on the basis of sub sub category id
                                            Ecommerce_prod_details.find({SUB_SUB_CATEGORY_ID: subsub_id})
                                                .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                                .populate('ECOMMERCE_CATEGORY_ID')
                                                .populate('PRODUCT_ID')
                                                .exec()
                                                .then(ecom_doc => {

                                                    //traverse through array with product details
                                                    for (var prod_cat_item of subsub_prod_cat_arr) {

                                                        //traverse through the ecommerce details object looked up on the basis of category id
                                                        for (var ecom_item of ecom_doc) {
                                                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                            var outer_id = prod_cat_item.prod_id;
                                                            var inner_id = ecom_item.PRODUCT_ID._id;

                                                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                                            if (outer_id.equals(inner_id)) {
                                                                subsub_prod_arr.push({
                                                                    ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                                    ecomm_url: ecom_item.PRODUCT_URL,
                                                                    ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                                    ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                                });

                                                            }
                                                        }

                                                        //push the ecommerce details array and the corresponding product details in the final array
                                                        subsub_prod_subsub_final_arr.push({
                                                            prod_details: prod_cat_item,
                                                            ecom_details: subsub_prod_arr
                                                        })

                                                        //clear the temporary array to store filter options value
                                                        subsub_prod_arr = [];
                                                    }

                                                    //final output
                                                    res.status(200).json({
                                                        status: "success",
                                                        error: "",
                                                        data: {
                                                            product_details: subsub_prod_subsub_final_arr,
                                                            pages: Math.ceil(count / perPage)
                                                        }
                                                    });
                                                })
                                        })
                                })
                        }

                        //look up on sub category database
                        else {
                           // var ss_perPage = 9;
                           // var ss_page = req.params.page || 1;

                            var sub_prod_arr = [];
                            var sub_prod_cat_arr = [];
                            var prod_sub_final_arr = [];

//look up filter id on basis of sub category id
                            Subcategory.findOne({
                                $or: [{PRODUCT_SUB_CATEGORY_NAME: regex}, {PRODUCT_SUB_CATEGORY_DESCRIPTION: regex}],
                                ACTIVE_FLAG: 'Y'
                            })
                                .select('_id')
                                .exec()
                                .then(fil_cat => {

                                    var sub_id;
                                    if(fil_cat!= null){
                                        sub_id = fil_cat._id;
                                        console.log('subcat_id',sub_id);
                                    }
                                    else{
                                        sub_id = false;
                                    }

                                    if (sub_id) {
                                        // look up ecommerce product details and product details on the basis of sub sub category id
                                        Product.find({PRODUCT_SUB_CATEGORY_ID: sub_id})
                                            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
                                            .populate('PRODUCT_CATEGORY_ID')
                                            .populate('PRODUCT_SUB_CATEGORY_ID')
                                            .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                                            .populate('SELLER_CATEGORY_ID')
                                            .populate('SELLER_SUB_CATEGORY_ID')
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                                            .populate('PRODUCT_IMAGE_ID')
                                            .skip((perPage * page) - perPage)
                                            .limit(perPage)
                                            .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                                            .exec()
                                            .then(doc_2 => {

                                                Product.count()
                                                    .exec()
                                                    .then(count => {
                                                        //iterate through all the product details fetched
                                                        for (var prod_item of doc_2) {
                                                            //create an array with the product id, product name, product specifications, product price, product image url
                                                            sub_prod_cat_arr.push({
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

                                                        //look up ecommerce details on the basis of sub sub category id
                                                        Ecommerce_prod_details.find({SUB_CATEGORY_ID: fil_cat._id})
                                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                                            .populate('ECOMMERCE_CATEGORY_ID')
                                                            .populate('PRODUCT_ID')
                                                            .exec()
                                                            .then(ecom_doc => {

                                                                //traverse through array with product details
                                                                for (var prod_cat_item of sub_prod_cat_arr) {

                                                                    //traverse through the ecommerce details object looked up on the basis of category id
                                                                    for (var ecom_item of ecom_doc) {
                                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                                        var outer_id = prod_cat_item.prod_id;
                                                                        var inner_id = ecom_item.PRODUCT_ID._id;

                                                                        //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                                                        if (outer_id.equals(inner_id)) {
                                                                            sub_prod_arr.push({
                                                                                ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                                                ecomm_url: ecom_item.PRODUCT_URL,
                                                                                ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                                                ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                                            });

                                                                        }
                                                                    }

                                                                    //push the ecommerce details array and the corresponding product details in the final array
                                                                    prod_sub_final_arr.push({
                                                                        prod_details: prod_cat_item,
                                                                        ecom_details: sub_prod_arr
                                                                    })

                                                                    //clear the temporary array to store filter options value
                                                                    sub_prod_arr = [];
                                                                }

                                                                //final output
                                                                res.status(200).json({
                                                                    status: "success",
                                                                    error: "",
                                                                    data: {
                                                                        product_details: prod_sub_final_arr,
                                                                        pages: Math.ceil(count / perPage)
                                                                    }
                                                                });
                                                            })
                                                    })
                                            })
                                    }
                                    else {
                                      //  var c_perPage = 9;
                                      //  var c_page = req.params.page || 1;

                                        var c_prod_arr = [];
                                        var c_prod_cat_arr = [];
                                        var prod_c_final_arr = [];

//look up filter id on basis of category id
                                        Category.findOne({
                                            $or: [{PRODUCT_CATEGORY_NAME: regex}, {PRODUCT_CATEGORY_DESCRIPTION: regex}],
                                            ACTIVE_FLAG: 'Y'
                                        })
                                            .select('_id')
                                            .exec()
                                            .then(fil_cat => {

                                                var cat_id;
                                                if(fil_cat!= null){
                                                    cat_id = fil_cat._id;
                                                    console.log('cat_id',cat_id);
                                                }
                                                else{
                                                    cat_id = false;
                                                }

                                                if (cat_id) {
                                                    // look up ecommerce product details and product details on the basis of sub sub category id
                                                    Product.find({PRODUCT_CATEGORY_ID: fil_cat._id})
                                                        .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
                                                        .populate('PRODUCT_CATEGORY_ID')
                                                        .populate('PRODUCT_SUB_CATEGORY_ID')
                                                        .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                                                        .populate('SELLER_CATEGORY_ID')
                                                        .populate('SELLER_SUB_CATEGORY_ID')
                                                        .populate('ECOMMERCE_CATEGORY_ID')
                                                        .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                                                        .populate('PRODUCT_IMAGE_ID')
                                                        .skip((perPage * page) - perPage)
                                                        .limit(perPage)
                                                        .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                                                        .exec()
                                                        .then(doc_2 => {

                                                            Product.count()
                                                                .exec()
                                                                .then(count => {
                                                                    //iterate through all the product details fetched
                                                                    for (var prod_item of doc_2) {
                                                                        //create an array with the product id, product name, product specifications, product price, product image url
                                                                        c_prod_cat_arr.push({
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

                                                                    //look up ecommerce details on the basis of sub sub category id
                                                                    Ecommerce_prod_details.find({CATEGORY_ID: fil_cat._id})
                                                                        .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                                                        .populate('ECOMMERCE_CATEGORY_ID')
                                                                        .populate('PRODUCT_ID')
                                                                        .exec()
                                                                        .then(ecom_doc => {

                                                                            //traverse through array with product details
                                                                            for (var prod_cat_item of c_prod_cat_arr) {

                                                                                //traverse through the ecommerce details object looked up on the basis of category id
                                                                                for (var ecom_item of ecom_doc) {
                                                                                    //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                                                    var outer_id = prod_cat_item.prod_id;
                                                                                    var inner_id = ecom_item.PRODUCT_ID._id;

                                                                                    //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                                                                    if (outer_id.equals(inner_id)) {
                                                                                        c_prod_arr.push({
                                                                                            ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                                                            ecomm_url: ecom_item.PRODUCT_URL,
                                                                                            ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                                                            ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                                                        });

                                                                                    }
                                                                                }

                                                                                //push the ecommerce details array and the corresponding product details in the final array
                                                                                prod_c_final_arr.push({
                                                                                    prod_details: prod_cat_item,
                                                                                    ecom_details: c_prod_arr
                                                                                })

                                                                                //clear the temporary array to store filter options value
                                                                                c_prod_arr = [];
                                                                            }

                                                                            //final output
                                                                            res.status(200).json({
                                                                                status: "success",
                                                                                error: "",
                                                                                data: {
                                                                                    product_details: prod_c_final_arr,
                                                                                    pages: Math.ceil(count / perPage)
                                                                                }
                                                                            });
                                                                        })
                                                                })
                                                        })
                                                }

                                                //look up on basis of ecommerce category
                                                else {

                                                    var e_prod_arr = [];
                                                    var e_prod_cat_arr = [];
                                                    var prod_e_final_arr = [];

                                                    EcommCategory.findOne({
                                                        $or: [{ECOMMERCE_NAME: regex}, {ECOMMERCE_DESCRIPTION: regex}],
                                                        ACTIVE_FLAG: 'Y'
                                                    })
                                                        .select('_id')
                                                        .exec()
                                                        .then(fil_cat => {

                                                            var e_cat_id;
                                                            if(fil_cat!= null){
                                                                e_cat_id = fil_cat._id;
                                                                console.log('cat_id',e_cat_id);
                                                            }
                                                            else{
                                                                e_cat_id = false;
                                                            }

                                                            if (e_cat_id) {
                                                                // look up ecommerce product details and product details on the basis of sub sub category id
                                                                Product.find({PRODUCT_CATEGORY_ID: e_cat_id})
                                                                    .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
                                                                    .populate('PRODUCT_CATEGORY_ID')
                                                                    .populate('PRODUCT_SUB_CATEGORY_ID')
                                                                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                                                                    .populate('SELLER_CATEGORY_ID')
                                                                    .populate('SELLER_SUB_CATEGORY_ID')
                                                                    .populate('ECOMMERCE_CATEGORY_ID')
                                                                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                                                                    .populate('PRODUCT_IMAGE_ID')
                                                                    .skip((perPage * page) - perPage)
                                                                    .limit(perPage)
                                                                    .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                                                                    .exec()
                                                                    .then(doc_2 => {

                                                                        Product.count()
                                                                            .exec()
                                                                            .then(count => {
                                                                                //iterate through all the product details fetched
                                                                                for (var prod_item of doc_2) {
                                                                                    //create an array with the product id, product name, product specifications, product price, product image url
                                                                                    e_prod_cat_arr.push({
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

                                                                                //look up ecommerce details on the basis of sub sub category id
                                                                                Ecommerce_prod_details.find({CATEGORY_ID: fil_cat._id})
                                                                                    .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                                                                    .populate('ECOMMERCE_CATEGORY_ID')
                                                                                    .populate('PRODUCT_ID')
                                                                                    .exec()
                                                                                    .then(ecom_doc => {

                                                                                        //traverse through array with product details
                                                                                        for (var prod_cat_item of e_prod_cat_arr) {

                                                                                            //traverse through the ecommerce details object looked up on the basis of category id
                                                                                            for (var ecom_item of ecom_doc) {
                                                                                                //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                                                                var outer_id = prod_cat_item.prod_id;
                                                                                                var inner_id = ecom_item.PRODUCT_ID._id;

                                                                                                //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                                                                                if (outer_id.equals(inner_id)) {
                                                                                                    e_prod_arr.push({
                                                                                                        ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                                                                        ecomm_url: ecom_item.PRODUCT_URL,
                                                                                                        ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                                                                        ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                                                                    });

                                                                                                }
                                                                                            }

                                                                                            //push the ecommerce details array and the corresponding product details in the final array
                                                                                            prod_e_final_arr.push({
                                                                                                prod_details: prod_cat_item,
                                                                                                ecom_details: e_prod_arr
                                                                                            })

                                                                                            //clear the temporary array to store filter options value
                                                                                            e_prod_arr = [];
                                                                                        }

                                                                                        //final output
                                                                                        res.status(200).json({
                                                                                            status: "success",
                                                                                            error: "",
                                                                                            data: {
                                                                                                product_details: prod_e_final_arr,
                                                                                                pages: Math.ceil(count / perPage)
                                                                                            }
                                                                                        });
                                                                                    })
                                                                            })
                                                                    })
                                                            }
                                                            else {
                                                                var ee_prod_arr = [];
                                                                var ee_prod_cat_arr = [];
                                                                var prod_ee_final_arr = [];

                                                                EcommCategory.findOne({
                                                                    $or: [{ECOMMERCE_NAME: regex}, {ECOMMERCE_DESCRIPTION: regex}],
                                                                    ACTIVE_FLAG: 'Y'
                                                                })
                                                                    .select('_id')
                                                                    .exec()
                                                                    .then(fil_cat => {

                                                                        var ee_cat_id;
                                                                        if(fil_cat!= null){
                                                                            ee_cat_id = fil_cat._id;
                                                                            console.log('cat_id',ee_cat_id);
                                                                        }
                                                                        else{
                                                                            e_cat_id = false;
                                                                        }

                                                                        if (ee_cat_id) {
                                                                            // look up ecommerce product details and product details on the basis of sub sub category id
                                                                            Product.find({PRODUCT_CATEGORY_ID: ee_cat_id})
                                                                                .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
                                                                                .populate('PRODUCT_CATEGORY_ID')
                                                                                .populate('PRODUCT_SUB_CATEGORY_ID')
                                                                                .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                                                                                .populate('SELLER_CATEGORY_ID')
                                                                                .populate('SELLER_SUB_CATEGORY_ID')
                                                                                .populate('ECOMMERCE_CATEGORY_ID')
                                                                                .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                                                                                .populate('PRODUCT_IMAGE_ID')
                                                                                .skip((perPage * page) - perPage)
                                                                                .limit(perPage)
                                                                                .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                                                                                .exec()
                                                                                .then(doc_2 => {

                                                                                    Product.count()
                                                                                        .exec()
                                                                                        .then(count => {
                                                                                            //iterate through all the product details fetched
                                                                                            for (var prod_item of doc_2) {
                                                                                                //create an array with the product id, product name, product specifications, product price, product image url
                                                                                                ee_prod_cat_arr.push({
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

                                                                                            //look up ecommerce details on the basis of sub sub category id
                                                                                            Ecommerce_prod_details.find({CATEGORY_ID: fil_cat._id})
                                                                                                .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                                                                                .populate('ECOMMERCE_CATEGORY_ID')
                                                                                                .populate('PRODUCT_ID')
                                                                                                .exec()
                                                                                                .then(ecom_doc => {

                                                                                                    //traverse through array with product details
                                                                                                    for (var prod_cat_item of ee_prod_cat_arr) {

                                                                                                        //traverse through the ecommerce details object looked up on the basis of category id
                                                                                                        for (var ecom_item of ecom_doc) {
                                                                                                            //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                                                                            var outer_id = prod_cat_item.prod_id;
                                                                                                            var inner_id = ecom_item.PRODUCT_ID._id;

                                                                                                            //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                                                                                            if (outer_id.equals(inner_id)) {
                                                                                                                ee_prod_arr.push({
                                                                                                                    ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                                                                                    ecomm_url: ecom_item.PRODUCT_URL,
                                                                                                                    ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                                                                                    ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                                                                                });

                                                                                                            }
                                                                                                        }

                                                                                                        //push the ecommerce details array and the corresponding product details in the final array
                                                                                                        prod_ee_final_arr.push({
                                                                                                            prod_details: prod_cat_item,
                                                                                                            ecom_details: ee_prod_arr
                                                                                                        })

                                                                                                        //clear the temporary array to store filter options value
                                                                                                        ee_prod_arr = [];
                                                                                                    }

                                                                                                    //final output
                                                                                                    res.status(200).json({
                                                                                                        status: "success",
                                                                                                        error: "",
                                                                                                        data: {
                                                                                                            product_details: prod_ee_final_arr,
                                                                                                            pages: Math.ceil(count / perPage)
                                                                                                        }
                                                                                                    });
                                                                                                })
                                                                                        })
                                                                                })
                                                                        }
                                                                        else {
                                                                            res.status(200).json({
                                                                                status: "success",
                                                                                error: "",
                                                                                data: {
                                                                                    product_details: 'not found'
                                                                                }
                                                                            });
                                                                        }
                                                                    })
                                                            }
                                                        })
                                                }
                                            })
                                    }
                                })
                        }
                    })
            }

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
*/


//get all products by searching
exports.search_get_all = (req, res, next) => {

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var rev_arr = [];
    var prod_final_rev_arr = [];

    var perPage = 100;
    var page = req.params.page || 1;

    const search_term = req.body.SearchTerm;

    var regex = new RegExp(search_term,"i");
    console.log('search_term',search_term);


//search in product database
    if( page > 0 && page < 20)
    {
        Product.find({$or:[ {PRODUCT_NAME: regex}, {PRODUCT_SUB_TITLE:regex}, {PRODUCT_DESCRIPTION:regex}], ACTIVE_FLAG:'Y'})
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
        res.status(500).json({
            status: "error",
            data: {
                message: "Invalid page number"
            }
        });
    }


};