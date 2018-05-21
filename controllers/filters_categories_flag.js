const mongoose = require("mongoose");
const Filter_Category = require("../models/filters_categories");

//get all filter categories by flag
exports.filter_category_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Filter_Category.find({ACTIVE_FLAG: 'Y'})
            .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('FILTER_ID')
            .populate('CATEGORY_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    filer_categories: docs.map(doc => {
                        return {
                            filter_category_conn_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            category_id: doc.CATEGORY_ID._id,
                            category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
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
        Filter_Category.find({ACTIVE_FLAG: 'N'})
            .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('FILTER_ID')
            .populate('CATEGORY_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    filter_categories: docs.map(doc => {
                        return {
                            filter_category_conn_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            category_id: doc.CATEGORY_ID._id,
                            category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
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