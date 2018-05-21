const mongoose = require("mongoose");
const Product = require("../models/product_details");
const Collections = require("../models/collections");

//get all active collections details
exports.collections_get_all = (req, res, next) => {
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
};




//create a new collections
exports.collections_create = (req, res, next) => {
    Product.findById(req.body.PRODUCT_ID)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    status: "error",
                    error: "Product not found",
                    data: {
                        message: "Product not found, please try entering collections details for an existing product"
                    }
                });
            }
            const collections = new Collections({
                _id: new mongoose.Types.ObjectId(),
                PRODUCT_ID: req.body.PRODUCT_ID,
                COLLECTIONS_NAME: req.body.COLLECTIONS_NAME,
                COLLECTIONS_DESCRIPTION: req.body.COLLECTIONS_DESCRIPTION,
                UPDATED_BY: req.body.UPDATED_BY,
                UPDATED_DATE: new Date(),
                ACTIVE_FLAG: req.body.ACTIVE_FLAG
            });
            return collections.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                status: "success",
                error: "",
                data: {
                    message: "Collections stored",
                    createdCollections: {
                        _id: result._id,
                        PRODUCT_ID: result.PRODUCT_ID,
                        COLLECTIONS_NAME: result.COLLECTIONS_NAME,
                        COLLECTIONS_DESCRIPTION: result.COLLECTIONS_DESCRIPTION,
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
};

//get collections details by id
exports.collections_get_collections = (req, res, next) => {
    const id = req.params.collectionsId;
    Collections.findById(id)
        .select('COLLECTIONS_NAME COLLECTIONS_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .populate('PRODUCT_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        _id: doc._id,
                        product_id: doc.PRODUCT_ID._id,
                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                        collections_name: doc.COLLECTIONS_NAME,
                        collections_description: doc.COLLECTIONS_DESCRIPTION,
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
                        message: "No valid entry found for provided collections ID"
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


//update collections details by id
exports.collections_update = (req, res, next) => {
    const id = req.params.collectionsId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Collections.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'collections updated'
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


//delete a collection by id
exports.collections_delete = (req, res, next) => {
    const id = req.params.collectionsId;
    Collections.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'collections deleted'
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