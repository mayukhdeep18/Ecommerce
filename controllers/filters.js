const mongoose = require("mongoose");
const Filters = require("../models/filters");

//get all active filter categories
exports.filter_category_get_all = (req, res, next) => {
    Filters.find({ACTIVE_FLAG:'Y'})
        .select('FILTER_CATEGORY_NAME UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            const response = {
                //count: docs.length,
                seller_categories: docs.map(doc => {
                    return {
                        filter_category_id: doc._id,
                        filter_category_name: doc.FILTER_CATEGORY_NAME,
                        updated_by_user: doc.UPDATED_BY,
                        updated_on: doc.UPDATED_DATE,
                        isActive: doc.ACTIVE_FLAG
                    };
                })
            };
            // if (docs.length >= 0) {
            res.status(200).json({
                status:"success",
                error_msg:"",
                data: {
                    message: 'Below are the filter_category details',
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


//create a new filter category
exports.filter_create_category = (req, res, next) =>{
    const filter = new Filters({
        _id: new mongoose.Types.ObjectId(),
        FILTER_CATEGORY_NAME: req.body.FILTER_CATEGORY_NAME,
        UPDATED_BY: req.body.UPDATED_BY,
        UPDATED_DATE: new Date(),
        ACTIVE_FLAG: req.body.ACTIVE_FLAG
    });
   filter
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                status:"success",
                error_msg:"",
                data: {
                    message: "Created category successfully",
                    filter_category: {
                        FILTER_CATEGORY_NAME: result.FILTER_CATEGORY_NAME,
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

//get filter_category by id
exports.filter_category_get_by_id = (req, res, next) =>{
    const id = req.params.filter_categoryId;
    Filters.findById(id)
        .select('FILTER_CATEGORY_NAME UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        filter_category_name: doc.FILTER_CATEGORY_NAME,
                        updated_by_user: doc.UPDATED_BY,
                        updated_on: doc.UPDATED_DATE,
                        isActive: doc.ACTIVE_FLAG,
                        seller_category_id: doc._id
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

//update filter_category details by id
exports.filter_category_update_by_id = (req, res, next) =>{
    const id = req.params.filter_categoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Filters.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: "filter_category updated"
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

//delete a filter_category by id
exports.filter_category_delete_by_id = (req, res, next) =>{
    const id = req.params.filter_categoryId;
    Filters.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'filter_category deleted'
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
