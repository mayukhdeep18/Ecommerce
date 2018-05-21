const mongoose = require("mongoose");
const Filter_Options = require("../models/filter_options");

//get all filter options by flag
exports.filter_options_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Filter_Options.find({ACTIVE_FLAG: 'Y'})
            .select("URL_SLUG DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('FILTER_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    filer_categories: docs.map(doc => {
                        return {
                            filter_option_conn_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            url_slug: doc.URL_SLUG,
                            display_text: doc.DISPLAY_TEXT,
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
                        message: 'Below are the option details with active flag ' + actFlag,
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
        Filter_Options.find({ACTIVE_FLAG: 'N'})
            .select("URL_SLUG DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('FILTER_ID')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    filter_categories: docs.map(doc => {
                        return {
                            filter_option_conn_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            url_slug: doc.URL_SLUG,
                            display_text: doc.DISPLAY_TEXT,
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
                        message: 'Below are the option details with active flag ' + actFlag,
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