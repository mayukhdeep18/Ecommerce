const mongoose = require("mongoose");
const Product = require("../models/product_details");
const Customer = require("../models/customer");
const Ecommerce_product = require("../models/ecommerce_product_details");
const Offer = require("../models/offer_details");

//get all offer details
exports.offer_get_all = (req, res, next) => {
    Offer.find({ACTIVE_FLAG:'Y'})
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
                status: "error",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};




//create a new offer
exports.offer_create = (req, res, next) => {
    if(Product.findById(req.body.PRODUCT_ID) && Ecommerce_product.findById(req.body.ECOMMERCE_PRODUCT_ID))
    {
        const offer = new Offer({
            _id: new mongoose.Types.ObjectId(),
            PRODUCT_ID: req.body.PRODUCT_ID,
            ECOMMERCE_PRODUCT_ID: req.body.ECOMMERCE_PRODUCT_ID,
            SPECIAL_OFFER_TITLE: req.body.SPECIAL_OFFER_TITLE,
            SPECIAL_OFFER_DESCRIPTION: req.body.SPECIAL_OFFER_DESCRIPTION,
            SPECIAL_OFFER_IMAGE_LINK: req.file.path,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        offer
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "offer stored",
                        created_offer: {
                            _id: result._id,
                            PRODUCT_ID: result.PRODUCT_ID,
                            ECOMMERCE_PRODUCT_ID: result.ECOMMERCE_PRODUCT_ID,
                            SPECIAL_OFFER_TITLE: result.SPECIAL_OFFER_TITLE,
                            SPECIAL_OFFER_DESCRIPTION: result.SPECIAL_OFFER_DESCRIPTION,
                            SPECIAL_OFFER_IMAGE_LINK: result.SPECIAL_OFFER_IMAGE_LINK,
                            UPDATED_BY: result.UPDATED_BY,
                            UPDATED_DATE: result.UPDATED_DATE,
                            ACTIVE_FLAG: result.ACTIVE_FLAG
                        }
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
    else {
        res
            .status(404)
            .json({
                status: "error",
                error: "ID doesn't exist",
                data: {
                    message: "product id or ecommerce product id does not exist"
                }
            });
    }
};

//get offer details by id
exports.offer_get_by_id = (req, res, next) => {
    const id = req.params.offerId;
    Offer.findById(id)
        .select("SPECIAL_OFFER_TITLE SPECIAL_OFFER_DESCRIPTION SPECIAL_OFFER_IMAGE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('ECOMMERCE_PRODUCT_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
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
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        message: "No valid entry found for provided offer ID"
                    });
            }
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
};


//update offer details by id
exports.offer_update = (req, res, next) => {
    const id = req.params.offerId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Offer.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'offer updated'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "success",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//delete a offer by id
exports.offer_delete = (req, res, next) => {
    const id = req.params.offerId;
    Offer.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'offer deleted'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:
                    {
                        message: "An error has occurred as mentioned above"
                    }
            });
        });
};