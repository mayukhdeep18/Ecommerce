const mongoose = require("mongoose");
const Filters = require("../models/filters");
const Filter_options = require("../models/filter_options");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");

//get all active filter options connection details
exports.filters_options_conn_get_all = (req, res, next) => {
    Filter_options.find({ACTIVE_FLAG:'Y'})
        .select("FILTER_ID DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        //.populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID')
        .populate('SUB_SUB_CATEGORY_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        filter_options: docs.map(doc => {
                            return {
                                filter_option_conn_id: doc._id,
                                filter_id: doc.FILTER_ID,
                                category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                product_sub_category_id: doc.SUB_CATEGORY_ID._id,
                                product_sub_category_name: doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                product_sub_sub_category_id: doc.SUB_SUB_CATEGORY_ID._id,
                                product_sub_sub_category_name: doc.SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                                display_text: doc.DISPLAY_TEXT,
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else
            {
                res.status(200).json({
                    status: "success",
                    data: {
                        message: "No filter values exist!"
                    }
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error!"
                }
            });
        });
};



//create a new filter option connection
exports.filters_options_conn_create = (req, res, next) => {

    var fil_id = req.body.FILTER_ID;
    var sub_categ_id = "";
    var sub_sub_categ_id = "";

    Filter_options.find({FILTER_ID:fil_id})
        .select('FILTER_ID _id')
        .exec()
        .then(doc =>{
            if(doc.length > 0)
            {
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Filter values already exist! You may try updating if you wish to change something!"
                    }
                });
            }
            else
            {
                Filters.find({FILTER_ID:fil_id})
                    .select('CATEGORY_ID SUB_CATEGORY_ID SUB_SUB_CATEGORY_ID')
                    .exec()
                    .then(res => {
                        var arr = [];
                        if(res.SUB_CATEGORY_ID !=null)
                        {
                            sub_categ_id = res.SUB_CATEGORY_ID;
                        }
                        if(res.SUB_SUB_CATEGORY_ID!=null)
                        {
                            sub_sub_categ_id = res.SUB_SUB_CATEGORY_ID;
                        }
                        for(var item of req.body.DISPLAY_TEXT)
                        {
                            arr.push({
                                _id: new mongoose.Types.ObjectId(),
                                FILTER_ID: fil_id,
                                CATEGORY_ID: res.CATEGORY_ID,
                                SUB_CATEGORY_ID: res.SUB_CATEGORY_ID,
                                SUB_SUB_CATEGORY_ID: res.SUB_SUB_CATEGORY_ID,
                                DISPLAY_TEXT: item,
                                UPDATED_BY: req.body.UPDATED_BY,
                                UPDATED_DATE: new Date(),
                                ACTIVE_FLAG: req.body.ACTIVE_FLAG
                            })
                        }
                        Filter_options.insertMany(arr, function(error, inserted) {
                            if(error) {
                                res.status(500).json({
                                    status: "error",
                                    data: {
                                        message: "Internal server error!"
                                    }
                                });
                            }
                            else {
                                res.status(201).json({
                                    status: "success",
                                    data: {
                                        message: "filter values added successfully"
                                    }
                                });
                            }

                        }); // end of insert
                    }).catch(err => {
                    //console.log(err);
                    res.status(500).json({
                        status: "error",
                        error: err,
                        data: {
                            message: "Internal server error!"
                        }
                    });
                });
            }
        }).catch(err => {
        //console.log(err);
        res.status(500).json({
            status: "error",
            error: err,
            data: {
                message: "Internal server error!"
            }
        });
    });
};


//get filter option connection details by id
exports.filters_options_conn_get_by_id = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_options.findById(id)
        .select("URL_SLUG DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID')
        .populate('SUB_SUB_CATEGORY_ID')
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
                        product_sub_category_id: doc.SUB_CATEGORY_ID._id,
                        product_sub_category_name: doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                        product_sub_sub_category_id: doc.SUB_SUB_CATEGORY_ID._id,
                        product_sub_sub_category_name: doc.SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
            //console.log(err);
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