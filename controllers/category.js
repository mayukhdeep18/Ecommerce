//const express = require("express");
//const router = express.Router();
const mongoose = require("mongoose");

//const checkAuth = require('../middleware/check-auth');
const Category = require("../models/category");

exports.category_get_all = (req, res, next) => {
    Category.find()
        .select('PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                categories: docs.map(doc => {
                    return {
                        PRODUCT_CATEGORY_NAME: doc.PRODUCT_CATEGORY_NAME,
                        PRODUCT_CATEGORY_DESCRIPTION: doc.PRODUCT_CATEGORY_DESCRIPTION,
                        UPDATED_BY: doc.UPDATED_BY,
                        UPDATED_DATE: doc.UPDATED_DATE,
                        ACTIVE_FLAG: doc.ACTIVE_FLAG,
                        _id: doc._id,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/category/" + doc._id
                        }
                    };
                })
            };
            // if (docs.length >= 0) {
            res.status(200).json(response);
            // } else {
            // res.status(404).json({
            // message: 'No entries found'
            // });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

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
                message: "Created category successfully",
                createdcategory: {
                    PRODUCT_CATEGORY_NAME: result.PRODUCT_CATEGORY_NAME,
                    PRODUCT_CATEGORY_DESCRIPTION: result.PRODUCT_CATEGORY_DESCRIPTION,
                    UPDATED_BY: result.UPDATED_BY,
                    UPDATED_DATE: result.UPDATED_DATE,
                    ACTIVE_FLAG: result.ACTIVE_FLAG,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/category/" + result._id
                    }
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

exports.category_get_category = (req, res, next) =>{
    const id = req.params.categoryId;
    Category.findById(id)
        .select('PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    category: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/category'
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
                message: 'category updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/category/' + id
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

exports.category_delete = (req, res, next) =>{
    const id = req.params.categoryId;
    Category.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'category deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/category',
                    body: {
                        PRODUCT_CATEGORY_NAME: 'String',
                        PRODUCT_CATEGORY_DESCRIPTION: 'String',
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

