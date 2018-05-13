const mongoose = require("mongoose");
const Seller_subcategory = require("../models/seller_subcategory");

//get all seller subcategory details by flag
exports.seller_subcategory_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Seller_subcategory.find({ACTIVE_FLAG:'Y'})
            .select("SELLER_CATEGORY_ID SELLER_SUB_CATEGORY_NAME SELLER_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG quantity _id")
            .populate('SELLER_CATEGORY_ID','SELLER_CATEGORY_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        seller_subcategory: docs.map(doc => {
                            return {
                                seller_sub_category_id: doc._id,
                                seller_category_id: doc.SELLER_CATEGORY_ID,
                                seller_sub_category_name: doc.SELLER_SUB_CATEGORY_NAME,
                                seller_sub_category_description: doc.SELLER_SUB_CATEGORY_DESCRIPTION,
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
        Seller_subcategory.find({ACTIVE_FLAG:'N'})
            .select("SELLER_CATEGORY_ID SELLER_SUB_CATEGORY_NAME SELLER_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG quantity _id")
            .populate('SELLER_CATEGORY_ID','SELLER_CATEGORY_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        seller_subcategory: docs.map(doc => {
                            return {
                                seller_sub_category_id: doc._id,
                                seller_category_id: doc.SELLER_CATEGORY_ID,
                                seller_sub_category_name: doc.SELLER_SUB_CATEGORY_NAME,
                                seller_sub_category_description: doc.SELLER_SUB_CATEGORY_DESCRIPTION,
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