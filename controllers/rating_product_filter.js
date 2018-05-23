const mongoose = require("mongoose");
const Product = require("../models/product_details");
const Ecommerce_product = require("../models/ecommerce_product_details");
const Rating = require("../models/rating_details");

//get all product details by rating
exports.product_get_by_rating = (req, res, next) => {
    const rating_requested = req.params.ratingNumber;
    if(rating_requested > 4 && rating_requested <= 5)
    {
        Rating.find({RATING_NUMBER: {$gt:'4'},  ACTIVE_FLAG:'Y'}, function(err,results) {
            if (err)
            {
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            }
            else if (!results.length)
            {
                // do stuff here
                res
                    .status(500)
                    .json({
                        status: "error",
                        error: "No products found for this rating",
                        data: {
                            message: "No products have been found for this rating"
                        }
                    });
            }
            else
            {
                Rating.find({RATING_NUMBER: {$gt:'4'},  ACTIVE_FLAG:'Y'} )
                .select("RATING_NUMBER RATING_TITLE UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                .populate('PRODUCT_ID')
                .populate('ECOMMERCE_PRODUCT_ID')
                .exec()
                .then(docs => {
                    res.status(200).json({
                        status: "success",
                        error: "",
                        data: {
                            rating: docs.map(doc => {
                                return {
                                    rating_id: doc._id,
                                    product_id: doc.PRODUCT_ID._id,
                                    product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                    product_description: doc.PRODUCT_ID.PRODUCT_DESCRIPTION,
                                    product_price: doc.PRODUCT_ID.PRODUCT_PRICE,
                                    product_specifications: JSON.parse(doc.PRODUCT_ID.PRODUCT_SPECIFICATIONS),
                                    ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                                    ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                                    ecommerce_product_url: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_WEB_URL,
                                    ecommerce_product_price: doc.ECOMMERCE_PRODUCT_PRICE,
                                    rating_number: doc.RATING_NUMBER,
                                    rating_title: doc.RATING_TITLE,
                                    updated_by: doc.UPDATED_BY,
                                    updated_date: doc.UPDATED_DATE,
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
            }
        } )
    }
    else if (rating_requested < 3 && rating_requested >=0)
    {
        Rating.find({RATING_NUMBER: {$lt:'3'},  ACTIVE_FLAG:'Y'}, function(err,results) {
            if (err)
            {
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            }
            else if (!results.length)
            {
                // do stuff here
                res
                    .status(500)
                    .json({
                        status: "error",
                        error: "No products found for this rating",
                        data: {
                            message: "No products have been found for this rating"
                        }
                    });
            }
            else
            {
                Rating.find({RATING_NUMBER: {$lt:'3'},  ACTIVE_FLAG:'Y'} )
                    .select("RATING_NUMBER RATING_TITLE UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_ID')
                    .populate('ECOMMERCE_PRODUCT_ID')
                    .exec()
                    .then(docs => {
                        res.status(200).json({
                            status: "success",
                            error: "",
                            data: {
                                rating: docs.map(doc => {
                                    return {
                                        rating_id: doc._id,
                                        product_id: doc.PRODUCT_ID._id,
                                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                        product_description: doc.PRODUCT_ID.PRODUCT_DESCRIPTION,
                                        product_price: doc.PRODUCT_ID.PRODUCT_PRICE,
                                        product_specifications: JSON.parse(doc.PRODUCT_ID.PRODUCT_SPECIFICATIONS),
                                        ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                                        ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                                        ecommerce_product_url: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_WEB_URL,
                                        ecommerce_product_price: doc.ECOMMERCE_PRODUCT_PRICE,
                                        rating_number: doc.RATING_NUMBER,
                                        rating_title: doc.RATING_TITLE,
                                        updated_by: doc.UPDATED_BY,
                                        updated_date: doc.UPDATED_DATE,
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
            }
        } )
    }
    else if(rating_requested >=3 && rating_requested <=4)
    {
        Rating.find({RATING_NUMBER: {$gt:'2.99', $lt: '4.01'},  ACTIVE_FLAG:'Y'}, function(err,results) {
            if (err)
            {
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            }
            else if (!results.length)
            {
                // do stuff here
                res
                    .status(500)
                    .json({
                        status: "error",
                        error: "No products found for this rating",
                        data: {
                            message: "No products have been found for this rating"
                        }
                    });
            }
            else
            {
                Rating.find({RATING_NUMBER: {$gt:'2.99', $lt: '4.01'},  ACTIVE_FLAG:'Y'} )
                    .select("RATING_NUMBER RATING_TITLE UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
                    .populate('PRODUCT_ID')
                    .populate('ECOMMERCE_PRODUCT_ID')
                    .exec()
                    .then(docs => {
                        res.status(200).json({
                            status: "success",
                            error: "",
                            data: {
                                rating: docs.map(doc => {
                                    return {
                                        rating_id: doc._id,
                                        product_id: doc.PRODUCT_ID._id,
                                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                        product_description: doc.PRODUCT_ID.PRODUCT_DESCRIPTION,
                                        product_price: doc.PRODUCT_ID.PRODUCT_PRICE,
                                        product_specifications: JSON.parse(doc.PRODUCT_ID.PRODUCT_SPECIFICATIONS),
                                        ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                                        ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                                        ecommerce_product_url: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_WEB_URL,
                                        ecommerce_product_price: doc.ECOMMERCE_PRODUCT_PRICE,
                                        rating_number: doc.RATING_NUMBER,
                                        rating_title: doc.RATING_TITLE,
                                        updated_by: doc.UPDATED_BY,
                                        updated_date: doc.UPDATED_DATE,
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
            }
        } )
    }

    else if(rating_requested > 5)
    {
        res
            .status(500)
            .json({
                status: "error",
                error: "Incorrect flag",
                data: {
                    message: "Incorrect flag value. Flag must be a number between 1 to 5"
                }
            });
    }

    else
    {
        res
            .status(500)
            .json({
                status: "error",
                error: "Incorrect flag",
                data: {
                    message: "Incorrect flag value. Flag must be a number between 1 to 5"
                }
            });
    }
};


