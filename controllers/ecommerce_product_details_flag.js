const mongoose = require("mongoose");
const Ecommprod_flag = require("../models/ecommerce_product_details");

//get all ecommerce product details by active flag
exports.ecommerce_product_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Ecommprod_flag.find({ACTIVE_FLAG: 'Y'})
            .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('ECOMMERCE_NAME _id')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        ecommerce_category: docs.map(doc => {
                            return {
                                ecommerce_product_details_id: doc._id,
                                ecommerce_category_details: doc.ECOMMERCE_NAME,
                                ecommerce_product_name: doc.ECOMMERCE_PRODUCT_NAME,
                                ecommerce_product_price: doc.ECOMMERCE_PRODUCT_PRICE,
                                ecommerce_prodct_shpmnt_duratn: doc.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                                product_url: doc.PRODUCT_URL,
                                ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID,
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
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
        Ecommprod_flag.find({ACTIVE_FLAG: 'N'})
            .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('ECOMMERCE_NAME _id')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        ecommerce_category: docs.map(doc => {
                            return {
                                ecommerce_product_details_id: doc._id,
                                ecommerce_category_details: doc.ECOMMERCE_NAME,
                                ecommerce_product_name: doc.ECOMMERCE_PRODUCT_NAME,
                                ecommerce_product_price: doc.ECOMMERCE_PRODUCT_PRICE,
                                ecommerce_prodct_shpmnt_duratn: doc.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                                product_url: doc.PRODUCT_URL,
                                ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID,
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
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