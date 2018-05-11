const mongoose = require("mongoose");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const SubSubCategory = require("../models/subsubcategory");

//get all sub subcategory details by flag
exports.subsubcategory_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        SubSubCategory.find({ACTIVE_FLAG:'Y'})
            .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_NAME PRODCT_SUB_SUB_CATGRY_DESCRPTN UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
            .populate('PRODUCT_SUB_CATEGORY_ID', 'PRODUCT_SUB_CATEGORY_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        subsubcategorys: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                                PRODUCT_SUB_CATEGORY_ID: doc.PRODUCT_SUB_CATEGORY_ID,
                                PRODUCT_SUB_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_SUB_CATEGORY_NAME,
                                PRODCT_SUB_SUB_CATGRY_DESCRPTN: doc.PRODCT_SUB_SUB_CATGRY_DESCRPTN,
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
        SubSubCategory.find({ACTIVE_FLAG:'N'})
            .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_NAME PRODCT_SUB_SUB_CATGRY_DESCRPTN UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
            .populate('PRODUCT_SUB_CATEGORY_ID', 'PRODUCT_SUB_CATEGORY_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        subsubcategorys: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                                PRODUCT_SUB_CATEGORY_ID: doc.PRODUCT_SUB_CATEGORY_ID,
                                PRODUCT_SUB_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_SUB_CATEGORY_NAME,
                                PRODCT_SUB_SUB_CATGRY_DESCRPTN: doc.PRODCT_SUB_SUB_CATGRY_DESCRPTN,
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