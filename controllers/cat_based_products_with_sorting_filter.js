const Filter_category = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");
const Filter_options_product = require("../models/filter_options_products");
const Product = require("../models/product_details");
const Ecommerce_prod_details = require("../models/ecommerce_product_details");


//get product and filter details by category id
exports.get_product_by_categoryId = (req, res, next) => {
    const id = req.params.categoryId;
    const fil_value = req.params.fil_id;

    var perPage = 9;
    var page = req.params.page || 1;

    var final_arr = [];

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];


    if(fil_value.toString() === '5b17d051b2f8427d6c018642')
    {
        // look up ecommerce product details and product details on the basis of category id
        Product.find({PRODUCT_CATEGORY_ID: id})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
            .populate('PRODUCT_IMAGE_ID')
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

                                //final output
                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        filters: final_arr,
                                        product_details: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });
                            })
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
    }
    else if (fil_value.toString() === '5b17d043b2f8427d6c018641')
    {
        // look up ecommerce product details and product details on the basis of category id
        Product.find({PRODUCT_CATEGORY_ID: id})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
            .populate('PRODUCT_IMAGE_ID')
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

                                //final output
                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        filters: final_arr,
                                        product_details: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });
                            })
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
    }
    else if (fil_value.toString() === '5b17d05eb2f8427d6c018643')
    {
        // look up ecommerce product details and product details on the basis of category id
        Product.find({PRODUCT_CATEGORY_ID: id})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
            .populate('PRODUCT_IMAGE_ID')
            .populate('ECOMMERCE_CATEGORY_ID')
            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({PRODUCT_PRICE: -1,UPDATED_DATE: -1, MEAN_RATING: -1})
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

                                //final output
                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        filters: final_arr,
                                        product_details: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });
                            })
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
    }
    else if (fil_value.toString() === '5b17d064b2f8427d6c018644')
    {
        // look up ecommerce product details and product details on the basis of category id
        Product.find({PRODUCT_CATEGORY_ID: id})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
            .populate('PRODUCT_IMAGE_ID')
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

                                //final output
                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        filters: final_arr,
                                        product_details: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });
                            })
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
    }
    else if (fil_value.toString() === '5b17d06ab2f8427d6c018645')
    {
        // look up ecommerce product details and product details on the basis of category id
        Product.find({PRODUCT_CATEGORY_ID: id})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
            .populate('PRODUCT_IMAGE_ID')
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

                                //final output
                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        filters: final_arr,
                                        product_details: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });
                            })
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
    }
    else if (fil_value.toString() === '5b17d072b2f8427d6c018646')
    {
        // look up ecommerce product details and product details on the basis of category id
        Product.find({PRODUCT_CATEGORY_ID: id})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
            .populate('PRODUCT_IMAGE_ID')
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

                                //final output
                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        filters: final_arr,
                                        product_details: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });
                            })
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
    }
    else
    {
        // look up ecommerce product details and product details on the basis of category id
        Product.find({PRODUCT_CATEGORY_ID: id})
            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS MEAN_RATING REVIEW_COUNT UPDATED_DATE _id")
            .populate('PRODUCT_IMAGE_ID')
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

                                //final output
                                res.status(200).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        filters: final_arr,
                                        product_details: prod_final_arr,
                                        pages: Math.ceil(count / perPage)
                                    }
                                });
                            })
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
    }

};
