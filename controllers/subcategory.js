const mongoose = require("mongoose");
const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

//get all active subcategory details
exports.subcategory_get_all = (req, res, next) => {
    Subcategory.find({ACTIVE_FLAG:'Y'})
        .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    subcategorys: docs.map(doc => {
                        return {
                            _id: doc._id,
                            PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                            PRODUCT_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_CATEGORY_NAME,
                            PRODUCT_SUB_CATEGORY_DESCRIPTION: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
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
                status: "error",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//get all subcategory details by flag
exports.subcategory_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
    Subcategory.find({ACTIVE_FLAG:'Y'})
        .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG quantity _id")
        .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    subcategorys: docs.map(doc => {
                        return {
                            _id: doc._id,
                            PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                            PRODUCT_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_CATEGORY_NAME,
                            PRODUCT_SUB_CATEGORY_DESCRIPTION: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
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
        Subcategory.find({ACTIVE_FLAG:'N'})
            .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG quantity _id")
            .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        subcategorys: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_CATEGORY_ID: doc.PRODUCT_CATEGORY_ID,
                                PRODUCT_SUB_CATEGORY_NAME: doc.PRODUCT_SUB_CATEGORY_NAME,
                                PRODUCT_SUB_CATEGORY_DESCRIPTION: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
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

//create a new subcategory
exports.subcategory_create = (req, res, next) => {
    Category.findById(req.body.PRODUCT_CATEGORY_ID)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    status: "error",
                    error: "Category not found",
                    data: {
                    message: "Category not found, please try entering subcategory details for an existing category"
                    }
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
                status: "success",
                error: "",
                data: {
                    message: "Subcategory stored",
                    createdSubcategory: {
                        _id: result._id,
                        PRODUCT_CATEGORY_ID: result.PRODUCT_CATEGORY_ID,
                        PRODUCT_SUB_CATEGORY_NAME: result.PRODUCT_SUB_CATEGORY_NAME,
                        PRODUCT_SUB_CATEGORY_DESCRIPTION: result.PRODUCT_SUB_CATEGORY_DESCRIPTION,
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

//get subcategory details by id
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
                    status: "success",
                    error: "",
                    data: {
                        subcategory: doc
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


//update subcategory details by id
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
                status: "success",
                error: "",
                data: {
                    message: 'subcategory updated'
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


//delete a sub category by id
exports.subcategory_delete = (req, res, next) => {
    const id = req.params.subcategoryId;
    Subcategory.remove({ _id: id })
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
