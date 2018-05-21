const mongoose = require("mongoose");
const Collections = require("../models/collections");

//get all collections details by flag
exports.collections_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Collections.find({ACTIVE_FLAG:'Y'})
            .select("COLLECTIONS_NAME COLLECTIONS_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        collections: docs.map(doc => {
                            return {
                                _id: doc._id,
                                product_id: doc.PRODUCT_ID._id,
                                product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                collections_name: doc.COLLECTIONS_NAME,
                                collections_description: doc.COLLECTIONS_DESCRIPTION,
                                updated_by: doc.UPDATED_BY,
                                updated_date: doc.UPDATED_DATE,
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
        Collections.find({ACTIVE_FLAG:'N'})
            .select("COLLECTIONS_NAME COLLECTIONS_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        collections: docs.map(doc => {
                            return {
                                _id: doc._id,
                                product_id: doc.PRODUCT_ID._id,
                                product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                collections_name: doc.COLLECTIONS_NAME,
                                collections_description: doc.COLLECTIONS_DESCRIPTION,
                                updated_by: doc.UPDATED_BY,
                                updated_date: doc.UPDATED_DATE,
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