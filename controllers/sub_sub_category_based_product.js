const Filter_category = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");
const Filter_options_product = require("../models/filter_options_products");
const Product = require("../models/product_details");
const EcommProduct = require("../models/ecommerce_product_details");
const Review = require("../models/review_details");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory")


//get product and filter details by category id
exports.get_product_by_categoryId = (req, res, next) => {
    const id = req.params.categoryId;

    var perPage = 100;
    var page = req.params.page || 1;

    var fil_arr = [];
    var fil_cat_arr = [];
    var final_arr = [];

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var rev_arr = [];
    var prod_final_rev_arr = [];

    //look up filter id on basis of category id
    Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
        .select('SUB_SUB_CATEGORY_ID _id')
        .exec()
        .then(cat_res => {
            Filter_category.find({SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                .select('CATEGORY_ID SUB_CATEGORY_ID SUB_SUB_CATEGORY_ID')
                .populate('FILTER_ID')
                .exec()
                .then(fil_cat => {
                    if(fil_cat)
                    {
                        //iterate through all the filter details fetched
                        for( var item_1 of fil_cat)
                        {
                            //create an array with the filter id and filter type name
                            fil_cat_arr.push({FILTER_TYPE: item_1.FILTER_ID._id, FILTER_NAME: item_1.FILTER_ID.FILTER_CATEGORY_NAME})
                        }

                        //look up filter options on the basis of category id
                        Filter_options.find({SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                            .select("DISPLAY_TEXT ACTIVE_FLAG _id")
                            .populate('FILTER_ID')
                            .exec()
                            .then(doc => {

                                //traverse through array with the filter id and filter type name
                                for(var item of fil_cat_arr)
                                {
                                    //store the filter type name in a temp variable
                                    var filter_name = item.FILTER_NAME;

                                    //traverse through the filter options object looked up on the basis of category id
                                    for(var item_2 of doc)
                                    {
                                        //store the filter type id from the filter table and filter type id from the filter options table in a temp variable
                                        var outer_id = item.FILTER_TYPE;
                                        var inner_id = item_2.FILTER_ID._id;

                                        //if both the above filter id are equal then create an array with the filter option values for the corresponding array
                                        if (outer_id.equals(inner_id))
                                        {
                                            fil_arr.push({fil_val_id: item_2._id, filter_value: item_2.DISPLAY_TEXT});

                                        }
                                    }

                                    //push the filter options array and the corresponding filter type name in the final array
                                    final_arr.push({fil_type: filter_name, fil_value: fil_arr})

                                    //clear the temporary array to store filter options value
                                    fil_arr = [];
                                }

                                // look up ecommerce product details and product details on the basis of category id
                                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
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

                                                        var product_sub_sub_category_name=undefined;
                                                        var product_sub_sub_category_id=undefined;
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
                                                                            filters: final_arr,
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
                    }
                    else {
                        res.status(404)
                            .json({
                                status: "error",
                                error: "Id not found",
                                message: "No valid entry found for provided category ID"
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

};


//get all active product details
exports.product_get_all = (req, res, next) => {

    const id = req.params.categoryId;
    var perPage = 100;
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
    var min_price = 0;
    var max_price = 100000000;
    if(req.body.MIN_PRICE!=null || req.body.MIN_PRICE!=undefined)
    {
        min_price = req.body.MIN_PRICE;
    }
    if(req.body.MAX_PRICE!=null || req.body.MAX_PRICE!=undefined)
    {
        max_price = req.body.MAX_PRICE;
    }

    Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
        .select('SUB_SUB_CATEGORY_ID _id')
        .exec()
        .then(cat_res => {
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
                    console.log("sub_sub_category_id",cat_res[0]._id);
                    //console.log("min_price",min_price);
                    //console.log("max_price",max_price);

                    //{$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]}
                    // look up ecommerce product details and product details on the basis of category id
                    Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                        .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                        .populate('PRODUCT_CATEGORY_ID')
                        .populate('PRODUCT_SUB_CATEGORY_ID')
                        .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                        .populate('ECOMMERCE_CATEGORY_ID')
                        .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                        .skip((perPage * page) - perPage)
                        .limit(perPage)
                        .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                        .exec()
                        .then(doc_2 => {

                           console.log("dco_2",doc_2);

                            Product.count()
                                .exec()
                                .then(count => {

                                    //iterate through all the product details fetched
                                    for( var prod_item of doc_2)
                                    {
                                        //create an array with the product id, product name, product specifications, product price, product image url
                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                                    //console.log(prod_cat_arr);

                                    //look up ecommerce details on the basis of category id
                                    EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                            //console.log(prod_final_arr);

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
                                                    //console.log(prod_id_arr);
                                                    //console.log(prod_final_rev_arr);

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
                                                    if(fil_arr.length > 0)
                                                    {
                                                        //final output
                                                        res.status(200).json({
                                                            status: "success",
                                                            data: {
                                                                product_id: prod_id_arr,
                                                                product_details: final_arr,
                                                                pages: Math.ceil(count / perPage)
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        //final output
                                                        res.status(200).json({
                                                            status: "success",
                                                            data: {
                                                                product_id: prod_id_arr,
                                                                product_details: prod_final_rev_arr,
                                                                pages: Math.ceil(count / perPage)
                                                            }
                                                        });
                                                    }
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


//get product and filter details by category id
exports.get_product_by_sorting_filter = (req, res, next) => {
    const id = req.params.categoryId;
    const fil_value = req.params.fil_id;

    var perPage = 100;
    var page = req.params.page || 1;

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var rev_arr = [];
    var prod_final_rev_arr = [];


    if(fil_value === 'oldest-to-newest') {

        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({UPDATED_DATE: 1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                if(docs.length > 0)
                                {

                                    for( var prod_item of docs)
                                    {

                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
            })
    }
    else if (fil_value === 'newest-to-oldest')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
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

                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
            })
    }
    else if (fil_value === 'price-low-to-high')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({PRODUCT_PRICE: 1, UPDATED_DATE: -1, MEAN_RATING: -1 })
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                if(docs.length > 0)
                                {

                                    for( var prod_item of docs)
                                    {

                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
            })
    }
    else if (fil_value === 'price-high-to-low')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({PRODUCT_PRICE: -1, UPDATED_DATE: -1, MEAN_RATING: -1 })
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                if(docs.length > 0)
                                {

                                    for( var prod_item of docs)
                                    {

                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
            })
    }
    else if (fil_value === 'rating-low-to-high')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({MEAN_RATING: 1,  UPDATED_DATE: -1, PRODUCT_PRICE: -1  })
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                if(docs.length > 0)
                                {

                                    for( var prod_item of docs)
                                    {

                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
            })
    }
    else if (fil_value === 'rating-high-to-low')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({MEAN_RATING: -1,  UPDATED_DATE: -1, PRODUCT_PRICE: 1  })
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                if(docs.length > 0)
                                {

                                    for( var prod_item of docs)
                                    {

                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
            })
    }
    else
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({ UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1   })
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                if(docs.length > 0)
                                {

                                    for( var prod_item of docs)
                                    {

                                        var product_sub_sub_category_name=undefined;
                                        var product_sub_sub_category_id=undefined;
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
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
            })
    }

};


//get product and filter details by category id
exports.get_product_by_filter_sorting_filter = (req, res, next) => {
    const id = req.params.categoryId;
    const fil_value = req.params.fil_id;

    var perPage = 100;
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
    var min_price = 0;
    var max_price = 100000000;
    if(req.body.MIN_PRICE!=null || req.body.MIN_PRICE!=undefined)
    {
        min_price = req.body.MIN_PRICE;
    }
    if(req.body.MAX_PRICE!=null || req.body.MAX_PRICE!=undefined)
    {
        max_price = req.body.MAX_PRICE;
    }


    if(fil_value === 'oldest-to-newest') {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
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
                        Product.find({$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]})
                            .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                            .populate('PRODUCT_CATEGORY_ID')
                            .populate('PRODUCT_SUB_CATEGORY_ID')
                            .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                            .populate('ECOMMERCE_CATEGORY_ID')
                            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                            .skip((perPage * page) - perPage)
                            .limit(perPage)
                            .sort({UPDATED_DATE: 1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
                            .exec()
                            .then(doc_2 => {

                                Product.count()
                                    .exec()
                                    .then(count => {

                                        //iterate through all the product details fetched
                                        for( var prod_item of doc_2)
                                        {
                                            //create an array with the product id, product name, product specifications, product price, product image url
                                            var product_sub_sub_category_name=undefined;
                                            var product_sub_sub_category_id=undefined;
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
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                                        if(fil_arr.length > 0)
                                                        {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: final_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: prod_final_rev_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
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
    else if (fil_value === 'newest-to-oldest')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
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
                        Product.find({$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]})
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
                                            var product_sub_sub_category_name=undefined;
                                            var product_sub_sub_category_id=undefined;
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
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                                        if(fil_arr.length > 0)
                                                        {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: final_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: prod_final_rev_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
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
    else if (fil_value === 'price-low-to-high')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
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
                        Product.find({$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]})
                            .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                            .populate('PRODUCT_CATEGORY_ID')
                            .populate('PRODUCT_SUB_CATEGORY_ID')
                            .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                            .populate('ECOMMERCE_CATEGORY_ID')
                            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                            .skip((perPage * page) - perPage)
                            .limit(perPage)
                            .sort({PRODUCT_PRICE: 1, UPDATED_DATE: -1, MEAN_RATING: -1})
                            .exec()
                            .then(doc_2 => {

                                Product.count()
                                    .exec()
                                    .then(count => {

                                        //iterate through all the product details fetched
                                        for( var prod_item of doc_2)
                                        {
                                            //create an array with the product id, product name, product specifications, product price, product image url
                                            var product_sub_sub_category_name=undefined;
                                            var product_sub_sub_category_id=undefined;
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
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                                        if(fil_arr.length > 0)
                                                        {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: final_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: prod_final_rev_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
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
    else if (fil_value === 'price-high-to-low')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
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
                        Product.find({$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]})
                            .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                            .populate('PRODUCT_CATEGORY_ID')
                            .populate('PRODUCT_SUB_CATEGORY_ID')
                            .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                            .populate('ECOMMERCE_CATEGORY_ID')
                            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                            .skip((perPage * page) - perPage)
                            .limit(perPage)
                            .sort({PRODUCT_PRICE: -1, UPDATED_DATE: -1, MEAN_RATING: -1})
                            .exec()
                            .then(doc_2 => {

                                Product.count()
                                    .exec()
                                    .then(count => {

                                        //iterate through all the product details fetched
                                        for( var prod_item of doc_2)
                                        {
                                            //create an array with the product id, product name, product specifications, product price, product image url
                                            var product_sub_sub_category_name=undefined;
                                            var product_sub_sub_category_id=undefined;
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
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                                        if(fil_arr.length > 0)
                                                        {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: final_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: prod_final_rev_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
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
    else if (fil_value === 'rating-low-to-high')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
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
                        Product.find({$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]})
                            .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                            .populate('PRODUCT_CATEGORY_ID')
                            .populate('PRODUCT_SUB_CATEGORY_ID')
                            .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                            .populate('ECOMMERCE_CATEGORY_ID')
                            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                            .skip((perPage * page) - perPage)
                            .limit(perPage)
                            .sort({MEAN_RATING: 1, UPDATED_DATE: -1, PRODUCT_PRICE: 1})
                            .exec()
                            .then(doc_2 => {

                                Product.count()
                                    .exec()
                                    .then(count => {

                                        //iterate through all the product details fetched
                                        for( var prod_item of doc_2)
                                        {
                                            //create an array with the product id, product name, product specifications, product price, product image url
                                            var product_sub_sub_category_name=undefined;
                                            var product_sub_sub_category_id=undefined;
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
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                                        if(fil_arr.length > 0)
                                                        {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: final_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: prod_final_rev_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
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
    else if (fil_value === 'rating-high-to-low')
    {
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
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
                        Product.find({$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]})
                            .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT PRODUCT_IMAGE_LINKS UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                            .populate('PRODUCT_CATEGORY_ID')
                            .populate('PRODUCT_SUB_CATEGORY_ID')
                            .populate('PRODUCT_SUB_SUB_CATEGORY_ID',null)
                            .populate('ECOMMERCE_CATEGORY_ID')
                            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                            .skip((perPage * page) - perPage)
                            .limit(perPage)
                            .sort({MEAN_RATING: -1, UPDATED_DATE: -1, PRODUCT_PRICE: 1})
                            .exec()
                            .then(doc_2 => {

                                Product.count()
                                    .exec()
                                    .then(count => {

                                        //iterate through all the product details fetched
                                        for( var prod_item of doc_2)
                                        {
                                            //create an array with the product id, product name, product specifications, product price, product image url
                                            var product_sub_sub_category_name=undefined;
                                            var product_sub_sub_category_id=undefined;
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
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                                        if(fil_arr.length > 0)
                                                        {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: final_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: prod_final_rev_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
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
        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
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
                        Product.find({$and: [{PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id},{PRODUCT_PRICE: {$gte: min_price,$lte: max_price}}]})
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
                                            var product_sub_sub_category_name=undefined;
                                            var product_sub_sub_category_id=undefined;
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
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
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
                                                        if(fil_arr.length > 0)
                                                        {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: final_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
                                                        else {
                                                            //final output
                                                            res.status(200).json({
                                                                status: "success",
                                                                data: {
                                                                    product_id: prod_id_arr,
                                                                    product_details: prod_final_rev_arr,
                                                                    pages: Math.ceil(count / perPage)
                                                                }
                                                            });
                                                        }
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

};