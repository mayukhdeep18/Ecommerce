const mongoose = require("mongoose");
const Filter_option = require("../models/filters");
const product = require("../models/product_details");
const Filter_opt_prod = require("../models/filter_options_products");

//get all active filter option product connection details
exports.filter_opt_prod_conn_get_all = (req, res, next) => {
    Filter_opt_prod.find({ACTIVE_FLAG:'Y'})
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate()
        .populate('FILTER_OPTION_ID')
        .populate('PRODUCT_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    filter_opt_prod: docs.map(doc => {
                        return {
                            filter_opt_prod_conn_id: doc._id,
                            filter_id: doc.FILTER_OPTION_ID._id,
                            filter_option_name: doc.FILTER_OPTION_ID.DISPLAY_TEXT,
                            product_id: doc.PRODUCT_ID._id,
                            product_name: doc.PRODUCT_ID.PRODUCT_NAME,
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


//create a new filter option product connection
exports.filter_opt_prod_conn_create = (req, res, next) => {

        const filteroptprod = new Filter_opt_prod({
            _id: new mongoose.Types.ObjectId(),
            PRODUCT_ID: req.body.PRODUCT_ID,
            FILTER_ID: req.body.FILTER_ID,
            FILTER_OPTION_ID: req.body.FILTER_OPTION_ID,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        filteroptprod
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    data: {
                        message: "filter option product connection stored"
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


//get filter option product connection details by id
exports.filter_opt_prod_conn_get_by_id = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_opt_prod.findById(id)
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_OPTION_ID')
        .populate('PRODUCT_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        filter_opt_prod_conn_id: doc._id,
                        filter_id: doc.FILTER_OPTION_ID._id,
                        filter_option_name: doc.FILTER_OPTION_ID.DISPLAY_TEXT,
                        product_id: doc.PRODUCT_ID._id,
                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
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


//update filter option product connection details by id
exports.filter_opt_prod_conn_update = (req, res, next) => {
    const id = req.params.filtercategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Filter_opt_prod.update({ _id: id }, { $set: updateOps })
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


//delete a filter option_product connection by id
exports.filter_opt_prod_conn_delete = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_opt_prod.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'filter option product connection deleted'
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