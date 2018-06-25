const mongoose = require("mongoose");
const Product = require("../models/product_details");
const Customer = require("../models/customer");
const Ecommerce_product = require("../models/ecommerce_product_details");
const Review = require("../models/review_details");

//get all review details
exports.review_get_all = (req, res, next) => {
    Review.find({ACTIVE_FLAG:'Y'})
        .select("REVIEW_TITLE REVIEW_DESCRIPTION REVIEWER_NAME UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('CUSTOMER_ID')
        .populate('ECOMMERCE_PRODUCT_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    review: docs.map(doc => {
                        return {
                            review_id: doc._id,
                            product_id: doc.PRODUCT_ID._id,
                            product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                            ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                            ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                            customer_id: doc.CUSTOMER_ID._id,
                            customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                            review_title: doc.REVIEW_TITLE,
                            review_description: doc.REVIEW_DESCRIPTION,
                            reviewer_name: doc.REVIEWER_NAME,
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

//create a new review
exports.review_create = (req, res, next) => {
    if(Product.findById(req.body.PRODUCT_ID) && Customer.findById(req.body.CUSTOMER_ID) && Ecommerce_product.findById(req.body.ECOMMERCE_PRODUCT_ID))
    {
        const review = new Review({
            _id: new mongoose.Types.ObjectId(),
            PRODUCT_ID: req.body.PRODUCT_ID,
            CUSTOMER_ID: req.body.CUSTOMER_ID,
            ECOMMERCE_PRODUCT_ID: req.body.ECOMMERCE_PRODUCT_ID,
            REVIEW_TITLE: req.body.REVIEW_TITLE,
            REVIEW_DESCRIPTION: req.body.REVIEW_DESCRIPTION,
            REVIEWER_NAME: req.body.REVIEWER_NAME,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        review
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "review stored",
                        created_review: {
                            _id: result._id,
                            PRODUCT_ID: result.PRODUCT_ID,
                            CUSTOMER_ID: result.CUSTOMER_ID,
                            ECOMMERCE_PRODUCT_ID: result.ECOMMERCE_PRODUCT_ID,
                            REVIEW_TITLE: result.REVIEW_TITLE,
                            REVIEW_DESCRIPTION: result.REVIEW_DESCRIPTION,
                            REVIEWER_NAME: result.REVIEWER_NAME,
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
                    message: "PRODUCT id or CUSTOMER id or ECOMMERCE PRODUCT id does not exist"
                }
            });
    }
};

//get review details by id
exports.review_get_by_id = (req, res, next) => {
    const id = req.params.reviewId;
    Review.findById(id)
        .select("REVIEW_TITLE REVIEW_DESCRIPTION REVIEWER_NAME UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
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
                        review_id: doc._id,
                        product_id: doc.PRODUCT_ID._id,
                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                        ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                        ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                        customer_id: doc.CUSTOMER_ID._id,
                        customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                        review_title: doc.REVIEW_TITLE,
                        review_description: doc.REVIEW_DESCRIPTION,
                        reviewer_name: doc.REVIEWER_NAME,
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
                        message: "No valid entry found for provided review ID"
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

//update review details by id
exports.review_update = (req, res, next) => {
    const id = req.params.reviewId;
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
    console.log("id",id);
    //console.log("updateOps",updateOps);

    Review.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'review updated'
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


//delete a review by id
exports.review_delete = (req, res, next) => {
    const id = req.params.reviewId;
    Review.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'review deleted'
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