const mongoose = require("mongoose");
const Wishlist = require("../models/wishlist");

//get all filter options product by flag
exports.wishlist_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Wishlist.find({ACTIVE_FLAG: 'Y'})
            .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('CUSTOMER_ID')
            .populate('PRODUCT_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    Wishlist: docs.map(doc => {
                        return {
                            wishlist_id: doc._id,
                            filter_id: doc.CUSTOMER_ID._id,
                            customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                            product_id: doc.PRODUCT_ID._id,
                            product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
                };
                // if (docs.length >= 0) {
                res.status(200).json({
                    status: "success",
                    error_msg: "",
                    data: {
                        message: 'Below are the category details with active flag ' + actFlag,
                        response
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
    else if (actFlag === 'N'){
        Wishlist.find({ACTIVE_FLAG: 'N'})
            .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('CUSTOMER_ID')
            .populate('PRODUCT_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    Wishlist: docs.map(doc => {
                        return {
                            wishlist_id: doc._id,
                            filter_id: doc.CUSTOMER_ID._id,
                            customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                            product_id: doc.PRODUCT_ID._id,
                            product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
                };
                // if (docs.length >= 0) {
                res.status(200).json({
                    status: "success",
                    error_msg: "",
                    data: {
                        message: 'Below are the wishlist details with active flag ' + actFlag,
                        response
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