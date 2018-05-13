const mongoose = require("mongoose");
const Seller_category = require("../models/seller_category");

//get all active seller_categories
exports.seller_category_get_all = (req, res, next) => {
    Seller_category.find({ACTIVE_FLAG:'Y'})
        .select('SELLER_CATEGORY_NAME SELLER_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            const response = {
                //count: docs.length,
                seller_categories: docs.map(doc => {
                    return {
                        seller_category_name: doc.SELLER_CATEGORY_NAME,
                        seller_category_description: doc.SELLER_CATEGORY_DESCRIPTION,
                        updated_by_user: doc.UPDATED_BY,
                        updated_on: doc.UPDATED_DATE,
                        isActive: doc.ACTIVE_FLAG,
                        seller_category_id: doc._id
                    };
                })
            };
            // if (docs.length >= 0) {
            res.status(200).json({
                status:"success",
                error_msg:"",
                data: {
                    message: 'Below are the seller_category details',
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


//create a new seller_category
exports.seller_category_create = (req, res, next) =>{
    const seller_category = new Seller_category({
        _id: new mongoose.Types.ObjectId(),
        SELLER_CATEGORY_NAME: req.body.SELLER_CATEGORY_NAME,
        SELLER_CATEGORY_DESCRIPTION: req.body.SELLER_CATEGORY_DESCRIPTION,
        UPDATED_BY: req.body.UPDATED_BY,
        UPDATED_DATE: new Date(),
        ACTIVE_FLAG: req.body.ACTIVE_FLAG
    });
    seller_category
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                status:"success",
                error_msg:"",
                data: {
                    message: "Created seller_category successfully",
                    createdseller_category: {
                        seller_category_name: result.SELLER_CATEGORY_NAME,
                        seller_category_description: result.SELLER_CATEGORY_DESCRIPTION,
                        updated_by_user: result.UPDATED_BY,
                        updated_on: result.UPDATED_DATE,
                        isActive: result.ACTIVE_FLAG,
                        seller_category_id: result._id
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

//get seller_category by id
exports.seller_category_get_by_id = (req, res, next) =>{
    const id = req.params.seller_categoryId;
    Seller_category.findById(id)
        .select('SELLER_CATEGORY_NAME SELLER_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        seller_category: doc
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

//update seller_category details by id
exports.seller_category_update_by_id = (req, res, next) =>{
    const id = req.params.seller_categoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Seller_category.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: "seller_category updated"
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

//delete a seller_category by id
exports.seller_category_delete_by_id = (req, res, next) =>{
    const id = req.params.seller_categoryId;
    Seller_category.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'seller_category deleted'
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