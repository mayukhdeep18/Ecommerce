const mongoose = require("mongoose");
const Product_images = require("../models/product_images");

//get all product image details by active flag
exports.images_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Product_images.find({ACTIVE_FLAG: 'Y'})
            .select('PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
            // .populate('PRODUCT_ID','PRODUCT_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        productimages: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_IMAGE_REF_1: doc.PRODUCT_IMAGE_REF_1,
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
        Product_images.find({ACTIVE_FLAG: 'N'})
            .select('PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
            // .populate('PRODUCT_ID','PRODUCT_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        productimages: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_IMAGE_REF_1: doc.PRODUCT_IMAGE_REF_1,
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
