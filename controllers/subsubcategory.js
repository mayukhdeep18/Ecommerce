const mongoose = require("mongoose");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const SubSubCategory = require("../models/subsubcategory");

//get all active sub subcategory details
exports.subsubcategory_get_all = (req, res, next) => {
    SubSubCategory.find({ACTIVE_FLAG:'Y'})
        .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_NAME PRODCT_SUB_SUB_CATGRY_DESCRPTN UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
        .populate('PRODUCT_SUB_CATEGORY_ID', 'PRODUCT_SUB_CATEGORY_NAME')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    subsubcategorys: docs.map(doc => {
                        return {
                            product_sub_sub_category_id: doc._id,
                            product_category_details: doc.PRODUCT_CATEGORY_ID,
                            product_sub_category_details: doc.PRODUCT_SUB_CATEGORY_ID,
                            product_sub_sub_category_name: doc.PRODUCT_SUB_SUB_CATEGORY_NAME,
                            product_sub_sub_category_description: doc.PRODCT_SUB_SUB_CATGRY_DESCRPTN,
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


//create a new sub subcategory
exports.subsubcategory_create = (req, res, next) => {

    if(Category.findById(req.body.PRODUCT_CATEGORY_ID) && Subcategory.findById(req.body.PRODUCT_SUB_CATEGORY_ID))
            {
                const subsubcategory = new SubSubCategory({
                    _id: new mongoose.Types.ObjectId(),
                    PRODUCT_CATEGORY_ID: req.body.PRODUCT_CATEGORY_ID,
                    PRODUCT_SUB_CATEGORY_ID: req.body.PRODUCT_SUB_CATEGORY_ID,
                    PRODUCT_SUB_SUB_CATEGORY_NAME: req.body.PRODUCT_SUB_SUB_CATEGORY_NAME,
                    PRODCT_SUB_SUB_CATGRY_DESCRPTN: req.body.PRODCT_SUB_SUB_CATGRY_DESCRPTN,
                    UPDATED_BY: req.body.UPDATED_BY,
                    UPDATED_DATE: new Date(),
                    ACTIVE_FLAG: req.body.ACTIVE_FLAG
                });
                subsubcategory
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            status: "success",
                            error: "",
                            data: {
                                message: "Sub Subcategory stored",
                                createdSubSubcategory: {
                                    _id: result._id,
                                    PRODUCT_CATEGORY_ID: result.PRODUCT_CATEGORY_ID,
                                    PRODUCT_SUB_CATEGORY_ID: result.PRODUCT_SUB_CATEGORY_ID,
                                    PRODUCT_SUB_SUB_CATEGORY_NAME: result.PRODUCT_SUB_SUB_CATEGORY_NAME,
                                    PRODCT_SUB_SUB_CATGRY_DESCRPTN: result.PRODCT_SUB_SUB_CATGRY_DESCRPTN,
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
                            message: "Category id or subcategory id does not exist"
                        }
                    });
            }
        };


//get sub subcategory details by id
exports.subsubcategory_get_subsubcategory = (req, res, next) => {
    const id = req.params.subsubcategoryId;
    SubSubCategory.findById(id)
        .select("PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_NAME PRODCT_SUB_SUB_CATGRY_DESCRPTN UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID','PRODUCT_CATEGORY_NAME')
        .populate('PRODUCT_SUB_CATEGORY_ID', 'PRODUCT_SUB_CATEGORY_NAME')
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


//update sub subcategory details by id
exports.subsubcategory_update = (req, res, next) => {
    const id = req.params.subsubcategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    SubSubCategory.update({ _id: id }, { $set: updateOps })
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


//delete a sub subcategory by id
exports.subsubcategory_delete = (req, res, next) => {
    const id = req.params.subsubcategoryId;
    SubSubCategory.remove({ _id: id })
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