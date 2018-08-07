const mongoose = require("mongoose");
const Filter_option = require("../models/filters");
const Product = require("../models/product_details");
const Filter_options = require("../models/filter_options");
const Filter_opt_prod = require("../models/filter_options_products");

//get all active filter option product connection details
exports.filter_opt_prod_conn_get_all = (req, res, next) => {
    Filter_opt_prod.find()
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('FILTER_ID')
        .populate('FILTER_OPTION_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                data: {
                    filter_opt_prod: docs.map(doc => {
                        return {
                            filter_opt_prod_conn_id: doc._id,
                            prod_id: doc.PRODUCT_ID._id,
                            product_id: doc.PRODUCT_ID.PRODUCT_ID,
                            product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                            filter_id: doc.FILTER_ID._id,
                            filter_type: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            filter_val_id: doc.FILTER_OPTION_ID._id,
                            filter_val_name: doc.FILTER_OPTION_ID.DISPLAY_TEXT,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
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

//get filter option product connection details by product id
exports.filter_opt_prod_conn_get_by_id = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_opt_prod.find({PRODUCT_ID: id})
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('FILTER_ID')
        .populate('FILTER_OPTION_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                data: {
                    filter_opt_prod: docs.map(doc => {
                        return {
                            filter_opt_prod_conn_id: doc._id,
                            prod_id: doc.PRODUCT_ID._id,
                            product_id: doc.PRODUCT_ID.PRODUCT_ID,
                            product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                            filter_id: doc.FILTER_ID._id,
                            filter_type: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            filter_val_id: doc.FILTER_OPTION_ID._id,
                            filter_val_name: doc.FILTER_OPTION_ID.DISPLAY_TEXT,
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

//update filter option product connection details by id
exports.filter_opt_prod_conn_update = (req, res, next) => {
    const id = req.params.filtercategoryId;
    const updateOps = {};
    updateOps['PRODUCT_ID']= req.body.PRODUCT_ID;
    updateOps['FILTER_ID'] = req.body.FILTER_ID;
    updateOps['FILTER_OPTION_ID'] = req.body.FILTER_OPTION_ID;
    updateOps['UPDATED_DATE']= new Date();
    updateOps['ACTIVE_FLAG']= req.body.ACTIVE_FLAG;

    Filter_opt_prod.update({ PRODUCT_ID: id }, { $set: updateOps },{multi: true})
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: 'filter values and product connection updated'
                }
            });
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




//THE BELOW APIs ARE THE ONES REQUIRED FOR PRODUCT FILTER TYPE AND FILTER VALUE CONNECTION

//create a new filter option product connection
exports.filter_opt_prod_conn_create = (req, res, next) => {
    var filObj = req.body;
    var fil = [];
    var val = [];
    var fil_prod = [];
    for(var item of filObj)
    {
        fil.push(item.FILTER_ID);
        val.push(item.FILTER_OPTION_ID);
        fil_prod.push({
            FILTER_ID: item.FILTER_ID,
            FILTER_OPTION_ID: item.FILTER_OPTION_ID,
            PRODUCT_ID: item.PRODUCT_ID,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: item.ACTIVE_FLAG
        });
    }

    Filter_opt_prod.find({$and:[{FILTER_ID:{$in:fil}},{FILTER_OPTION_ID:{$in:val}},{PRODUCT_ID: fil_prod[0].PRODUCT_ID}]})
        .select('FILTER_ID FILTER_OPTION_ID ACTIVE_FLAG _id')
        .exec()
        .then(fil_opt => {
            if(fil_opt.length > 0)
            {
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Filter value already connected to product!"
                    }
                });
            }
            else {
                Filter_opt_prod.insertMany(fil_prod)
                    .then(response => {
                        res.status(200).json({
                            status: "success",
                            data: {
                                message: "filter values added to product successfully"
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
            }
        }).catch(err=>{
        res.status(500).json({
            status: "error",
            error: err,
            data: {
                message: "Internal server error!"
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
                data: {
                    message: 'filter value deleted'
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
                        message: "Failed to delete filter product connection!"
                    }
            });
        });
};


//get all active filter option product connection details by product id
exports.filter_opt_prod_get_by_prod = (req, res, next) => {
    const ProdId = req.params.prodId;
    var cat_arr = [];
    var sub_cat_arr = [];
    var sub_sub_cat_arr = [];
    Product.find({_id: ProdId})
        .select('PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_ID PRODUCT_NAME ACTIVE_FLAG _id')
        .exec()
        .then(prod_res => {
            if(prod_res.length>0)
            {
                Filter_options.find({CATEGORY_ID: prod_res[0].PRODUCT_CATEGORY_ID})
                    .select('DISPLAY_TEXT ACTIVE_FLAG _id')
                    .populate('FILTER_ID')
                    .populate('CATEGORY_ID')
                    .exec()
                    .then(cat_res => {
                        if(cat_res.length > 0)
                        {
                            for(var item of cat_res)
                            {
                                cat_arr.push({
                                    category_id: item.CATEGORY_ID._id,
                                    category_name: item.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                    filter_type_id: item.FILTER_ID._id,
                                    filter_type_name: item.FILTER_ID.FILTER_CATEGORY_NAME,
                                    filter_value_id: item._id,
                                    filter_value_name: item.DISPLAY_TEXT
                                });
                            }

                        }
                        Filter_options.find({SUB_CATEGORY_ID: prod_res[0].PRODUCT_SUB_CATEGORY_ID})
                            .select('DISPLAY_TEXT ACTIVE_FLAG _id')
                            .populate('FILTER_ID')
                            .populate('SUB_CATEGORY_ID')
                            .exec()
                            .then(sub_cat_res => {
                                if(sub_cat_res.length > 0)
                                {
                                    for(var item1 of sub_cat_res)
                                    {
                                        sub_cat_arr.push({
                                            sub_category_id: item1.SUB_CATEGORY_ID._id,
                                            sub_category_name: item1.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                            filter_type_id: item1.FILTER_ID._id,
                                            filter_type_name: item1.FILTER_ID.FILTER_CATEGORY_NAME,
                                            filter_value_id: item1._id,
                                            filter_value_name: item1.DISPLAY_TEXT
                                        });
                                    }

                                }
                                Filter_options.find({SUB_SUB_CATEGORY_ID: prod_res[0].PRODUCT_SUB_SUB_CATEGORY_ID})
                                    .select('DISPLAY_TEXT ACTIVE_FLAG _id')
                                    .populate('FILTER_ID')
                                    .populate('SUB_SUB_CATEGORY_ID')
                                    .exec()
                                    .then(sub_sub_cat_res => {
                                        if(sub_sub_cat_res.length > 0)
                                        {
                                            for(var item2 of sub_sub_cat_res)
                                            {
                                                sub_sub_cat_arr.push({
                                                    sub_sub_category_id: item2.SUB_SUB_CATEGORY_ID._id,
                                                    sub_sub_category_name: item2.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME,
                                                    filter_type_id: item2.FILTER_ID._id,
                                                    filter_type_name: item2.FILTER_ID.FILTER_CATEGORY_NAME,
                                                    filter_value_id: item2._id,
                                                    filter_value_name: item2.DISPLAY_TEXT
                                                });
                                            }

                                        }
                                        res.status(201).json({
                                            status: "success",
                                            data: {
                                                product_id: prod_res._id,
                                                product_name: prod_res.PRODUCT_NAME,
                                                category_filter: cat_arr,
                                                sub_cat_filter: sub_cat_arr,
                                                sub_sub_cat_filter: sub_sub_cat_arr
                                            }
                                        });
                                    }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        status: "error",
                                        error: err,
                                        data: {
                                            message: "Internal server error!"
                                        }
                                    });
                                });
                            }).catch(err => {
                            console.log(err);
                            res.status(500).json({
                                status: "error",
                                error: err,
                                data: {
                                    message: "Internal server error!"
                                }
                            });
                        });
                    }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        status: "error",
                        error: err,
                        data: {
                            message: "Internal server error!"
                        }
                    });
                });
            }
            else
            {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "Product does not exist!"
                    }
                });
            }
        }).catch(err => {
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