const mongoose = require("mongoose");
const Category = require("../models/category");

//get all categories by flag
exports.category_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Category.find({ACTIVE_FLAG: 'Y'})
            .select('PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            PRODUCT_CATEGORY_NAME: doc.PRODUCT_CATEGORY_NAME,
                            PRODUCT_CATEGORY_DESCRIPTION: doc.PRODUCT_CATEGORY_DESCRIPTION,
                            UPDATED_BY: doc.UPDATED_BY,
                            UPDATED_DATE: doc.UPDATED_DATE,
                            ACTIVE_FLAG: doc.ACTIVE_FLAG,
                            _id: doc._id
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
        Category.find({ACTIVE_FLAG: 'N'})
            .select('PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            PRODUCT_CATEGORY_NAME: doc.PRODUCT_CATEGORY_NAME,
                            PRODUCT_CATEGORY_DESCRIPTION: doc.PRODUCT_CATEGORY_DESCRIPTION,
                            UPDATED_BY: doc.UPDATED_BY,
                            UPDATED_DATE: doc.UPDATED_DATE,
                            ACTIVE_FLAG: doc.ACTIVE_FLAG,
                            _id: doc._id
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
