const mongoose = require("mongoose");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const SubSubCategory = require("../models/subsubcategory");
const Product = require("../models/product_details");
const EcommProd = require("../models/ecommerce_product_details");
const Filters = require("../models/filters");
const Filcat = require("../models/filters_categories");
const Filval = require("../models/filter_options");
const Filprod = require("../models/filter_options_products");
const Rating = require("../models/rating_details");
const Review = require("../models/review_details");
const HotDeals = require("../models/hot_deals");
const TrendDeals = require("../models/trending_products");

//get all active sub subcategory details
exports.subsubcategory_get_all = (req, res, next) => {
    SubSubCategory.find()
        .select("SUB_SUB_CATEGORY_ID CATEGORY_ID SUB_CATEGORY_ID SUB_SUB_CATEGORY_NAME SUB_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0) {
                const response = {
                    //count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            doc_id: doc._id,
                            sub_sub_category_id: doc.SUB_SUB_CATEGORY_ID,
                            category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            sub_category_name: doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                            sub_sub_category_name: doc.SUB_SUB_CATEGORY_NAME,
                            sub_sub_category_description: doc.SUB_SUB_CATEGORY_DESCRIPTION,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
                };

                res.status(200).json({
                    status: "success",
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
                        message: "No sub sub categories found"
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

//create a new sub subcategory
exports.subsubcategory_create = (req, res, next) => {

    var Sub_sub_id = req.body.SUB_SUB_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    if(Sub_sub_id.length > 0)
    {
        SubSubCategory.find({SUB_SUB_CATEGORY_ID: Sub_sub_id.toLowerCase()})
            .select('_id')
            .exec()
            .then(doc => {
                if(doc.length > 0)
                {
                    res.status(404)
                        .json({
                            status: "error",
                            data: {
                                message: "Sub Sub category already exists"
                            }
                        });
                }
                else {
                    if(Category.findById(req.body.CATEGORY_ID) && Subcategory.findById(req.body.SUB_CATEGORY_ID))
                    {
                        const subsubcategory = new SubSubCategory({
                            _id: new mongoose.Types.ObjectId(),
                            SUB_SUB_CATEGORY_ID: Sub_sub_id.toLowerCase(),
                            CATEGORY_ID: req.body.CATEGORY_ID,
                            SUB_CATEGORY_ID: req.body.SUB_CATEGORY_ID,
                            SUB_SUB_CATEGORY_NAME: req.body.SUB_SUB_CATEGORY_NAME.toLowerCase(),
                            SUB_SUB_CATEGORY_DESCRIPTION: req.body.SUB_SUB_CATEGORY_DESCRIPTION.toLowerCase(),
                            UPDATED_BY: req.body.UPDATED_BY,
                            UPDATED_DATE: new Date(),
                            ACTIVE_FLAG: req.body.ACTIVE_FLAG
                        });
                        subsubcategory
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    status: "success",
                                    data: {
                                        message: "Sub Sub category stored"
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

                    }
                    else {
                        res
                            .status(404)
                            .json({
                                status: "error",
                                data: {
                                    message: "Category or subcategory does not exist"
                                }
                            });
                    }
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

//get sub subcategory details by id
exports.subsubcategory_get_subsubcategory = (req, res, next) => {
    const id = req.params.subsubcategoryId;
    SubSubCategory.find({SUB_SUB_CATEGORY_ID:id})
        .select("SUB_SUB_CATEGORY_ID CATEGORY_ID SUB_CATEGORY_ID SUB_SUB_CATEGORY_NAME SUB_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0) {
                const response = {
                    //count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            doc_id: doc._id,
                            sub_sub_category_id: doc.SUB_SUB_CATEGORY_ID,
                            category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            sub_category_name: doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                            sub_sub_category_name: doc.SUB_SUB_CATEGORY_NAME,
                            sub_sub_category_description: doc.SUB_SUB_CATEGORY_DESCRIPTION,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
                };

                res.status(200).json({
                    status: "success",
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
                        message: "No sub sub categories found"
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

//update sub subcategory details by id
exports.subsubcategory_update = (req, res, next) => {
    const id = req.params.subsubcategoryId;
    var Sub_sub_id = req.body.SUB_SUB_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    const updateOps = {};
    const updateRes = {};

    //updateOps['CATEGORY_ID'] = req.body.CATEGORY_ID;
    //updateOps['SUB_CATEGORY_ID'] = req.body.SUB_CATEGORY_ID;
    updateOps['SUB_SUB_CATEGORY_NAME'] = req.body.SUB_SUB_CATEGORY_NAME;
    updateOps['SUB_SUB_CATEGORY_DESCRIPTION']= req.body.SUB_SUB_CATEGORY_DESCRIPTION;
    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateOps['UPDATED_DATE'] = new Date();
    updateOps['SUB_SUB_CATEGORY_ID'] = Sub_sub_id.toLowerCase();
    updateRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateRes['UPDATED_DATE'] = new Date();

    var prod_arr = {};
    var fil_arr = {};
    Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: id})
        .select('PRODUCT_ID ACTIVE_FLAG _id')
        .exec()
        .then(res1 => {
            if(res1.length > 0)
            {
                for(var item of res1)
                {
                    prod_arr.push(item._id);
                }
                Filcat.find({SUB_SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.update({PRODUCT_SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.update({SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                                .exec()
                                                .then(res5 => {
                                                    Filters.update({_id: {$in: fil_arr}},{$set: updateRes})
                                                        .exec()
                                                        .then(res6 => {
                                                            Filval.update({FILTER_ID: {$in: fil_arr}},{$set: updateRes})
                                                                .exec()
                                                                .then(res7 => {
                                                                    Filprod.update({FILTER_ID: {$in: fil_arr}},{$set: updateRes})
                                                                        .exec()
                                                                        .then(res8 => {
                                                                            Rating.update({PRODUCT_ID: {$in: {prod_arr}}},{$set: updateRes})
                                                                                .exec()
                                                                                .then(res7 => {
                                                                                    Review.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
                                                                                        .exec()
                                                                                        .then(res8 => {
                                                                                            HotDeals.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
                                                                                                .exec()
                                                                                                .then(res9 => {
                                                                                                    TrendDeals.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
                                                                                                        .exec()
                                                                                                        .then(res10 => {
                                                                                                            SubSubCategory.update({ _id: id }, { $set: updateOps })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    res.status(200).json({
                                                                                                                        status: "success",
                                                                                                                        data: {
                                                                                                                            message: 'sub subcategory updated'
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
                        }
                        else {
                            Product.update({PRODUCT_SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Rating.update({PRODUCT_ID: {$in: {prod_arr}}},{$set: updateRes})
                                                .exec()
                                                .then(res7 => {
                                                    Review.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
                                                        .exec()
                                                        .then(res8 => {
                                                            HotDeals.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
                                                                .exec()
                                                                .then(res9 => {
                                                                    TrendDeals.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
                                                                        .exec()
                                                                        .then(res10 => {
                                                                            SubSubCategory.update({ _id: id }, { $set: updateOps })
                                                                                .exec()
                                                                                .then(result => {
                                                                                    res.status(200).json({
                                                                                        status: "success",
                                                                                        data: {
                                                                                            message: 'sub subcategory updated'
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
                        }
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
            }
            else
            {
                Filcat.find({SUB_SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.update({PRODUCT_SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.update({SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                                .exec()
                                                .then(res5 => {
                                                    Filters.update({_id: {$in: fil_arr}},{$set: updateRes})
                                                        .exec()
                                                        .then(res6 => {
                                                            Filval.update({FILTER_ID: {$in: fil_arr}},{$set: updateRes})
                                                                .exec()
                                                                .then(res7 => {
                                                                    Filprod.update({FILTER_ID: {$in: fil_arr}},{$set: updateRes})
                                                                        .exec()
                                                                        .then(res8 => {
                                                                                                            SubSubCategory.update({ _id: id }, { $set: updateOps })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    res.status(200).json({
                                                                                                                        status: "success",
                                                                                                                        data: {
                                                                                                                            message: 'sub subcategory updated'
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
                        }
                        else {
                            Product.update({PRODUCT_SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_SUB_CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                                                            SubSubCategory.update({ _id: id }, { $set: updateOps })
                                                                                .exec()
                                                                                .then(result => {
                                                                                    res.status(200).json({
                                                                                        status: "success",
                                                                                        data: {
                                                                                            message: 'sub subcategory updated'
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
                        }
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
            }
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
};

//delete a sub subcategory by id
exports.subsubcategory_delete = (req, res, next) => {
    const id = req.params.subsubcategoryId;
    var prod_arr = {};
    var fil_arr = {};
    Product.find({PRODUCT_SUB_SUB_CATEGORY_ID: id})
        .select('PRODUCT_ID ACTIVE_FLAG _id')
        .exec()
        .then(res1 => {
            if(res1.length > 0)
            {
                for(var item of res1)
                {
                    prod_arr.push(item._id);
                }
                Filcat.find({SUB_SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.remove({PRODUCT_SUB_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_SUB_CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.remove({SUB_SUB_CATEGORY_ID: id})
                                                .exec()
                                                .then(res5 => {
                                                    Filters.remove({_id: {$in: fil_arr}})
                                                        .exec()
                                                        .then(res6 => {
                                                            Filval.remove({FILTER_ID: {$in: fil_arr}})
                                                                .exec()
                                                                .then(res7 => {
                                                                    Filprod.remove({FILTER_ID: {$in: fil_arr}})
                                                                        .exec()
                                                                        .then(res8 => {
                                                                            Rating.remove({PRODUCT_ID: {$in: {prod_arr}}})
                                                                                .exec()
                                                                                .then(res7 => {
                                                                                    Review.remove({PRODUCT_ID: {$in: prod_arr}})
                                                                                        .exec()
                                                                                        .then(res8 => {
                                                                                            HotDeals.remove({PRODUCT_ID: {$in: prod_arr}})
                                                                                                .exec()
                                                                                                .then(res9 => {
                                                                                                    TrendDeals.remove({PRODUCT_ID: {$in: prod_arr}})
                                                                                                        .exec()
                                                                                                        .then(res10 => {
                                                                                                            SubSubCategory.remove({ _id: id })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    res.status(200).json({
                                                                                                                        status: "success",
                                                                                                                        data: {
                                                                                                                            message: 'sub subcategory and all dependencies deleted'
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
                        }
                        else {
                            Product.remove({PRODUCT_SUB_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_SUB_CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            Rating.remove({PRODUCT_ID: {$in: {prod_arr}}})
                                                .exec()
                                                .then(res7 => {
                                                    Review.remove({PRODUCT_ID: {$in: prod_arr}})
                                                        .exec()
                                                        .then(res8 => {
                                                            HotDeals.remove({PRODUCT_ID: {$in: prod_arr}})
                                                                .exec()
                                                                .then(res9 => {
                                                                    TrendDeals.remove({PRODUCT_ID: {$in: prod_arr}})
                                                                        .exec()
                                                                        .then(res10 => {
                                                                            SubSubCategory.remove({_id: id})
                                                                                .exec()
                                                                                .then(result => {
                                                                                    res.status(200).json({
                                                                                        status: "success",
                                                                                        data: {
                                                                                            message: 'sub subcategory and all dependencies deleted'
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
                        }
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
            }
            else
            {
                Filcat.find({SUB_SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.remove({PRODUCT_SUB_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_SUB_CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.remove({SUB_SUB_CATEGORY_ID: id})
                                                .exec()
                                                .then(res5 => {
                                                    Filters.remove({_id: {$in: fil_arr}})
                                                        .exec()
                                                        .then(res6 => {
                                                            Filval.remove({FILTER_ID: {$in: fil_arr}})
                                                                .exec()
                                                                .then(res7 => {
                                                                    Filprod.remove({FILTER_ID: {$in: fil_arr}})
                                                                        .exec()
                                                                        .then(res8 => {
                                                                                                            SubSubCategory.remove({ _id: id })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    res.status(200).json({
                                                                                                                        status: "success",
                                                                                                                        data: {
                                                                                                                            message: 'sub subcategory and all dependencies deleted'
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
                        }
                        else {
                            Product.remove({PRODUCT_SUB_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_SUB_CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                                                            SubSubCategory.remove({_id: id})
                                                                                .exec()
                                                                                .then(result => {
                                                                                    res.status(200).json({
                                                                                        status: "success",
                                                                                        data: {
                                                                                            message: 'sub subcategory and all dependencies deleted'
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
                        }
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
            }
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
};