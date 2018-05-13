const mongoose = require("mongoose");
const Ecommerce_category_flag = require("../models/ecommerce_category");

//get all ecommerce category details by active flag
exports.ecommerce_category_get_by_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Ecommerce_category_flag.find({ACTIVE_FLAG: 'Y'})
            .select('ECOMMERCE_NAME ECOMMERCE_DESCRIPTION ECOMMERCE_LOGO ECOMMERCE_WEB_URL ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        ecommerce_category: docs.map(doc => {
                            return {
                                ecommerce_id: doc._id,
                                ecommerce_name: doc.ECOMMERCE_NAME,
                                ecommerce_description: doc.ECOMMERCE_DESCRIPTION,
                                ecommerce_logo: doc.ECOMMERCE_LOGO,
                                ecommerce_web_url: doc.ECOMMERCE_WEB_URL,
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
        Ecommerce_category_flag.find({ACTIVE_FLAG: 'N'})
            .select('ECOMMERCE_NAME ECOMMERCE_DESCRIPTION ECOMMERCE_LOGO ECOMMERCE_WEB_URL ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        ecommerce_category: docs.map(doc => {
                            return {
                                ecommerce_id: doc._id,
                                ecommerce_name: doc.ECOMMERCE_NAME,
                                ecommerce_description: doc.ECOMMERCE_DESCRIPTION,
                                ecommerce_logo: doc.ECOMMERCE_LOGO,
                                ecommerce_web_url: doc.ECOMMERCE_WEB_URL,
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
