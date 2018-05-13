const mongoose = require("mongoose");
const Subcategory = require("../models/subcategory");

//get all subcategory details by flag
exports.subcategory_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Subcategory.find({ACTIVE_FLAG:'Y'})
            .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG quantity _id")
            .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        subcategorys: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                                PRODUCT_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_CATEGORY_NAME,
                                PRODUCT_SUB_CATEGORY_DESCRIPTION: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                                UPDATED_BY: doc.UPDATED_BY,
                                UPDATED_DATE: doc.UPDATED_DATE,
                                ACTIVE_FLAG: doc.ACTIVE_FLAG
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
    else if (actFlag === 'N')
    {
        Subcategory.find({ACTIVE_FLAG:'N'})
            .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG quantity _id")
            .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        subcategorys: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                                PRODUCT_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_CATEGORY_NAME,
                                PRODUCT_SUB_CATEGORY_DESCRIPTION: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                                UPDATED_BY: doc.UPDATED_BY,
                                UPDATED_DATE: doc.UPDATED_DATE,
                                ACTIVE_FLAG: doc.ACTIVE_FLAG
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