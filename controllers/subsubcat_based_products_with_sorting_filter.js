const Category = require("../models/category");
const Product = require("../models/product_details");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");
const EcommProduct = require("../models/ecommerce_product_details");
const Productimages = require("../models/product_images");
const Review = require("../models/review_details");

//get product and filter details by category id
exports.get_product_by_subsubcategoryId = (req, res, next) => {
    const id = req.params.subsubcategoryId;
    const fil_value = req.params.fil_id;

    var perPage = 9;
    var page = req.params.page || 1;

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    var img_arr = [];
    var prod_final_img_arr = [];

    var rev_arr = [];
    var prod_final_rev_arr = [];


    if(fil_value === 'oldest-to-newest') {

        Subsubcategory.find({SUB_SUB_CATEGORY_ID: id})
            .select('SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(cat_res => {
                // look up ecommerce product details and product details on the basis of category id
                Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: cat_res[0]._id})
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
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
                                //iterate through all the product details fetched
                                for (var prod_item of docs) {
                                    //create an array with the basic product details
                                    prod_cat_arr.push({
                                        prod_id: prod_item._id,
                                        product_id: prod_item.PRODUCT_ID,
                                        prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                        product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                        product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                                        updated_by_user: prod_item.UPDATED_BY,
                                        updated_on: prod_item.UPDATED_DATE,
                                        isActive: prod_item.ACTIVE_FLAG
                                    })
                                }

                                //Fetch images for every product and push in an array
                                Productimages.find({ACTIVE_FLAG: 'Y'})
                                    .select("TEMPORARY_IMAGE_LINK PRODUCT_ID _id")
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(img_doc => {

                                        //console.log('img',img_doc);

                                        for (var prod_img_item of prod_cat_arr) {

                                            //traverse through the product image details object
                                            for (var img_item of img_doc) {
                                                //store the product id from the product table and product id from the product image details table in a temp variable
                                                var outer_id = prod_img_item.prod_id;

                                                var inner_id = img_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the image detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    img_arr.push({
                                                        image_url: img_item.TEMPORARY_IMAGE_LINK
                                                    });

                                                }
                                            }

                                            //push the image details array and the corresponding product details in another array
                                            prod_final_img_arr.push({
                                                prod_details: prod_img_item,
                                                image_details: img_arr
                                            })

                                            //clear the temporary array to store image details value
                                            img_arr = [];
                                        }

                                        //look up ecommerce details
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('PRODUCT_ID')
                                            .exec()
                                            .then(ecom_doc => {
                                                //traverse through array with product details
                                                for (var prod_cat_item of prod_final_img_arr) {

                                                    //traverse through the ecommerce details object
                                                    for (var ecom_item of ecom_doc) {

                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                        var outer_id = prod_cat_item.prod_details.prod_id;

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

                                                    //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                    prod_final_arr.push({
                                                        prod_details: prod_cat_item,
                                                        ecom_details: prod_arr
                                                    })

                                                    //clear the temporary array to store ecommerce details value
                                                    prod_arr = [];
                                                }

                                                Review.find({ACTIVE_FLAG: 'Y'})
                                                    .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                    .populate('CUSTOMER_ID')
                                                    .populate('PRODUCT_ID')
                                                    .exec()
                                                    .then(rev_doc => {
                                                        //traverse through array with product details
                                                        for (var prod_cat_item of prod_final_arr) {

                                                            //traverse through the review details object
                                                            for (var rev_item of rev_doc) {
                                                                //store the product id from the product table and product id from the review details table in a temp variable
                                                                var outer_id = prod_cat_item.prod_details.prod_details.prod_id;
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
                                                            prod_final_rev_arr.push({
                                                                prod_details: prod_cat_item,
                                                                review_details: rev_arr
                                                            })

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
                                                            message: "An error has occurred"
                                                        }
                                                    });
                                                })

                                            }).catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "error",
                                                data: {
                                                    message: "An error has occurred"
                                                }
                                            });
                                        });

                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "An error has occurred"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "An error has occurred"
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
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
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
                                //iterate through all the product details fetched
                                for (var prod_item of docs) {
                                    //create an array with the basic product details
                                    prod_cat_arr.push({
                                        prod_id: prod_item._id,
                                        product_id: prod_item.PRODUCT_ID,
                                        prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                        product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                        product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                                        updated_by_user: prod_item.UPDATED_BY,
                                        updated_on: prod_item.UPDATED_DATE,
                                        isActive: prod_item.ACTIVE_FLAG
                                    })
                                }

                                //Fetch images for every product and push in an array
                                Productimages.find({ACTIVE_FLAG: 'Y'})
                                    .select("TEMPORARY_IMAGE_LINK PRODUCT_ID _id")
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(img_doc => {

                                        //console.log('img',img_doc);

                                        for (var prod_img_item of prod_cat_arr) {

                                            //traverse through the product image details object
                                            for (var img_item of img_doc) {
                                                //store the product id from the product table and product id from the product image details table in a temp variable
                                                var outer_id = prod_img_item.prod_id;

                                                var inner_id = img_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the image detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    img_arr.push({
                                                        image_url: img_item.TEMPORARY_IMAGE_LINK
                                                    });

                                                }
                                            }

                                            //push the image details array and the corresponding product details in another array
                                            prod_final_img_arr.push({
                                                prod_details: prod_img_item,
                                                image_details: img_arr
                                            })

                                            //clear the temporary array to store image details value
                                            img_arr = [];
                                        }

                                        //look up ecommerce details
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('PRODUCT_ID')
                                            .exec()
                                            .then(ecom_doc => {
                                                //traverse through array with product details
                                                for (var prod_cat_item of prod_final_img_arr) {

                                                    //traverse through the ecommerce details object
                                                    for (var ecom_item of ecom_doc) {

                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                        var outer_id = prod_cat_item.prod_details.prod_id;

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

                                                    //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                    prod_final_arr.push({
                                                        prod_details: prod_cat_item,
                                                        ecom_details: prod_arr
                                                    })

                                                    //clear the temporary array to store ecommerce details value
                                                    prod_arr = [];
                                                }

                                                Review.find({ACTIVE_FLAG: 'Y'})
                                                    .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                    .populate('CUSTOMER_ID')
                                                    .populate('PRODUCT_ID')
                                                    .exec()
                                                    .then(rev_doc => {
                                                        //traverse through array with product details
                                                        for (var prod_cat_item of prod_final_arr) {

                                                            //traverse through the review details object
                                                            for (var rev_item of rev_doc) {
                                                                //store the product id from the product table and product id from the review details table in a temp variable
                                                                var outer_id = prod_cat_item.prod_details.prod_details.prod_id;
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
                                                            prod_final_rev_arr.push({
                                                                prod_details: prod_cat_item,
                                                                review_details: rev_arr
                                                            })

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
                                                            message: "An error has occurred"
                                                        }
                                                    });
                                                })

                                            }).catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "error",
                                                data: {
                                                    message: "An error has occurred"
                                                }
                                            });
                                        });

                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "An error has occurred"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "An error has occurred"
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
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({PRODUCT_PRICE: 1, UPDATED_DATE: -1, MEAN_RATING: -1})
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                //iterate through all the product details fetched
                                for (var prod_item of docs) {
                                    //create an array with the basic product details
                                    prod_cat_arr.push({
                                        prod_id: prod_item._id,
                                        product_id: prod_item.PRODUCT_ID,
                                        prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                        product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                        product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                                        updated_by_user: prod_item.UPDATED_BY,
                                        updated_on: prod_item.UPDATED_DATE,
                                        isActive: prod_item.ACTIVE_FLAG
                                    })
                                }

                                //Fetch images for every product and push in an array
                                Productimages.find({ACTIVE_FLAG: 'Y'})
                                    .select("TEMPORARY_IMAGE_LINK PRODUCT_ID _id")
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(img_doc => {

                                        //console.log('img',img_doc);

                                        for (var prod_img_item of prod_cat_arr) {

                                            //traverse through the product image details object
                                            for (var img_item of img_doc) {
                                                //store the product id from the product table and product id from the product image details table in a temp variable
                                                var outer_id = prod_img_item.prod_id;

                                                var inner_id = img_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the image detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    img_arr.push({
                                                        image_url: img_item.TEMPORARY_IMAGE_LINK
                                                    });

                                                }
                                            }

                                            //push the image details array and the corresponding product details in another array
                                            prod_final_img_arr.push({
                                                prod_details: prod_img_item,
                                                image_details: img_arr
                                            })

                                            //clear the temporary array to store image details value
                                            img_arr = [];
                                        }

                                        //look up ecommerce details
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('PRODUCT_ID')
                                            .exec()
                                            .then(ecom_doc => {
                                                //traverse through array with product details
                                                for (var prod_cat_item of prod_final_img_arr) {

                                                    //traverse through the ecommerce details object
                                                    for (var ecom_item of ecom_doc) {

                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                        var outer_id = prod_cat_item.prod_details.prod_id;

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

                                                    //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                    prod_final_arr.push({
                                                        prod_details: prod_cat_item,
                                                        ecom_details: prod_arr
                                                    })

                                                    //clear the temporary array to store ecommerce details value
                                                    prod_arr = [];
                                                }

                                                Review.find({ACTIVE_FLAG: 'Y'})
                                                    .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                    .populate('CUSTOMER_ID')
                                                    .populate('PRODUCT_ID')
                                                    .exec()
                                                    .then(rev_doc => {
                                                        //traverse through array with product details
                                                        for (var prod_cat_item of prod_final_arr) {

                                                            //traverse through the review details object
                                                            for (var rev_item of rev_doc) {
                                                                //store the product id from the product table and product id from the review details table in a temp variable
                                                                var outer_id = prod_cat_item.prod_details.prod_details.prod_id;
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
                                                            prod_final_rev_arr.push({
                                                                prod_details: prod_cat_item,
                                                                review_details: rev_arr
                                                            })

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
                                                            message: "An error has occurred"
                                                        }
                                                    });
                                                })

                                            }).catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "error",
                                                data: {
                                                    message: "An error has occurred"
                                                }
                                            });
                                        });

                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "An error has occurred"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "An error has occurred"
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
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({PRODUCT_PRICE: -1, UPDATED_DATE: -1, MEAN_RATING: -1})
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                //iterate through all the product details fetched
                                for (var prod_item of docs) {
                                    //create an array with the basic product details
                                    prod_cat_arr.push({
                                        prod_id: prod_item._id,
                                        product_id: prod_item.PRODUCT_ID,
                                        prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                        product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                        product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                                        updated_by_user: prod_item.UPDATED_BY,
                                        updated_on: prod_item.UPDATED_DATE,
                                        isActive: prod_item.ACTIVE_FLAG
                                    })
                                }

                                //Fetch images for every product and push in an array
                                Productimages.find({ACTIVE_FLAG: 'Y'})
                                    .select("TEMPORARY_IMAGE_LINK PRODUCT_ID _id")
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(img_doc => {

                                        //console.log('img',img_doc);

                                        for (var prod_img_item of prod_cat_arr) {

                                            //traverse through the product image details object
                                            for (var img_item of img_doc) {
                                                //store the product id from the product table and product id from the product image details table in a temp variable
                                                var outer_id = prod_img_item.prod_id;

                                                var inner_id = img_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the image detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    img_arr.push({
                                                        image_url: img_item.TEMPORARY_IMAGE_LINK
                                                    });

                                                }
                                            }

                                            //push the image details array and the corresponding product details in another array
                                            prod_final_img_arr.push({
                                                prod_details: prod_img_item,
                                                image_details: img_arr
                                            })

                                            //clear the temporary array to store image details value
                                            img_arr = [];
                                        }

                                        //look up ecommerce details
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('PRODUCT_ID')
                                            .exec()
                                            .then(ecom_doc => {
                                                //traverse through array with product details
                                                for (var prod_cat_item of prod_final_img_arr) {

                                                    //traverse through the ecommerce details object
                                                    for (var ecom_item of ecom_doc) {

                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                        var outer_id = prod_cat_item.prod_details.prod_id;

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

                                                    //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                    prod_final_arr.push({
                                                        prod_details: prod_cat_item,
                                                        ecom_details: prod_arr
                                                    })

                                                    //clear the temporary array to store ecommerce details value
                                                    prod_arr = [];
                                                }

                                                Review.find({ACTIVE_FLAG: 'Y'})
                                                    .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                    .populate('CUSTOMER_ID')
                                                    .populate('PRODUCT_ID')
                                                    .exec()
                                                    .then(rev_doc => {
                                                        //traverse through array with product details
                                                        for (var prod_cat_item of prod_final_arr) {

                                                            //traverse through the review details object
                                                            for (var rev_item of rev_doc) {
                                                                //store the product id from the product table and product id from the review details table in a temp variable
                                                                var outer_id = prod_cat_item.prod_details.prod_details.prod_id;
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
                                                            prod_final_rev_arr.push({
                                                                prod_details: prod_cat_item,
                                                                review_details: rev_arr
                                                            })

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
                                                            message: "An error has occurred"
                                                        }
                                                    });
                                                })

                                            }).catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "error",
                                                data: {
                                                    message: "An error has occurred"
                                                }
                                            });
                                        });

                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "An error has occurred"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "An error has occurred"
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
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({MEAN_RATING: 1, UPDATED_DATE: -1, PRODUCT_PRICE: 1})
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                //iterate through all the product details fetched
                                for (var prod_item of docs) {
                                    //create an array with the basic product details
                                    prod_cat_arr.push({
                                        prod_id: prod_item._id,
                                        product_id: prod_item.PRODUCT_ID,
                                        prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                        product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                        product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                                        updated_by_user: prod_item.UPDATED_BY,
                                        updated_on: prod_item.UPDATED_DATE,
                                        isActive: prod_item.ACTIVE_FLAG
                                    })
                                }

                                //Fetch images for every product and push in an array
                                Productimages.find({ACTIVE_FLAG: 'Y'})
                                    .select("TEMPORARY_IMAGE_LINK PRODUCT_ID _id")
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(img_doc => {

                                        //console.log('img',img_doc);

                                        for (var prod_img_item of prod_cat_arr) {

                                            //traverse through the product image details object
                                            for (var img_item of img_doc) {
                                                //store the product id from the product table and product id from the product image details table in a temp variable
                                                var outer_id = prod_img_item.prod_id;

                                                var inner_id = img_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the image detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    img_arr.push({
                                                        image_url: img_item.TEMPORARY_IMAGE_LINK
                                                    });

                                                }
                                            }

                                            //push the image details array and the corresponding product details in another array
                                            prod_final_img_arr.push({
                                                prod_details: prod_img_item,
                                                image_details: img_arr
                                            })

                                            //clear the temporary array to store image details value
                                            img_arr = [];
                                        }

                                        //look up ecommerce details
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('PRODUCT_ID')
                                            .exec()
                                            .then(ecom_doc => {
                                                //traverse through array with product details
                                                for (var prod_cat_item of prod_final_img_arr) {

                                                    //traverse through the ecommerce details object
                                                    for (var ecom_item of ecom_doc) {

                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                        var outer_id = prod_cat_item.prod_details.prod_id;

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

                                                    //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                    prod_final_arr.push({
                                                        prod_details: prod_cat_item,
                                                        ecom_details: prod_arr
                                                    })

                                                    //clear the temporary array to store ecommerce details value
                                                    prod_arr = [];
                                                }

                                                Review.find({ACTIVE_FLAG: 'Y'})
                                                    .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                    .populate('CUSTOMER_ID')
                                                    .populate('PRODUCT_ID')
                                                    .exec()
                                                    .then(rev_doc => {
                                                        //traverse through array with product details
                                                        for (var prod_cat_item of prod_final_arr) {

                                                            //traverse through the review details object
                                                            for (var rev_item of rev_doc) {
                                                                //store the product id from the product table and product id from the review details table in a temp variable
                                                                var outer_id = prod_cat_item.prod_details.prod_details.prod_id;
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
                                                            prod_final_rev_arr.push({
                                                                prod_details: prod_cat_item,
                                                                review_details: rev_arr
                                                            })

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
                                                            message: "An error has occurred"
                                                        }
                                                    });
                                                })

                                            }).catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "error",
                                                data: {
                                                    message: "An error has occurred"
                                                }
                                            });
                                        });

                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "An error has occurred"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "An error has occurred"
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
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
                    .populate('ECOMMERCE_CATEGORY_ID')
                    .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                    .skip((perPage * page) - perPage)
                    .limit(perPage)
                    .sort({MEAN_RATING: -1, UPDATED_DATE: -1, PRODUCT_PRICE: 1})
                    .exec()
                    .then(docs => {

                        Product.count()
                            .exec()
                            .then(count => {
                                //iterate through all the product details fetched
                                for (var prod_item of docs) {
                                    //create an array with the basic product details
                                    prod_cat_arr.push({
                                        prod_id: prod_item._id,
                                        product_id: prod_item.PRODUCT_ID,
                                        prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                        product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                        product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                                        updated_by_user: prod_item.UPDATED_BY,
                                        updated_on: prod_item.UPDATED_DATE,
                                        isActive: prod_item.ACTIVE_FLAG
                                    })
                                }

                                //Fetch images for every product and push in an array
                                Productimages.find({ACTIVE_FLAG: 'Y'})
                                    .select("TEMPORARY_IMAGE_LINK PRODUCT_ID _id")
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(img_doc => {

                                        //console.log('img',img_doc);

                                        for (var prod_img_item of prod_cat_arr) {

                                            //traverse through the product image details object
                                            for (var img_item of img_doc) {
                                                //store the product id from the product table and product id from the product image details table in a temp variable
                                                var outer_id = prod_img_item.prod_id;

                                                var inner_id = img_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the image detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    img_arr.push({
                                                        image_url: img_item.TEMPORARY_IMAGE_LINK
                                                    });

                                                }
                                            }

                                            //push the image details array and the corresponding product details in another array
                                            prod_final_img_arr.push({
                                                prod_details: prod_img_item,
                                                image_details: img_arr
                                            })

                                            //clear the temporary array to store image details value
                                            img_arr = [];
                                        }

                                        //look up ecommerce details
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('PRODUCT_ID')
                                            .exec()
                                            .then(ecom_doc => {
                                                //traverse through array with product details
                                                for (var prod_cat_item of prod_final_img_arr) {

                                                    //traverse through the ecommerce details object
                                                    for (var ecom_item of ecom_doc) {

                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                        var outer_id = prod_cat_item.prod_details.prod_id;

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

                                                    //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                    prod_final_arr.push({
                                                        prod_details: prod_cat_item,
                                                        ecom_details: prod_arr
                                                    })

                                                    //clear the temporary array to store ecommerce details value
                                                    prod_arr = [];
                                                }

                                                Review.find({ACTIVE_FLAG: 'Y'})
                                                    .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                    .populate('CUSTOMER_ID')
                                                    .populate('PRODUCT_ID')
                                                    .exec()
                                                    .then(rev_doc => {
                                                        //traverse through array with product details
                                                        for (var prod_cat_item of prod_final_arr) {

                                                            //traverse through the review details object
                                                            for (var rev_item of rev_doc) {
                                                                //store the product id from the product table and product id from the review details table in a temp variable
                                                                var outer_id = prod_cat_item.prod_details.prod_details.prod_id;
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
                                                            prod_final_rev_arr.push({
                                                                prod_details: prod_cat_item,
                                                                review_details: rev_arr
                                                            })

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
                                                            message: "An error has occurred"
                                                        }
                                                    });
                                                })

                                            }).catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "error",
                                                data: {
                                                    message: "An error has occurred"
                                                }
                                            });
                                        });

                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "An error has occurred"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "An error has occurred"
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
                    .select("PRODUCT_ID PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS PRODUCT_URL MEAN_RATING RATING_COUNT LEAST_PRICE_ECOMMERCE REVIEW_COUNT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_CATEGORY_ID')
                    .populate('PRODUCT_SUB_CATEGORY_ID')
                    .populate('PRODUCT_SUB_SUB_CATEGORY_ID')
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
                                //iterate through all the product details fetched
                                for (var prod_item of docs) {
                                    //create an array with the basic product details
                                    prod_cat_arr.push({
                                        prod_id: prod_item._id,
                                        product_id: prod_item.PRODUCT_ID,
                                        prod_category_name: prod_item.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                        product_sub_category_name: prod_item.PRODUCT_SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                        product_sub_sub_category_name: prod_item.PRODUCT_SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                                        updated_by_user: prod_item.UPDATED_BY,
                                        updated_on: prod_item.UPDATED_DATE,
                                        isActive: prod_item.ACTIVE_FLAG
                                    })
                                }

                                //Fetch images for every product and push in an array
                                Productimages.find({ACTIVE_FLAG: 'Y'})
                                    .select("TEMPORARY_IMAGE_LINK PRODUCT_ID _id")
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(img_doc => {

                                        //console.log('img',img_doc);

                                        for (var prod_img_item of prod_cat_arr) {

                                            //traverse through the product image details object
                                            for (var img_item of img_doc) {
                                                //store the product id from the product table and product id from the product image details table in a temp variable
                                                var outer_id = prod_img_item.prod_id;

                                                var inner_id = img_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the image detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    img_arr.push({
                                                        image_url: img_item.TEMPORARY_IMAGE_LINK
                                                    });

                                                }
                                            }

                                            //push the image details array and the corresponding product details in another array
                                            prod_final_img_arr.push({
                                                prod_details: prod_img_item,
                                                image_details: img_arr
                                            })

                                            //clear the temporary array to store image details value
                                            img_arr = [];
                                        }

                                        //look up ecommerce details
                                        EcommProduct.find({ACTIVE_FLAG: 'Y'})
                                            .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                            .populate('ECOMMERCE_CATEGORY_ID')
                                            .populate('PRODUCT_ID')
                                            .exec()
                                            .then(ecom_doc => {
                                                //traverse through array with product details
                                                for (var prod_cat_item of prod_final_img_arr) {

                                                    //traverse through the ecommerce details object
                                                    for (var ecom_item of ecom_doc) {

                                                        //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                        var outer_id = prod_cat_item.prod_details.prod_id;

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

                                                    //push the ecommerce details array and the corresponding product details stored along with image details in final array
                                                    prod_final_arr.push({
                                                        prod_details: prod_cat_item,
                                                        ecom_details: prod_arr
                                                    })

                                                    //clear the temporary array to store ecommerce details value
                                                    prod_arr = [];
                                                }

                                                Review.find({ACTIVE_FLAG: 'Y'})
                                                    .select("REVIEW_TITLE REVIEW_DESCRIPTION ECOMMERCE_REVIEW REVIEWER_NAME ACTIVE_FLAG _id")
                                                    .populate('CUSTOMER_ID')
                                                    .populate('PRODUCT_ID')
                                                    .exec()
                                                    .then(rev_doc => {
                                                        //traverse through array with product details
                                                        for (var prod_cat_item of prod_final_arr) {

                                                            //traverse through the review details object
                                                            for (var rev_item of rev_doc) {
                                                                //store the product id from the product table and product id from the review details table in a temp variable
                                                                var outer_id = prod_cat_item.prod_details.prod_details.prod_id;
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
                                                            prod_final_rev_arr.push({
                                                                prod_details: prod_cat_item,
                                                                review_details: rev_arr
                                                            })

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
                                                            message: "An error has occurred"
                                                        }
                                                    });
                                                })

                                            }).catch(err => {
                                            console.log(err);
                                            res.status(500).json({
                                                status: "error",
                                                data: {
                                                    message: "An error has occurred"
                                                }
                                            });
                                        });

                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "An error has occurred"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "An error has occurred"
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
