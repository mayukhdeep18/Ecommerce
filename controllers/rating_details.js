const mongoose = require("mongoose");
const Product = require("../models/product_details");
const Customer = require("../models/customer");
const Ecommerce_product = require("../models/ecommerce_product_details");
const Rating = require("../models/rating_details");

//get all rating details
exports.rating_get_all = (req, res, next) => {
    Rating.find({ACTIVE_FLAG:'Y'})
        .select("RATING_NUMBER RATING_TITLE UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('CUSTOMER_ID')
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
                            ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                            ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                            customer_id: doc.CUSTOMER_ID._id,
                            customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
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
};




//create a new rating
exports.rating_create = (req, res, next) => {
    if(Product.findById(req.body.PRODUCT_ID) && Customer.findById(req.body.CUSTOMER_ID) && Ecommerce_product.findById(req.body.ECOMMERCE_PRODUCT_ID))
    {
        const rating = new Rating({
            _id: new mongoose.Types.ObjectId(),
            PRODUCT_ID: req.body.PRODUCT_ID,
            CUSTOMER_ID: req.body.CUSTOMER_ID,
            ECOMMERCE_PRODUCT_ID: req.body.ECOMMERCE_PRODUCT_ID,
            RATING_NUMBER: req.body.RATING_NUMBER,
            RATING_TITLE: req.body.RATING_TITLE,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        rating
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "rating stored",
                        created_rating: {
                            _id: result._id,
                            PRODUCT_ID: result.PRODUCT_ID,
                            CUSTOMER_ID: result.CUSTOMER_ID,
                            ECOMMERCE_PRODUCT_ID: result.ECOMMERCE_PRODUCT_ID,
                            RATING_NUMBER: result.RATING_NUMBER,
                            RATING_TITLE: result.RATING_TITLE,
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
                    message: "Category id or subcategory id does not exist"
                }
            });
    }
};

//get rating details by id
exports.rating_get_by_id = (req, res, next) => {
    const id = req.params.ratingId;
    Rating.findById(id)
        .select("RATING_NUMBER RATING_TITLE UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('CUSTOMER_ID')
        .populate('ECOMMERCE_PRODUCT_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        rating_id: doc._id,
                        product_id: doc.PRODUCT_ID._id,
                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                        ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                        ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                        customer_id: doc.CUSTOMER_ID._id,
                        customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                        rating_number: doc.RATING_NUMBER,
                        rating_title: doc.RATING_TITLE,
                        updated_by: doc.UPDATED_BY,
                        updated_date: doc.UPDATED_DATE,
                        isActive: doc.ACTIVE_FLAG
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        message: "No valid entry found for provided customer ID"
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
};


//update rating details by id
exports.rating_update = (req, res, next) => {
    const id = req.params.ratingId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Rating.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'rating updated'
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
            });
        });
};


//delete a rating by id
exports.rating_delete = (req, res, next) => {
    const id = req.params.ratingId;
    Rating.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'rating deleted'
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