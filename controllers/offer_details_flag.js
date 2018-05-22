const mongoose = require("mongoose");
const Offer = require("../models/offer_details");

//get all Offer details by active flag
exports.offer_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Offer.find({ACTIVE_FLAG: 'Y'})
            .select("SPECIAL_OFFER_TITLE SPECIAL_OFFER_DESCRIPTION SPECIAL_OFFER_IMAGE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_ID')
            .populate('ECOMMERCE_PRODUCT_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        rating: docs.map(doc => {
                            return {
                                offer_id: doc._id,
                                product_id: doc.PRODUCT_ID._id,
                                product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                                ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                                special_offer_title:doc.SPECIAL_OFFER_TITLE,
                                special_offer_description:doc.SPECIAL_OFFER_DESCRIPTION,
                                special_offer_image_link:doc.SPECIAL_OFFER_IMAGE_LINK,
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
        Offer.find({ACTIVE_FLAG: 'N'})
            .select("SPECIAL_OFFER_TITLE SPECIAL_OFFER_DESCRIPTION SPECIAL_OFFER_IMAGE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_ID')
            .populate('ECOMMERCE_PRODUCT_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        offer: docs.map(doc => {
                            return {
                                offer_id: doc._id,
                                product_id: doc.PRODUCT_ID._id,
                                product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID._id,
                                ecommerce_product_name: doc.ECOMMERCE_PRODUCT_ID.ECOMMERCE_PRODUCT_NAME,
                                special_offer_title:doc.SPECIAL_OFFER_TITLE,
                                special_offer_description:doc.SPECIAL_OFFER_DESCRIPTION,
                                special_offer_image_link:doc.SPECIAL_OFFER_IMAGE_LINK,
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
