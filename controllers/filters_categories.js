const mongoose = require("mongoose");
const Filters = require("../models/filters");
const category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");
const Filters_categories = require("../models/filters_categories");


//create a new category and establish category filter connection
exports.filters_categories_conn_create = (req, res, next) => {
    const fil_type = req.body.FILTER_CATEGORY_NAME.toLowerCase();
    const cat_id = req.body.CATEGORY_ID;
    const sub_cat_id = req.body.SUB_CATEGORY_ID;
    const sub_sub_cat_id = req.body.SUB_SUB_CATEGORY_ID;

    if(cat_id!=null && fil_type.length > 0 && cat_id.length >0)
    {
        Filters.find({FILTER_CATEGORY_NAME: fil_type})
            .select('_id')
            .exec()
            .then(fil_res =>{
                if(fil_res.length >0)
                {
                    res.status(500).json({
                        status: "error",
                        data: {
                            message: "Category Filter already exists"
                        }
                    });
                }
                else
                {
                    const filter = new Filters({
                        _id: new mongoose.Types.ObjectId(),
                        FILTER_ID: fil_type.toLowerCase(),
                        FILTER_CATEGORY_NAME: req.body.FILTER_CATEGORY_NAME.toLowerCase(),
                        UPDATED_BY: req.body.UPDATED_BY,
                        UPDATED_DATE: new Date(),
                        ACTIVE_FLAG: req.body.ACTIVE_FLAG
                    });
                    filter
                        .save()
                        .then(result => {

                            if(category.findById(cat_id))
                            {
                                const filtercategories = new Filters_categories({
                                    _id: new mongoose.Types.ObjectId(),
                                    FILTER_ID: result._id,
                                    CATEGORY_ID: cat_id,
                                    //SUB_CATEGORY_ID: req.body.SUB_CATEGORY_ID,
                                    //SUB_SUB_CATEGORY_ID: req.body.SUB_SUB_CATEGORY_ID,
                                    UPDATED_BY: req.body.UPDATED_BY,
                                    UPDATED_DATE: new Date(),
                                    ACTIVE_FLAG: req.body.ACTIVE_FLAG
                                });
                                filtercategories
                                    .save()
                                    .then(result_1 => {
                                        res.status(201).json({
                                            status: "success",
                                            data: {
                                                message: "filter and filter category connection stored"
                                            }
                                        });
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
                            }
                            else {
                                res
                                    .status(404)
                                    .json({
                                        status: "error",
                                        error: "ID doesn't exist",
                                        data: {
                                            message: "Category or filter does not exist"
                                        }
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
    }
    else if(sub_cat_id!=null && fil_type.length > 0 && sub_cat_id.length >0)
    {
        Filters.find({FILTER_CATEGORY_NAME: fil_type})
            .select('_id')
            .exec()
            .then(fil_subres => {
                if (fil_subres.length > 0)
                {
                    res.status(500).json({
                        status: "error",
                        data: {
                            message: "Sub category filter already exists"
                        }
                    });
                }
                else
                {
                    const filter = new Filters({
                        _id: new mongoose.Types.ObjectId(),
                        FILTER_ID: fil_type.toLowerCase(),
                        FILTER_CATEGORY_NAME: req.body.FILTER_CATEGORY_NAME.toLowerCase(),
                        UPDATED_BY: req.body.UPDATED_BY,
                        UPDATED_DATE: new Date(),
                        ACTIVE_FLAG: req.body.ACTIVE_FLAG
                    });
                    filter
                        .save()
                        .then(result => {

                            if(Subcategory.findById(sub_cat_id))
                            {

                                Subcategory.findById(sub_cat_id)
                                    .select('PRODUCT_CATEGORY_ID _id ACTIVE_FLAG')
                                    .populate('PRODUCT_CATEGORY_ID')
                                    .exec()
                                    .then(sub_cat_res=> {
                                        const filtersubcateg = new Filters_categories({
                                            _id: new mongoose.Types.ObjectId(),
                                            FILTER_ID: result._id,
                                            CATEGORY_ID: sub_cat_res.PRODUCT_CATEGORY_ID._id,
                                            SUB_CATEGORY_ID: sub_cat_id,
                                            //SUB_SUB_CATEGORY_ID: req.body.SUB_SUB_CATEGORY_ID,
                                            UPDATED_BY: req.body.UPDATED_BY,
                                            UPDATED_DATE: new Date(),
                                            ACTIVE_FLAG: req.body.ACTIVE_FLAG
                                        });
                                        filtersubcateg
                                            .save()
                                            .then(result_1 => {
                                                res.status(201).json({
                                                    status: "success",
                                                    data: {
                                                        message: "filter and filter sub category connection stored"
                                                    }
                                                });
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
                            else {
                                res
                                    .status(404)
                                    .json({
                                        status: "error",
                                        error: "ID doesn't exist",
                                        data: {
                                            message: "SubCategory or filter does not exist"
                                        }
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

    }
    else if(sub_sub_cat_id!=null && fil_type.length > 0 && sub_sub_cat_id.length >0)
    {
        Filters.find({FILTER_CATEGORY_NAME: fil_type})
            .select('_id')
            .exec()
            .then(fil_res => {
                if (fil_res.length > 0)
                {
                    res.status(500).json({
                        status: "error",
                        data: {
                            message: "Sub sub category Filter already exists"
                        }
                    });
                }
                else
                {
                    const filter = new Filters({
                        _id: new mongoose.Types.ObjectId(),
                        FILTER_ID: fil_type.toLowerCase(),
                        FILTER_CATEGORY_NAME: req.body.FILTER_CATEGORY_NAME.toLowerCase(),
                        UPDATED_BY: req.body.UPDATED_BY,
                        UPDATED_DATE: new Date(),
                        ACTIVE_FLAG: req.body.ACTIVE_FLAG
                    });
                    filter
                        .save()
                        .then(result => {

                            if(Subsubcategory.findById(sub_sub_cat_id))
                            {

                                Subsubcategory.findById(sub_sub_cat_id)
                                    .select('_id ACTIVE_FLAG')
                                    .populate('CATEGORY_ID')
                                    .populate('SUB_CATEGORY_ID')
                                    .exec()
                                    .then(sub_sub_cat_res=> {
                                        const filtersubsubcateg = new Filters_categories({
                                            _id: new mongoose.Types.ObjectId(),
                                            FILTER_ID: result._id,
                                            CATEGORY_ID: sub_sub_cat_res.CATEGORY_ID._id,
                                            SUB_CATEGORY_ID: sub_sub_cat_res.SUB_CATEGORY_ID._id,
                                            SUB_SUB_CATEGORY_ID: sub_sub_cat_id,
                                            UPDATED_BY: req.body.UPDATED_BY,
                                            UPDATED_DATE: new Date(),
                                            ACTIVE_FLAG: req.body.ACTIVE_FLAG
                                        });
                                        filtersubsubcateg
                                            .save()
                                            .then(result_2 => {
                                                res.status(201).json({
                                                    status: "success",
                                                    data: {
                                                        message: "filter and filter sub sub category connection stored"
                                                    }
                                                });
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
                            else {
                                res
                                    .status(404)
                                    .json({
                                        status: "error",
                                        error: "ID doesn't exist",
                                        data: {
                                            message: "SubSubCategory or filter does not exist"
                                        }
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
    }
    else
    {
        res.status(500).json({
            status: "error",
            data: {
                message: "Please check all your fields!"
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
                        filter_category_conn_id: doc._id,
                        filter_id: doc.FILTER_ID._id,
                        filter_category_name: doc.FILTER_ID.FILTER_CATEGORY_NAME,
                        category_id: doc.CATEGORY_ID._id,
                        category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                        product_sub_category_id: doc.SUB_CATEGORY_ID._id,
                        product_sub_category_name: doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                        product_sub_sub_category_id: doc.SUB_SUB_CATEGORY_ID._id,
                        product_sub_sub_category_name: doc.SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
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
                data: {
                    message: 'filter category connection updated'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error"
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
                        message: "Internal server error!"
                    }
            });
        });
};

//get all active filter category connection details
exports.filters_categories_conn_get_all = (req, res, next) => {
    Filters_categories.find({ACTIVE_FLAG:'Y'})
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('SUB_SUB_CATEGORY_ID',null)
        .populate('SUB_CATEGORY_ID',null)
        .populate('CATEGORY_ID')
        .exec()
        .then(doc => {
           /* var sub_id ="";
            var sub_category_id = "";
            var sub_category_name = "";
            var sub_sub_cat_doc_id = "";
            var sub_sub_category_id = "";
            var sub_sub_category_name = "";

           const response = {
                filter_category_details: doc.map(docs => {
                    if(docs.SUB_CATEGORY_ID != null){
                        sub_id =  docs.SUB_CATEGORY_ID._id;
                        sub_category_id = docs.SUB_CATEGORY_ID.SUB_CATEGORY_ID,
                            sub_category_name =  docs.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME

                    }
                    if(docs.SUB_SUB_CATEGORY_ID != null) {
                        sub_sub_cat_doc_id = docs.SUB_SUB_CATEGORY_ID._id;
                        sub_sub_category_id = docs.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_ID;
                        sub_sub_category_name = docs.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                    }
                    return {
                        filter_doc_id: docs.FILTER_ID._id,
                        filter_id: docs.FILTER_ID.FILTER_ID,
                        filter_type: docs.FILTER_ID.FILTER_CATEGORY_NAME,
                        cat_doc_id: docs.CATEGORY_ID._id,
                        category_id: docs.CATEGORY_ID.CATEGORY_ID,
                        category_name: docs.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                        sub_id : sub_id,
                        sub_category_id:  sub_category_id,
                        sub_category_name:  sub_category_name,
                        sub_sub_cat_doc_id: sub_sub_cat_doc_id,
                        sub_sub_category_id:sub_sub_category_id,
                        sub_sub_category_nm: sub_sub_category_name
                    };
                })
            };*/
            // if (docs.length >= 0) {
            res.status(200).json({
                status:"success",
                error_msg:"",
                data: {
                   doc
                }
            });
        })
        .catch(err => {
            console.log(err),
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};