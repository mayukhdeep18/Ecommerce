const mongoose = require("mongoose");
const Filters = require("../models/filters");
const Filter_categories = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");
const Filter_prod_conn = require("../models/filter_options_products");
const Product = require("../models/product_details");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");

//get all active filter options connection details
exports.filters_options_conn_get_all = (req, res, next) => {

    Filter_options.find()
        .select("FILTER_ID DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID',null)
        .populate('SUB_SUB_CATEGORY_ID',null)
        .exec()
        .then(docs => {

            if(docs.length > 0)
            {
                const response = {
                    filter_value_details: docs.map(doc => {
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
                        return {
                            filter_value_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_type: doc.FILTER_ID.FILTER_CATEGORY_NAME,
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

//get filter type and value by product id
exports.filters_get_by_product = (req, res, next) => {
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

//get filter option connection details by id
exports.filters_options_conn_get_by_id = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_options.findById(id)
        .select("FILTER_ID DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
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
                        filter_id: doc.FILTER_ID._id,
                        filter_type: doc.FILTER_ID.FILTER_CATEGORY_NAME,
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





//ONLY THE BELOW APIs WILL BE USED TO ADD/GET/UPDATE/DELETE FILTER VALUES

//create a new filter option connection - add new filter values from inside cat/subcat/subsubcat
exports.filters_options_conn_create = (req, res, next) => {
    const cat_id = req.body.CATEGORY_ID;
    const sub_cat_id = req.body.SUB_CATEGORY_ID;
    const sub_sub_cat_id = req.body.SUB_SUB_CATEGORY_ID;
    var fil_id = req.body.FILTER_ID;
    var arr = [];

    for(var new_item of req.body.DISPLAY_TEXT)
    {
        arr.push(new_item.toLowerCase());
    }

    Filter_options.find({$and:[{DISPLAY_TEXT:{$in: arr}},{FILTER_ID: fil_id},{$or:[{CATEGORY_ID: req.body.CATEGORY_ID},{SUB_CATEGORY_ID:req.body.SUB_CATEGORY_ID},{SUB_SUB_CATEGORY_ID: req.body.SUB_SUB_CATEGORY_ID}]}]})
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
                if(cat_id!=null && cat_id.length >0)
                {
                    var arr = [];

                    for(var item of req.body.DISPLAY_TEXT)
                    {
                        arr.push({
                            _id: new mongoose.Types.ObjectId(),
                            FILTER_ID: fil_id,
                            CATEGORY_ID: cat_id,
                            //SUB_CATEGORY_ID: sub_categ_id,
                            //SUB_SUB_CATEGORY_ID: sub_sub_categ_id,
                            DISPLAY_TEXT: item.toLowerCase(),
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
                }
                if(sub_cat_id!=null && sub_cat_id.length >0)
                {
                    var arr = [];

                    for(var item of req.body.DISPLAY_TEXT)
                    {
                        arr.push({
                            _id: new mongoose.Types.ObjectId(),
                            FILTER_ID: fil_id,
                            //CATEGORY_ID: cat_id,
                            SUB_CATEGORY_ID: sub_cat_id,
                            //SUB_SUB_CATEGORY_ID: sub_sub_categ_id,
                            DISPLAY_TEXT: item.toLowerCase(),
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
                }
                if(sub_sub_cat_id!=null && sub_sub_cat_id.length >0)
                {
                    var arr = [];

                    for(var item of req.body.DISPLAY_TEXT)
                    {
                        arr.push({
                            _id: new mongoose.Types.ObjectId(),
                            FILTER_ID: fil_id,
                            //CATEGORY_ID: cat_id,
                            //SUB_CATEGORY_ID: sub_cat_id,
                            SUB_SUB_CATEGORY_ID: sub_sub_cat_id,
                            DISPLAY_TEXT: item.toLowerCase(),
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
                }
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

//get all filter values by filter type and cat/subcat/subsubcat id
exports.filters_options_get_by_fil = (req, res, next) => {

    Filter_options.find({$and: [{FILTER_ID: req.params.filtertypeid},{$or:[{CATEGORY_ID: req.params.filtercategoryId},{SUB_CATEGORY_ID:req.params.filtercategoryId},{SUB_SUB_CATEGORY_ID: req.params.filtercategoryId}]}]})
        .select("FILTER_ID DISPLAY_TEXT UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('CATEGORY_ID',null)
        .populate('SUB_CATEGORY_ID',null)
        .populate('SUB_SUB_CATEGORY_ID',null)
        .exec()
        .then(docs => {

            if(docs.length > 0)
            {
                const response = {
                    filter_value_details: docs.map(doc => {

                        var cat_doc_id;
                        var category_id;
                        var category_name ;
                        var sub_cat_doc_id ;
                        var sub_category_id ;
                        var sub_category_name ;
                        var sub_sub_cat_doc_id ;
                        var sub_sub_category_id ;
                        var sub_sub_category_name ;

                        if(docs.CATEGORY_ID != null){
                            cat_doc_id =  docs.CATEGORY_ID._id;
                            category_id = docs.CATEGORY_ID.CATEGORY_ID,
                                category_name =  docs.CATEGORY_ID.PRODUCT_CATEGORY_NAME

                        }
                        if(docs.SUB_CATEGORY_ID != null){
                            sub_cat_doc_id =  docs.SUB_CATEGORY_ID._id;
                            sub_category_id = docs.SUB_CATEGORY_ID.SUB_CATEGORY_ID,
                                sub_category_name =  docs.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME

                        }
                        if(docs.SUB_SUB_CATEGORY_ID != null) {
                            sub_sub_cat_doc_id = docs.SUB_SUB_CATEGORY_ID._id;
                            sub_sub_category_id = docs.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_ID;
                            sub_sub_category_name = docs.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                        }
                        return {
                            filter_value_id: doc._id,
                            filter_id: doc.FILTER_ID._id,
                            filter_type: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                            cat_doc_id: cat_doc_id,
                            category_id: category_id,
                            category_name: category_name,
                            sub_cat_doc_id : sub_cat_doc_id,
                            sub_category_id:  sub_category_id,
                            sub_category_name:  sub_category_name,
                            sub_sub_cat_doc_id: sub_sub_cat_doc_id,
                            sub_sub_category_id:sub_sub_category_id,
                            sub_sub_category_nm: sub_sub_category_name,
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

//update filter option connection details by id
exports.filters_options_conn_update = (req, res, next) => {
    const id = req.params.filtercategoryId;
    const updateOps = {};

    updateOps['DISPLAY_TEXT'] = req.body.DISPLAY_TEXT.toLowerCase();
    updateOps['UPDATED_DATE'] = new Date();

    Filter_options.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {

            res.status(200).json({
                status: "success",
                data: {
                    message: 'filter option connection updated'
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

//delete a filter value and dependencies by id
exports.filters_options_conn_delete = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filter_options.remove({ _id: id })
        .exec()
        .then(result => {
            Filter_prod_conn.remove({FILTER_OPTION_ID: id})
                .exec()
                .then(res1 => {
                    res.status(200).json({
                        status: "success",
                        data: {
                            message: 'filter value and its dependencies deleted successfully!'
                        }
                    });
                }).catch(err => {
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


