const mongoose = require("mongoose");
const Filters = require("../models/filters");
const Filter_categories = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");

//get all active filter options connection details
exports.filters_options_conn_get_all = (req, res, next) => {
    Filter_options.find()
        .select("FILTER_ID DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        //.populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID',null)
        .populate('SUB_SUB_CATEGORY_ID',null)
        .exec()
        .then(docs => {
            console.log(docs.length);
            if(docs.length > 0)
            {
                var sub_category_id = "";
                var sub_category_name = "";
                var sub_sub_category_id = "";
                var sub_sub_category_name = "";

                const response = {
                    filter_value_details: docs.map(doc => {
                        if(doc.SUB_CATEGORY_ID != null){
                            sub_category_id =  doc.SUB_CATEGORY_ID._id;
                            sub_category_name =  doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME;

                        }
                        if(doc.SUB_SUB_CATEGORY_ID != null) {
                            sub_sub_category_id = doc.SUB_SUB_CATEGORY_ID._id;
                            sub_sub_category_name = doc.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                        }
                        return {
                            filter_value_id: doc._id,
                            filter_id: doc.FILTER_ID,
                            category_id: doc.CATEGORY_ID._id,
                            category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            product_sub_category_id: sub_category_id,
                            product_sub_category_name: sub_category_name,
                            product_sub_sub_category_id: sub_sub_category_id,
                            product_sub_sub_category_name: sub_sub_category_name,
                            display_text: doc.DISPLAY_TEXT,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
                };

                res.status(200).json({
                    status:"success",
                    data: {
                        response
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "No filter values exist!"
                    }
                });
            }

        })
        .catch(err => {
            console.log(err);
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
    var sub_categ_id ;
    var sub_sub_categ_id ;

    Filter_options.find({DISPLAY_TEXT:{$in: req.body.DISPLAY_TEXT}})
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
                Filter_categories.find({FILTER_ID:fil_id})
                    .select('CATEGORY_ID SUB_CATEGORY_ID SUB_SUB_CATEGORY_ID')
                    .exec()
                    .then(results => {

                        var arr = [];
                        if(results.SUB_CATEGORY_ID !=null)
                        {
                            sub_categ_id = results[0].SUB_CATEGORY_ID;
                        }
                        if(results.SUB_SUB_CATEGORY_ID!=null)
                        {
                            sub_sub_categ_id = results[0].SUB_SUB_CATEGORY_ID;
                        }
                        for(var item of req.body.DISPLAY_TEXT)
                        {
                            arr.push({
                                _id: new mongoose.Types.ObjectId(),
                                FILTER_ID: fil_id,
                                CATEGORY_ID: results[0].CATEGORY_ID,
                                SUB_CATEGORY_ID: sub_categ_id,
                                SUB_SUB_CATEGORY_ID: sub_sub_categ_id,
                                DISPLAY_TEXT: item,
                                UPDATED_BY: req.body.UPDATED_BY,
                                UPDATED_DATE: new Date(),
                                ACTIVE_FLAG: req.body.ACTIVE_FLAG
                            })
                        }


                        Filter_options.insertMany(arr)
                            .then(response => {
                                res.status(200).json({
                                    status: "success",
                                    data: {
                                        message: "filter values added successfully"
                                    }
                                });
                            }).catch(err=>{
                                res.status(500).json({
                                status: "error",
                                error: err,
                                data: {
                                    message: "Internal server error!"
                                }
                            });
                            });
                    }).catch(err => {
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
        .select("FILTER_ID DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        //.populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID',null)
        .populate('SUB_SUB_CATEGORY_ID',null)
        .exec()
        .then(doc => {

            if(doc!=null)
            {
                var sub_category_id = "";
                var sub_category_name = "";
                var sub_sub_category_id = "";
                var sub_sub_category_name = "";

                if(doc.SUB_CATEGORY_ID != null){
                    sub_category_id =  doc.SUB_CATEGORY_ID._id;
                    sub_category_name =  doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME;

                }
                if(doc.SUB_SUB_CATEGORY_ID != null) {
                    sub_sub_category_id = doc.SUB_SUB_CATEGORY_ID._id;
                    sub_sub_category_name = doc.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                }
                res.status(200).json({
                    status:"success",
                    data: {
                        filter_value_id: doc._id,
                        filter_id: doc.FILTER_ID,
                        category_id: doc.CATEGORY_ID._id,
                        category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                        product_sub_category_id: sub_category_id,
                        product_sub_category_name: sub_category_name,
                        product_sub_sub_category_id: sub_sub_category_id,
                        product_sub_sub_category_name: sub_sub_category_name,
                        display_text: doc.DISPLAY_TEXT,
                        updated_by_user: doc.UPDATED_BY,
                        updated_on: doc.UPDATED_DATE,
                        isActive: doc.ACTIVE_FLAG
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "No filter values exist!"
                    }
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error!"
                }
            });
        });
};


//update filter option connection details by id
exports.filters_options_conn_update = (req, res, next) => {
    const id = req.params.filtercategoryId;
    const updateOps = {};
    var sub_categ_id ;
    var sub_sub_categ_id ;

        updateOps['FILTER_ID'] = req.body.FILTER_ID;
        updateOps['DISPLAY_TEXT'] = req.body.DISPLAY_TEXT;

    Filter_categories.find({FILTER_ID:req.body.FILTER_ID})
        .select('CATEGORY_ID SUB_CATEGORY_ID SUB_SUB_CATEGORY_ID')
        .exec()
        .then(results => {
console.log(results);
            if(results.SUB_CATEGORY_ID !=null)
            {
                sub_categ_id = results[0].SUB_CATEGORY_ID;
            }
            if(results.SUB_SUB_CATEGORY_ID!=null)
            {
                sub_sub_categ_id = results[0].SUB_SUB_CATEGORY_ID;
            }
            updateOps['CATEGORY_ID'] = results[0].CATEGORY_ID;
            updateOps['SUB_CATEGORY_ID'] = sub_categ_id;
            updateOps['SUB_SUB_CATEGORY_ID'] = sub_sub_categ_id;

            Filter_options.update({ _id: id }, { $set: updateOps })
                .exec()
                .then(result => {
                    res.status(200).json({
                        status: "success",
                        data: {
                            message: 'filter option connection updated'
                        }
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
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