const mongoose = require("mongoose");
const Subcategory = require("../models/subcategory");
const Category = require("../models/category");
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

//get all active subcategory details
exports.subcategory_get_all = (req, res, next) => {
    Subcategory.find()
        .select("SUB_CATEGORY_ID PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                const response = {
                    //count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            doc_id: doc._id,
                            sub_category_id: doc.SUB_CATEGORY_ID,
                            category_name: doc.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            sub_category_name: doc.PRODUCT_SUB_CATEGORY_NAME,
                            sub_category_description: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                            updated_by: doc.UPDATED_BY,
                            updated_date: doc.UPDATED_DATE,
                            active_flag: doc.ACTIVE_FLAG
                        };
                    })
                };
                res.status(200).json({
                    status: "success",
                    error: "",
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
                        message: "No sub category found"
                    }
                });
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error!"
                }
            });
        });
};

//create a new subcategory
exports.subcategory_create = (req, res, next) => {

    var Sub_id = req.body.PRODUCT_SUB_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    if(Sub_id.length > 0)
    {
        Subcategory.find({SUB_CATEGORY_ID: Sub_id.toLowerCase()})
            .select('_id')
            .exec()
            .then(doc => {
                if(doc.length >0)
                {
                    res.status(404)
                        .json({
                            status: "error",
                            data: {
                                message: "Sub category already exists!"
                            }
                        });
                }
                else{
                    if(
                        Category.findById(req.body.PRODUCT_CATEGORY_ID)
                    )
                    {
                        const subcategory = new Subcategory({
                            _id: new mongoose.Types.ObjectId(),
                            SUB_CATEGORY_ID: Sub_id.toLowerCase(),
                            PRODUCT_CATEGORY_ID: req.body.PRODUCT_CATEGORY_ID,
                            PRODUCT_SUB_CATEGORY_NAME: req.body.PRODUCT_SUB_CATEGORY_NAME.toLowerCase(),
                            PRODUCT_SUB_CATEGORY_DESCRIPTION: req.body.PRODUCT_SUB_CATEGORY_DESCRIPTION.toLowerCase(),
                            UPDATED_BY: req.body.UPDATED_BY,
                            UPDATED_DATE: new Date(),
                            ACTIVE_FLAG: req.body.ACTIVE_FLAG
                        });
                        subcategory
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    status: "success",
                                    data: {
                                        message: "Sub category details stored"
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
                                    message: "Category does not exist!"
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
    else {
        res
            .status(500)
            .json({
                status: "error",
                data: {
                    message: "Please check all your fields!"
                }
            });
    }
};

//get subcategory details by id
exports.subcategory_get_subcategory = (req, res, next) => {
    const id = req.params.subcategoryId;
    Subcategory.find({SUB_CATEGORY_ID:id})
        .select("SUB_CATEGORY_ID PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                const response = {
                    //count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            doc_id: doc._id,
                            sub_category_id: doc.SUB_CATEGORY_ID,
                            category_name: doc.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            sub_category_name: doc.PRODUCT_SUB_CATEGORY_NAME,
                            sub_category_description: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                            updated_by: doc.UPDATED_BY,
                            updated_date: doc.UPDATED_DATE,
                            active_flag: doc.ACTIVE_FLAG
                        };
                    })
                };
                res.status(200).json({
                    status: "success",
                    error: "",
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
                        message: "No sub category found"
                    }
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error"
                }
            });
        });
};


