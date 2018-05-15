const mongoose = require("mongoose");
const changeCase = require('change-case');
const Category = require("../models/category");

//get all active categories
exports.category_get_all = (req, res, next) => {
    Category.find({ACTIVE_FLAG:'Y'})
        .select('PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            const response = {
                //count: docs.length,
                categories: docs.map(doc => {
                    return {
                        PRODUCT_CATEGORY_NAME: doc.PRODUCT_CATEGORY_NAME,
                        PRODUCT_CATEGORY_DESCRIPTION: doc.PRODUCT_CATEGORY_DESCRIPTION,
                        UPDATED_BY: doc.UPDATED_BY,
                        UPDATED_DATE: doc.UPDATED_DATE,
                        ACTIVE_FLAG: doc.ACTIVE_FLAG,
                        _id: doc._id
                    };
                })
            };
            // if (docs.length >= 0) {
            res.status(200).json({
                status:"success",
                error_msg:"",
                data: {
                    message: 'Below are the category details',
                    response
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:{
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//create a new category
exports.category_create_category = (req, res, next) =>{
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        PRODUCT_CATEGORY_NAME: req.body.PRODUCT_CATEGORY_NAME,
        PRODUCT_CATEGORY_DESCRIPTION: req.body.PRODUCT_CATEGORY_DESCRIPTION,
        UPDATED_BY: req.body.UPDATED_BY,
        UPDATED_DATE: new Date(),
        ACTIVE_FLAG: req.body.ACTIVE_FLAG
    });
    category
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                status:"success",
                error_msg:"",
                data: {
                    message: "Created category successfully",
                    createdcategory: {
                        PRODUCT_CATEGORY_NAME: result.PRODUCT_CATEGORY_NAME,
                        PRODUCT_CATEGORY_DESCRIPTION: result.PRODUCT_CATEGORY_DESCRIPTION,
                        UPDATED_BY: result.UPDATED_BY,
                        UPDATED_DATE: result.UPDATED_DATE,
                        ACTIVE_FLAG: result.ACTIVE_FLAG,
                        _id: result._id
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

//get category by id
exports.category_get_category = (req, res, next) =>{
    const id = req.params.categoryId;
    Category.findById(id)
        .select('PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        category: doc
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
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};

//update category details by id
exports.category_update_category = (req, res, next) =>{
    const id = req.params.categoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Category.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: "category updated"
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

//delete a category by id
exports.category_delete = (req, res, next) =>{
    const id = req.params.categoryId;
    Category.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'category deleted'
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

