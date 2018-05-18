const mongoose = require("mongoose");
const EcommCategory = require("../models/ecommerce_category");
const EcommProduct = require("../models/ecommerce_product_details");

//get all active ecommerce product details
exports.ecommproduct_get_all = (req, res, next) => {
    EcommProduct.find({ACTIVE_FLAG:'Y'})
        .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('ECOMMERCE_CATEGORY_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    ecommproduct: docs.map(doc => {
                        return {
                            ecommerce_product_details_id: doc._id,
                            ecommerce_category_id: doc.ECOMMERCE_CATEGORY_ID._id,
                            ecommerce_category_details: doc.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                            ecommerce_product_name: doc.ECOMMERCE_PRODUCT_NAME,
                            ecommerce_product_price: doc.ECOMMERCE_PRODUCT_PRICE,
                            ecommerce_prodct_shpmnt_duratn: doc.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                            product_url: doc.PRODUCT_URL,
                            ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID,
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
                status: "error",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//create a new ecommerce product detail
exports.ecommproduct_create = (req, res, next) => {

    if(EcommCategory.findById(req.body.ECOMMERCE_CATEGORY_ID))
    {
        const ecommproduct = new EcommProduct({
            _id: new mongoose.Types.ObjectId(),
            ECOMMERCE_CATEGORY_ID: req.body.ECOMMERCE_CATEGORY_ID,
            ECOMMERCE_PRODUCT_NAME: req.body.ECOMMERCE_PRODUCT_NAME,
            ECOMMERCE_PRODUCT_PRICE: req.body.ECOMMERCE_PRODUCT_PRICE,
            ECOMMERCE_PRODCT_SHPMNT_DURATN: req.body.ECOMMERCE_PRODCT_SHPMNT_DURATN,
            PRODUCT_URL: req.body.PRODUCT_URL,
            ECOMMERCE_PRODUCT_ID: req.body.ECOMMERCE_PRODUCT_ID,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
       ecommproduct
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "Product details stored",
                        ecommerce_product_details: {
                            _id: result._id,
                            ECOMMERCE_CATEGORY_ID: result.ECOMMERCE_CATEGORY_ID,
                            ECOMMERCE_PRODUCT_NAME: result.ECOMMERCE_PRODUCT_NAME,
                            ECOMMERCE_PRODUCT_PRICE: result.ECOMMERCE_PRODUCT_PRICE,
                            ECOMMERCE_PRODCT_SHPMNT_DURATN: result.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                            PRODUCT_URL: result.PRODUCT_URL,
                            ECOMMERCE_PRODUCT_ID: result.ECOMMERCE_PRODUCT_ID,
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
                    message: "Ecommerce Category id does not exist"
                }
            });
    }
};


//get ecommerce product details by id
exports.ecommproduct_details_get_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    EcommProduct.findById(id)
        .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('ECOMMERCE_NAME _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        message: doc
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        message: "No valid entry found for provided subcategory ID"
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


//update ecommerce product details by id
exports.ecommproduct_update_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    EcommProduct.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'sub subcategory updated'
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

//delete ecommerce product details by id
exports.ecommproduct_delete_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    EcommProduct.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'subcategory deleted'
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