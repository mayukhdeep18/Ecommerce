const mongoose = require("mongoose");
const changeCase = require('change-case');
const Category = require("../models/category");

//get all active categories
exports.category_get_all = (req, res, next) => {
    Category.find({ACTIVE_FLAG:'Y'})
        .select('CATEGORY_ID PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            const response = {
                //count: docs.length,
                categories: docs.map(doc => {
                    return {
                        category_id: doc.CATEGORY_ID,
                        category_name: doc.PRODUCT_CATEGORY_NAME,
                        category_description: doc.PRODUCT_CATEGORY_DESCRIPTION,
                        updated_by: doc.UPDATED_BY,
                        updated_date: doc.UPDATED_DATE,
                        active_flag: doc.ACTIVE_FLAG,
                        doc_id: doc._id
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

    var Cat_id = req.body.PRODUCT_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    //console.log('Prod_id',Prod_id.toLowerCase());

    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        CATEGORY_ID: Cat_id.toLowerCase(),
        PRODUCT_CATEGORY_NAME: req.body.PRODUCT_CATEGORY_NAME.toLowerCase(),
        PRODUCT_CATEGORY_DESCRIPTION: req.body.PRODUCT_CATEGORY_DESCRIPTION.toLowerCase(),
        UPDATED_BY: req.body.UPDATED_BY,
        UPDATED_DATE: new Date(),
        ACTIVE_FLAG: req.body.ACTIVE_FLAG
    });
    category
        .save()
        .then(result => {
            //console.log(result);
            res.status(201).json({
                status:"success",
                error_msg:"",
                data: {
                    message: "Created category successfully"
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
    Category.find({CATEGORY_ID:id})
        .select('CATEGORY_ID PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            if (doc) {
                const response = {
                    //count: docs.length,
                    categories: doc.map(doc => {
                        return {
                            category_id: doc.CATEGORY_ID,
                            category_name: doc.PRODUCT_CATEGORY_NAME,
                            category_description: doc.PRODUCT_CATEGORY_DESCRIPTION,
                            updated_by: doc.UPDATED_BY,
                            updated_date: doc.UPDATED_DATE,
                            active_flag: doc.ACTIVE_FLAG,
                            doc_id: doc._id
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
    Category.update({ CATEGORY_ID: id }, { $set: updateOps })
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
    Category.remove({ CATEGORY_ID: id })
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

