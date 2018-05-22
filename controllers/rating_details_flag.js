const mongoose = require("mongoose");
const Rating = require("../models/rating_details");

//get all Rating details by active flag
exports.rating_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Rating.find({ACTIVE_FLAG: 'Y'})
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
                    status: "success",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            });
    }
    else if (actFlag === 'N')
    {
        Rating.find({ACTIVE_FLAG: 'N'})
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
                        customer: docs.map(doc => {
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
                    status: "success",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
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
                    message: "Incorrect flag value. Flag must be either Y or N"
                }
            });
    }
};
