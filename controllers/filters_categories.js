const mongoose = require("mongoose");
const Filters = require("../models/filters");
const category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");
const Filters_categories = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");
const Filter_prod_con = require("../models/filter_options_products");


//create a new category and establish category filter connection
exports.filters_categories_conn_create = (req, res, next) => {
    const fil_type = req.body.FILTER_CATEGORY_NAME.toLowerCase();
    var fil_id = req.body.FILTER_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
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
                        FILTER_ID: fil_id.toLowerCase(),
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
                        FILTER_ID: fil_id.toLowerCase(),
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
                        FILTER_ID: fil_id.toLowerCase(),
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
        .populate('SUB_CATEGORY_ID',null)
        .populate('SUB_SUB_CATEGORY_ID',null)
        .exec()
        .then(docs => {

            if(docs !=null)
            {
                var sub_cat_doc_id ="";
                var sub_category_id = "";
                var sub_category_name = "";
                var sub_sub_cat_doc_id = "";
                var sub_sub_category_id = "";
                var sub_sub_category_name = "";

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
                res.status(200).json({
                    status:"success",

                    data: {
                        fil_cat_connection_id: docs._id,
                        filter_doc_id: docs.FILTER_ID._id,
                        filter_id: docs.FILTER_ID.FILTER_ID,
                        filter_type: docs.FILTER_ID.FILTER_CATEGORY_NAME,
                        cat_doc_id: docs.CATEGORY_ID._id,
                        category_id: docs.CATEGORY_ID.CATEGORY_ID,
                        category_name: docs.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                        sub_cat_doc_id : sub_cat_doc_id,
                        sub_category_id:  sub_category_id,
                        sub_category_name:  sub_category_name,
                        sub_sub_cat_doc_id: sub_sub_cat_doc_id,
                        sub_sub_category_id:sub_sub_category_id,
                        sub_sub_category_nm: sub_sub_category_name
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "No filter category connections found"
                    }
                });
            }

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

//update filter category connection details by id
exports.filters_categories_conn_update = (req, res, next) => {
    const id = req.params.filtercategoryId;
    const updateOps = {};
    const updateOps1 = {};
    const updateOps2 = {};
    const updateRes = {};
    const fil_arr = [];
    const fil_type = req.body.FILTER_CATEGORY_NAME.toLowerCase();
    var fil_id = req.body.FILTER_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    const cat_id = req.body.CATEGORY_ID;
    const sub_cat_id = req.body.SUB_CATEGORY_ID;
    const sub_sub_cat_id = req.body.SUB_SUB_CATEGORY_ID;

    if(cat_id!=null && fil_type.length > 0 && cat_id.length >0)
    {
        Filters_categories.findById(id)
            .select('_id')
            .populate('FILTER_ID')
            .exec()
            .then(docs => {

                Filters.find({FILTER_CATEGORY_NAME: fil_type})
                    .select('_id')
                    .exec()
                    .then(fil_res =>{

                        if(fil_res.length >0 && fil_type!=docs.FILTER_ID.FILTER_CATEGORY_NAME)
                        {
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "Filter already exists under some other category/sub/sub_sub category!"
                                }
                            });
                        }
                        else
                        {
                            updateOps['FILTER_ID'] = fil_id.toLowerCase();
                            updateOps['FILTER_CATEGORY_NAME'] = fil_type.toLowerCase();
                            updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                            updateOps['UPDATED_DATE'] = new Date();
                            updateRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                            updateRes['UPDATED_DATE'] = new Date();

                            Filters.update({ _id: docs.FILTER_ID._id }, { $set: updateOps })
                                .exec()
                                .then(result => {

                                    updateOps1['CATEGORY_ID'] = cat_id;
                                    updateOps1['SUB_CATEGORY_ID'] = sub_cat_id;
                                    updateOps1['SUB_SUB_CATEGORY_ID'] = sub_sub_cat_id;
                                    updateOps1['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                                    updateOps1['UPDATED_DATE'] = new Date();

                                    Filters_categories.update({ _id: id }, { $set: updateOps1 })
                                        .exec()
                                        .then(result_1 => {

                                            updateOps2['CATEGORY_ID'] = cat_id;
                                            updateOps2['SUB_CATEGORY_ID'] = sub_cat_id;
                                            updateOps2['SUB_SUB_CATEGORY_ID'] = sub_sub_cat_id;
                                            updateOps2['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                                            updateOps2['UPDATED_DATE'] = new Date();
                                            console.log("fil_id",filter_id);

                                            Filter_options.update({ FILTER_ID: docs.FILTER_ID._id}, { $set: updateOps2 },{multi: true})
                                                .exec()
                                                .then(result_2 => {
                                                    Filter_prod_con.update({FILTER_ID: docs.FILTER_ID._id},{$set: updateRes}, {multi: true})
                                                        .exec()
                                                        .then(result3 => {
                                                            res.status(201).json({
                                                                status: "success",
                                                                data: {
                                                                    message: "filter, filter category connection and dependencies updated"
                                                                }
                                                            });
                                                        })
                                                }).catch(err => {
                                                res.status(500).json({
                                                    status: "error",
                                                    error: err,
                                                    data: {
                                                        message: "Internal server error!"
                                                    }
                                                });
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
    else if(sub_cat_id!=null && fil_type.length > 0 && sub_cat_id.length >0)
    {
        Filters_categories.findById(id)
            .select('_id')
            .populate('FILTER_ID')
            .exec()
            .then(docs => {
                        Filters.find({FILTER_CATEGORY_NAME: fil_type})
                            .select('_id')
                            .exec()
                            .then(fil_subres => {
                                if (fil_subres.length > 0 && fil_type != docs.FILTER_ID.FILTER_CATEGORY_NAME) {
                                    res.status(500).json({
                                        status: "error",
                                        data: {
                                            message: "Filter already exists under some other category/sub/sub_sub category!"
                                        }
                                    });
                                }
                                else {
                                    updateOps['FILTER_ID'] = fil_id.toLowerCase();
                                    updateOps['FILTER_CATEGORY_NAME'] = fil_type.toLowerCase();
                                    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                                    updateOps['UPDATED_DATE'] = new Date();
                                    updateRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                                    updateRes['UPDATED_DATE'] = new Date();

                                    Filters.update({_id: docs.FILTER_ID._id}, {$set: updateOps})
                                        .exec()
                                        .then(result => {

                                            Subcategory.findById(sub_cat_id)
                                                .select('PRODUCT_CATEGORY_ID _id ACTIVE_FLAG')
                                                .populate('PRODUCT_CATEGORY_ID')
                                                .exec()
                                                .then(sub_cat_res => {

                                                    updateOps1['CATEGORY_ID'] = sub_cat_res.PRODUCT_CATEGORY_ID._id;
                                                    updateOps1['SUB_CATEGORY_ID'] = sub_cat_id;
                                                    updateOps1['SUB_SUB_CATEGORY_ID'] = sub_sub_cat_id;
                                                    updateOps1['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                                                    updateOps1['UPDATED_DATE'] = new Date();

                                                    Filters_categories.update({_id: id}, {$set: updateOps1})
                                                        .exec()
                                                        .then(result_1 => {

                                                            Filter_options.update({FILTER_ID: docs.FILTER_ID._id}, {$set: updateOps1}, {multi: true})
                                                                .exec()
                                                                .then(result_2 => {
                                                                    Filter_prod_con.update({FILTER_ID: docs.FILTER_ID._id}, {$set: updateRes}, {multi: true})
                                                                        .exec()
                                                                        .then(result3 => {
                                                                            res.status(201).json({
                                                                                status: "success",
                                                                                data: {
                                                                                    message: "filter, filter sub category connection and dependencies updated"
                                                                                }
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
                                                                }).catch(err => {
                                                                res.status(500).json({
                                                                    status: "error",
                                                                    error: err,
                                                                    data: {
                                                                        message: "Internal server error!"
                                                                    }
                                                                });
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
        Filters_categories.findById(id)
            .select('_id')
            .populate('FILTER_ID')
            .exec()
            .then(docs => {
                Filters.find({FILTER_CATEGORY_NAME: fil_type})
                    .select('_id')
                    .exec()
                    .then(fil_res => {
                        if (fil_res.length > 0 && fil_type!=docs.FILTER_ID.FILTER_CATEGORY_NAME)
                        {
                            res.status(500).json({
                                status: "error",
                                data: {
                                    message: "Filter already exists under some other category/sub/sub_sub category!"
                                }
                            });
                        }
                        else
                        {
                            updateOps['FILTER_ID'] = fil_id.toLowerCase();
                            updateOps['FILTER_CATEGORY_NAME'] = fil_type.toLowerCase();
                            updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                            updateOps['UPDATED_DATE'] = new Date();
                            updateRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                            updateRes['UPDATED_DATE'] = new Date();

                            Filters.update({ _id: docs.FILTER_ID._id }, { $set: updateOps })
                                .exec()
                                .then(result => {

                                    Subsubcategory.findById(sub_sub_cat_id)
                                        .select('_id ACTIVE_FLAG')
                                        .populate('CATEGORY_ID')
                                        .populate('SUB_CATEGORY_ID')
                                        .exec()
                                        .then(sub_sub_cat_res=> {

                                            updateOps1['CATEGORY_ID'] = sub_sub_cat_res.CATEGORY_ID._id;
                                            updateOps1['SUB_CATEGORY_ID'] = sub_sub_cat_res.SUB_CATEGORY_ID._id;
                                            updateOps1['SUB_SUB_CATEGORY_ID'] = sub_sub_cat_id;
                                            updateOps1['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                                            updateOps1['UPDATED_DATE'] = new Date();

                                            Filters_categories.update({ _id: id }, { $set: updateOps1 })
                                                .exec()
                                                .then(result_2 => {
                                                    Filter_options.update({ FILTER_ID: docs.FILTER_ID._id }, { $set: updateOps1 },{multi: true})
                                                        .exec()
                                                        .then(result_2 => {
                                                            Filter_prod_con.update({ FILTER_ID: docs.FILTER_ID._id }, { $set: updateRes },{multi: true})
                                                                .exec()
                                                                .then(result3 => {
                                                                    res.status(201).json({
                                                                        status: "success",
                                                                        data: {
                                                                            message: "filter, filter sub sub category connection and dependencies updated"
                                                                        }
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
                                                        }).catch(err => {
                                                        res.status(500).json({
                                                            status: "error",
                                                            error: err,
                                                            data: {
                                                                message: "Internal server error!"
                                                            }
                                                        });
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
            })
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

//delete a filter category connection by id
exports.filters_categories_conn_delete = (req, res, next) => {
    const id = req.params.filtercategoryId;
    Filters_categories.findById(id)
        .select('FILTER_ID ACTIVE_FLAG _id')
        .exec()
        .then(res1 =>{
            var fil_id = res1.FILTER_ID;
            Filters_categories.remove({ _id: id })
                .exec()
                .then(result => {
                    Filter_options.remove({FILTER_ID: fil_id})
                        .exec()
                        .then(res2 => {
                            Filter_prod_con.remove({FILTER_ID: fil_id})
                                .exec()
                                .then(res3 => {
                                    Filters.remove({_id: fil_id})
                                        .exec()
                                        .then(res4 => {
                                            res.status(200).json({
                                                status: "success",
                                                data: {
                                                    message: 'filter category connection deleted'
                                                }
                                            });
                                        }).catch(err => {
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
                                }).catch(err => {
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
                        }).catch(err => {
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
        })
};

//get all filter category connection details
exports.filters_categories_conn_get_all = (req, res, next) => {
    Filters_categories.find()
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('FILTER_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID',null)
        .populate('SUB_SUB_CATEGORY_ID',null)
        .exec()
        .then(doc => {
            if(doc.length > 0)
            {


                const response = {
                    filter_category_details: doc.map(docs => {
                        var sub_cat_doc_id ="";
                        var sub_category_id = "";
                        var sub_category_name = "";
                        var sub_sub_cat_doc_id = "";
                        var sub_sub_category_id = "";
                        var sub_sub_category_name = "";

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
                            fil_cat_connection_id: docs._id,
                            filter_doc_id: docs.FILTER_ID._id,
                            filter_id: docs.FILTER_ID.FILTER_ID,
                            filter_type: docs.FILTER_ID.FILTER_CATEGORY_NAME,
                            cat_doc_id: docs.CATEGORY_ID._id,
                            category_id: docs.CATEGORY_ID.CATEGORY_ID,
                            category_name: docs.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            sub_cat_doc_id : sub_cat_doc_id,
                            sub_category_id:  sub_category_id,
                            sub_category_name:  sub_category_name,
                            sub_sub_cat_doc_id: sub_sub_cat_doc_id,
                            sub_sub_category_id:sub_sub_category_id,
                            sub_sub_category_nm: sub_sub_category_name
                        };
                    })
                };

                res.status(200).json({
                    status:"success",
                    error_msg:"",
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
                        message: "No filter category connections found"
                    }
                });
            }

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