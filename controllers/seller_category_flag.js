const mongoose = require("mongoose");
const Seller_Category = require("../models/seller_category");

//get all categories by flag
exports.seller_category_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Seller_Category.find({ACTIVE_FLAG: 'Y'})
            .select('SELLER_CATEGORY_NAME SELLER_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    seller_categories: docs.map(doc => {
                        return {
                            seller_category_name: doc.SELLER_CATEGORY_NAME,
                            seller_category_description: doc.SELLER_CATEGORY_DESCRIPTION,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG,
                            seller_category_id: doc._id
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
        Seller_Category.find({ACTIVE_FLAG: 'N'})
            .select('SELLER_CATEGORY_NAME SELLER_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                const response = {
                    //count: docs.length,
                    seller_categories: docs.map(doc => {
                        return {
                            seller_category_name: doc.SELLER_CATEGORY_NAME,
                            seller_category_description: doc.SELLER_CATEGORY_DESCRIPTION,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG,
                            seller_category_id: doc._id
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