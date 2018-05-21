const mongoose = require("mongoose");
const Filters = require("../models/filters");
const category = require("../models/category");
const Filters_categories = require("../models/filters_categories");

//get all active filter category connection details
exports.filters_categories_conn_get_all = (req, res, next) => {
    Filters_categories.find({ACTIVE_FLAG:'Y'})
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    filters_categories: docs.map(doc => {
                        return {
                            filter_category_conn_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            category_id: doc.CATEGORY_ID._id,
                            category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
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



//create a ne
exports.filters_categories_conn_create = (req, res, next) => {

    if(Filters.findById(req.body.FILTER_ID) && category.findById(req.body.CATEGORY_ID))
    {
        const filtercategories = new Filters_categories({
            _id: new mongoose.Types.ObjectId(),
            FILTER_ID: req.body.FILTER_ID,
            CATEGORY_ID: req.body.CATEGORY_ID,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        filtercategories
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "filter category connection stored",
                        createdcategory: {
                            _id: result._id,
                            FILTER_ID: result.FILTER_ID,
                            CATEGORY_ID: result.CATEGORY_ID,
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
                    message: "Category id or filter id does not exist"
                }
            });
    }
};


//get filter category connection details by id
exports.filters_categories_conn_get_by_id = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filters_categories.findById(id)
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        filter_category_conn_id: doc._id,
                        filter_id: doc.FILTER_ID._id,
                        filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                        category_id: doc.CATEGORY_ID._id,
                        category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                        updated_by_user: doc.UPDATED_BY,
                        updated_on: doc.UPDATED_DATE,
                        isActive: doc.ACTIVE_FLAG
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


//update filter category connection details by id
exports.filters_categories_conn_update = (req, res, next) => {
    const id = req.params.filtercategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Filters_categories.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'filter category connection updated'
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


//delete a filter category connection by id
exports.filters_categories_conn_delete = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filters_categories.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'filter category connection deleted'
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