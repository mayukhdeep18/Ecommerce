const mongoose = require("mongoose");
const Filter_Opt_prod = require("../models/filter_options_products");

//get all filter options product by flag
exports.filter_opt_prod_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Filter_Opt_prod.find({ACTIVE_FLAG: 'Y'})
            .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('FILTER_OPTION_ID')
            .populate('PRODUCT_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    filter_opt_prod: docs.map(doc => {
                        return {
                            filter_opt_prod_conn_id: doc._id,
                            filter_option_id: doc.FILTER_OPTION_ID._id,
                            filter_option_name: doc.FILTER_OPTION_ID.DISPLAY_TEXT,
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
        Filter_Opt_prod.find({ACTIVE_FLAG: 'N'})
            .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('FILTER_OPTION_ID')
            .populate('PRODUCT_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    filter_categories: docs.map(doc => {
                        return {
                            filter_opt_prod_conn_id: doc._id,
                            filter_id: doc.FILTER_OPTION_ID._id,
                            filter_option_name: doc.FILTER_OPTION_ID.DISPLAY_TEXT,
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