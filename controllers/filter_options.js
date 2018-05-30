const mongoose = require("mongoose");
const Filters = require("../models/filters");
const Filter_options = require("../models/filter_options");
const Category = require("../models/category");

//get all active filter options connection details
exports.filters_options_conn_get_all = (req, res, next) => {
    Filter_options.find({ACTIVE_FLAG:'Y'})
        .select("URL_SLUG DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    filter_options: docs.map(doc => {
                        return {
                            filter_option_conn_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            url_slug: doc.URL_SLUG,
                            display_text: doc.DISPLAY_TEXT,
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



//create a new filter option connection
exports.filters_options_conn_create = (req, res, next) => {

    if(Filters.findById(req.body.FILTER_ID) && Category.findById(req.body.CATEGORY_ID))
    {
        const filteroption = new Filter_options({
            _id: new mongoose.Types.ObjectId(),
            FILTER_ID: req.body.FILTER_ID,
            CATEGORY_ID: req.CATEGORY_ID,
            URL_SLUG: req.body.URL_SLUG,
            DISPLAY_TEXT: req.body.DISPLAY_TEXT,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        filteroption
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
                            URL_SLUG: result.URL_SLUG,
                            DISPLAY_TEXT: result.DISPLAY_TEXT,
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
                    message: "filter id does not exist"
                }
            });
    }
};


//get filter option connection details by id
exports.filters_options_conn_get_by_id = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_options.findById(id)
        .select("URL_SLUG DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
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
                        filter_option_conn_id: doc._id,
                        filter_id: doc.FILTER_ID._id,
                        filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                        category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                        url_slug: doc.URL_SLUG,
                        display_text: doc.DISPLAY_TEXT,
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


//update filter option connection details by id
exports.filters_options_conn_update = (req, res, next) => {
    const id = req.params.filtercategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Filter_options.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'filter option connection updated'
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


//delete a filter option connection by id
exports.filters_options_conn_delete = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_options.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'filter option connection deleted'
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