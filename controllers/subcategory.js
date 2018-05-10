const mongoose = require("mongoose");
const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

// Handle incoming GET requests to /subcategory
exports.subcategory_get_all = (req, res, next) => {
    Subcategory.find()
        .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG quantity _id")
        .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                subcategorys: docs.map(doc => {
                    return {
                        _id: doc._id,
                        PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                        PRODUCT_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_CATEGORY_NAME,
                        PRODUCT_SUB_CATEGORY_DESCRIPTION: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                        UPDATED_BY: doc.UPDATED_BY,
                        UPDATED_DATE: doc.UPDATED_DATE,
                        ACTIVE_FLAG: doc.ACTIVE_FLAG,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/subcategory/" + doc._id
                        }
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.subcategory_create = (req, res, next) => {
    Category.findById(req.body.PRODUCT_CATEGORY_ID)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            const subcategory = new Subcategory({
                _id: new mongoose.Types.ObjectId(),
                PRODUCT_CATEGORY_ID: req.body.PRODUCT_CATEGORY_ID,
                PRODUCT_SUB_CATEGORY_NAME: req.body.PRODUCT_SUB_CATEGORY_NAME,
                PRODUCT_SUB_CATEGORY_DESCRIPTION: req.body.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                UPDATED_BY: req.body.UPDATED_BY,
                UPDATED_DATE: new Date(),
                ACTIVE_FLAG: req.body.ACTIVE_FLAG
            });
            return subcategory.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Subcategory stored",
                createdSubcategory: {
                    _id: result._id,
                    PRODUCT_CATEGORY_ID: result.PRODUCT_CATEGORY_ID,
                    PRODUCT_SUB_CATEGORY_NAME: result.PRODUCT_SUB_CATEGORY_NAME,
                    PRODUCT_SUB_CATEGORY_DESCRIPTION: result.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                    UPDATED_BY: result.UPDATED_BY,
                    UPDATED_DATE: result.UPDATED_DATE,
                    ACTIVE_FLAG: result.ACTIVE_FLAG
                },
                request: {
                    type: "GET",
                    url: "http://localhost:3000/subcategory/" + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.subcategory_get_subcategory = (req, res, next) => {
    const id = req.params.subcategoryId;
    Subcategory.findById(id)
        .select('PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    subcategory: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/subcategory'
                    }
                });
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};

exports.subcategory_update = (req, res, next) => {
    const id = req.params.subcategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Subcategory.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'subcategory updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/subcategory/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.subcategory_delete = (req, res, next) => {
    const id = req.params.subcategoryId;
    Subcategory.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'subcategory deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/subcategory',
                    body: {
                        PRODUCT_CATEGORY_ID: 'String',
                        PRODUCT_SUB_CATEGORY_NAME: 'String',
                        PRODUCT_SUB_CATEGORY_DESCRIPTION: 'String',
                        UPDATED_BY: 'String',
                        UPDATED_DATE: 'Date',
                        ACTIVE_FLAG: 'String'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};