//update sub subcategory details by id
exports.subcategory_update = (req, res, next) => {
    const id = req.params.subcategoryId;
    var Sub_sub_id = req.body.SUB_SUB_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    const updateOps = {};
    const updateRes = {};

    //updateOps['CATEGORY_ID'] = req.body.CATEGORY_ID;
    //updateOps['SUB_CATEGORY_ID'] = req.body.SUB_CATEGORY_ID;
    updateOps['PRODUCT_SUB_CATEGORY_NAME'] = req.body.SUB_SUB_CATEGORY_NAME;
    updateOps['PRODUCT_SUB_CATEGORY_DESCRIPTION']= req.body.SUB_SUB_CATEGORY_DESCRIPTION;
    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateOps['UPDATED_DATE'] = new Date();
    updateOps['SUB_CATEGORY_ID'] = Sub_sub_id.toLowerCase();
    updateRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateRes['UPDATED_DATE'] = new Date();

    var prod_arr = {};
    var fil_arr = {};
    Product.find({PRODUCT_SUB_CATEGORY_ID: id})
        .select('PRODUCT_ID ACTIVE_FLAG _id')
        .exec()
        .then(res1 => {
            if(res1.length > 0)
            {
                for(var item of res1)
                {
                    prod_arr.push(item._id);
                }
                Filcat.find({SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.update({PRODUCT_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.update({SUB_CATEGORY_ID: id},{$set: updateRes})
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
                                                                                                            SubSubCategory.update({ SUB_CATEGORY_ID: id }, { $set: updateRes })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.update({_id: id},{$set: updateOps})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            res.status(200).json({
                                                                                                                                status: "success",
                                                                                                                                data: {
                                                                                                                                    message: 'sub subcategory updated'
                                                                                                                                }
                                                                                                                            });
                                                                                                                        }).catch(err => {
                                                                                                                        console.log(err);
                                                                                                                        res.status(500).json({
                                                                                                                            status: "error",
                                                                                                                            error: err,
                                                                                                                            data: {
                                                                                                                                message: "Internal server error"
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
                            Product.update({PRODUCT_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_CATEGORY_ID: id},{$set: updateRes})
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
                                                                            SubSubCategory.update({ SUB_CATEGORY_ID: id }, { $set: updateRes })
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.update({_id: id},{$set: updateOps})
                                                                                        .exec()
                                                                                        .then(res11 => {
                                                                                            res.status(200).json({
                                                                                                status: "success",
                                                                                                data: {
                                                                                                    message: 'sub subcategory updated'
                                                                                                }
                                                                                            });
                                                                                        }).catch(err => {
                                                                                        console.log(err);
                                                                                        res.status(500).json({
                                                                                            status: "error",
                                                                                            error: err,
                                                                                            data: {
                                                                                                message: "Internal server error"
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
                Filcat.find({SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.update({PRODUCT_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.update({SUB_CATEGORY_ID: id},{$set: updateRes})
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
                                                                            Rating.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
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
                                                                                                            SubSubCategory.update({ SUB_CATEGORY_ID: id }, { $set: updateRes })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.update({_id: id},{$set: updateOps})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            res.status(200).json({
                                                                                                                                status: "success",
                                                                                                                                data: {
                                                                                                                                    message: 'subcategory updated'
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
                            Product.update({PRODUCT_SUB_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({SUB_CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Rating.update({PRODUCT_ID: {$in: prod_arr}},{$set: updateRes})
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
                                                                            SubSubCategory.update({ SUB_CATEGORY_ID: id }, { $set: updateRes })
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.update({_id: id},{$set: updateOps})
                                                                                        .exec()
                                                                                        .then(res11 => {
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
exports.subcategory_delete = (req, res, next) => {
    const id = req.params.subcategoryId;
    var prod_arr = {};
    var fil_arr = {};
    Product.find({PRODUCT_SUB_CATEGORY_ID: id})
        .select('PRODUCT_ID ACTIVE_FLAG _id')
        .exec()
        .then(res1 => {
            if(res1.length > 0)
            {
                for(var item of res1)
                {
                    prod_arr.push(item._id);
                }
                Filcat.find({SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.remove({PRODUCT_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.remove({SUB_CATEGORY_ID: id})
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
                                                                                                            SubSubCategory.remove({ SUB_CATEGORY_ID: id })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.remove({_id: id})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            res.status(200).json({
                                                                                                                                status: "success",
                                                                                                                                data: {
                                                                                                                                    message: 'subcategory and all dependencies deleted'
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
                            Product.remove({PRODUCT_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_CATEGORY_ID: id})
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
                                                                            SubSubCategory.remove({SUB_CATEGORY_ID: id})
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.remove({_id: id})
                                                                                        .exec()
                                                                                        .then(res11 => {
                                                                                            res.status(200).json({
                                                                                                status: "success",
                                                                                                data: {
                                                                                                    message: 'subcategory and all dependencies deleted'
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
                Filcat.find({SUB_CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0) {
                            for (var item2 of res2) {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.remove({PRODUCT_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.remove({SUB_CATEGORY_ID: id})
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
                                                                                                            SubSubCategory.remove({SUB_CATEGORY_ID: id})
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.remove({_id: id})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            res.status(200).json({
                                                                                                                                status: "success",
                                                                                                                                data: {
                                                                                                                                    message: 'subcategory and all dependencies deleted'
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
                                })
                        }
                        else {
                            Product.remove({PRODUCT_SUB_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({SUB_CATEGORY_ID: id})
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
                                                                            SubSubCategory.remove({SUB_CATEGORY_ID: id})
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.remove({_id: id})
                                                                                        .exec()
                                                                                        .then(res11 => {
                                                                                            res.status(200).json({
                                                                                                status: "success",
                                                                                                data: {
                                                                                                    message: 'subcategory and all dependencies deleted'
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
