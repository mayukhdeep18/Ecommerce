const mongoose = require("mongoose");
const changeCase = require('change-case');
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

//get all active categories
exports.category_get_all = (req, res, next) => {
    Category.find()
        .select('CATEGORY_ID PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {

            if(docs.length > 0)
            {
                const response = {
                    //count: docs.length,
                    categories: docs.map(doc => {
                        return {
                            category_id: doc.CATEGORY_ID,
                            category_name: doc.PRODUCT_CATEGORY_NAME,
                            category_description: doc.PRODUCT_CATEGORY_DESCRIPTION,
                            updated_by: doc.UPDATED_BY,
                            updated_date: doc.UPDATED_DATE,
                            active_flag: doc.ACTIVE_FLAG,
                            doc_id: doc._id
                        };
                    })
                };
                // if (docs.length >= 0) {
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
                    status:"error",
                    data: {
                        message: 'No details found for category'
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:{
                    message: "Internal server error"
                }
            });
        });
};

//create a new category
exports.category_create_category = (req, res, next) =>{

    var Cat_id = req.body.PRODUCT_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    //console.log("check",Category.find({CATEGORY_ID: Cat_id.toLowerCase()}));

    if(Cat_id.length >0)
    {
        Category.find({CATEGORY_ID: Cat_id.toLowerCase()})
        .select('_id')
        .exec()
        .then(doc => {
            if (doc.length > 0)
            {
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Category already exists!"
                    }
                });
            }
            else {
                const category = new Category({
                    _id: new mongoose.Types.ObjectId(),
                    CATEGORY_ID: Cat_id.toLowerCase(),
                    PRODUCT_CATEGORY_NAME: req.body.PRODUCT_CATEGORY_NAME.toLowerCase(),
                    PRODUCT_CATEGORY_DESCRIPTION: req.body.PRODUCT_CATEGORY_DESCRIPTION.toLowerCase(),
                    UPDATED_BY: req.body.UPDATED_BY,
                    UPDATED_DATE: new Date(),
                    ACTIVE_FLAG: req.body.ACTIVE_FLAG
                });
                category
                    .save()
                    .then(result => {
                        res.status(201).json({
                            status: "success",
                            data: {
                                message: "Created category successfully"
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
        res.status(500).json({
            status: "error",
            data: {
                message: "Please check all your fields!"
            }
        });
    }
};

//get category by id
exports.category_get_category = (req, res, next) =>{
    const id = req.params.categoryId;
    Category.find({CATEGORY_ID:id})
        .select('CATEGORY_ID PRODUCT_CATEGORY_NAME PRODUCT_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            if (doc) {
                const response = {
                    //count: docs.length,
                    categories: doc.map(doc => {
                        return {
                            category_id: doc.CATEGORY_ID,
                            category_name: doc.PRODUCT_CATEGORY_NAME,
                            category_description: doc.PRODUCT_CATEGORY_DESCRIPTION,
                            updated_by: doc.UPDATED_BY,
                            updated_date: doc.UPDATED_DATE,
                            active_flag: doc.ACTIVE_FLAG,
                            doc_id: doc._id
                        };
                    })
                };
                // if (docs.length >= 0) {
                res.status(200).json({
                    status:"success",
                    data: {
                        response
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        data: {
                            message: "No valid entry found for provided category"
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

//update category details by id
exports.category_update_category = (req, res, next) =>{
    const id = req.params.categoryId;
    var Cat_id = req.body.PRODUCT_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    const updateOps = {};
    const updateRes = {};

    updateOps['PRODUCT_CATEGORY_NAME'] = req.body.PRODUCT_CATEGORY_NAME;
    updateOps['PRODUCT_CATEGORY_DESCRIPTION']= req.body.PRODUCT_CATEGORY_DESCRIPTION;
    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateOps['UPDATED_DATE'] = new Date();
    updateOps['CATEGORY_ID'] = Cat_id.toLowerCase();
    updateRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateRes['UPDATED_DATE'] = new Date();

    var prod_arr = {};
    var fil_arr = {};
    Product.find({PRODUCT_CATEGORY_ID: id})
        .select('PRODUCT_ID ACTIVE_FLAG _id')
        .exec()
        .then(res1 => {
            if(res1.length > 0)
            {
                for(var item of res1)
                {
                    prod_arr.push(item._id);
                }
                Filcat.find({CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.update({PRODUCT_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.update({CATEGORY_ID: id},{$set: updateRes})
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
                                                                                                            SubSubCategory.update({ CATEGORY_ID: id }, { $set: updateRes })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.update({CATEGORY_ID: id},{$set: updateRes})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            Category.update({_id: id},{$set: updateOps})
                                                                                                                                .exec()
                                                                                                                                .then(res12 => {
                                                                                                                                    res.status(200).json({
                                                                                                                                        status: "success",
                                                                                                                                        data: {
                                                                                                                                            message: 'category updated'
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
                            Product.update({PRODUCT_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({CATEGORY_ID: id},{$set: updateRes})
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
                                                                            SubSubCategory.update({ CATEGORY_ID: id }, { $set: updateRes })
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.update({CATEGORY_ID: id},{$set: updateRes})
                                                                                        .exec()
                                                                                        .then(res11 => {
                                                                                            Category.update({_id: id},{$set: updateOps})
                                                                                                .exec()
                                                                                                .then(res12 => {
                                                                                                    res.status(200).json({
                                                                                                        status: "success",
                                                                                                        data: {
                                                                                                            message: 'category updated'
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
                Filcat.find({CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.update({PRODUCT_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.update({CATEGORY_ID: id},{$set: updateRes})
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
                                                                                                            SubSubCategory.update({ CATEGORY_ID: id }, { $set: updateRes })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.update({CATEGORY_ID: id},{$set: updateRes})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            Category.update({_id: id},{$set: updateOps})
                                                                                                                                .exec()
                                                                                                                                .then(res12 => {
                                                                                                                                    res.status(200).json({
                                                                                                                                        status: "success",
                                                                                                                                        data: {
                                                                                                                                            message: 'category updated'
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
                            Product.update({PRODUCT_CATEGORY_ID: id},{$set: updateRes})
                                .exec()
                                .then(res3 => {
                                    EcommProd.update({CATEGORY_ID: id},{$set: updateRes})
                                        .exec()
                                        .then(res4 => {
                                                                            SubSubCategory.update({ CATEGORY_ID: id }, { $set: updateRes })
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.update({CATEGORY_ID: id},{$set: updateRes})
                                                                                        .exec()
                                                                                        .then(res11 => {
                                                                                            Category.update({_id: id},{$set: updateOps})
                                                                                                .exec()
                                                                                                .then(res12 => {
                                                                                                    res.status(200).json({
                                                                                                        status: "success",
                                                                                                        data: {
                                                                                                            message: 'category updated'
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

//delete a category by id
exports.category_delete = (req, res, next) =>{
    const id = req.params.categoryId;
    Product.find({PRODUCT_CATEGORY_ID: id})
        .select('PRODUCT_ID ACTIVE_FLAG _id')
        .exec()
        .then(res1 => {
            if(res1.length > 0)
            {
                for(var item of res1)
                {
                    prod_arr.push(item._id);
                }
                Filcat.find({CATEGORY_ID: id})
                    .select('FILTER_ID _id')
                    .exec()
                    .then(res2 => {
                        if(res2.length > 0)
                        {
                            for(var item2 of res2)
                            {
                                fil_arr.push(item2.FILTER_ID);
                            }
                            Product.remove({PRODUCT_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.remove({CATEGORY_ID: id})
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
                                                                                                            SubSubCategory.remove({ CATEGORY_ID: id })
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.remove({CATEGORY_ID: id})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            Category.remove({_id: id})
                                                                                                                                .exec()
                                                                                                                                .then(res12 => {
                                                                                                                                    res.status(200).json({
                                                                                                                                        status: "success",
                                                                                                                                        data: {
                                                                                                                                            message: 'category and all dependencies deleted'
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
                            Product.remove({PRODUCT_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({CATEGORY_ID: id})
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
                                                                            SubSubCategory.remove({CATEGORY_ID: id})
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.remove({CATEGORY_ID: id})
                                                                                        .exec()
                                                                                        .then(res11 => {
                                                                                            Category.remove({_id: id})
                                                                                            res.status(200).json({
                                                                                                status: "success",
                                                                                                data: {
                                                                                                    message: 'category and all dependencies deleted'
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
                            Product.remove({PRODUCT_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {
                                            Filcat.remove({CATEGORY_ID: id})
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
                                                                                                            SubSubCategory.remove({CATEGORY_ID: id})
                                                                                                                .exec()
                                                                                                                .then(result => {
                                                                                                                    Subcategory.remove({CATEGORY_ID: id})
                                                                                                                        .exec()
                                                                                                                        .then(res11 => {
                                                                                                                            Category.remove({_id: id})
                                                                                                                                .exec()
                                                                                                                                .then(res12 => {
                                                                                                                                    res.status(200).json({
                                                                                                                                        status: "success",
                                                                                                                                        data: {
                                                                                                                                            message: 'subcategory and all dependencies deleted'
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
                                })
                        }
                        else {
                            Product.remove({PRODUCT_CATEGORY_ID: id})
                                .exec()
                                .then(res3 => {
                                    EcommProd.remove({CATEGORY_ID: id})
                                        .exec()
                                        .then(res4 => {

                                                                            SubSubCategory.remove({CATEGORY_ID: id})
                                                                                .exec()
                                                                                .then(result => {
                                                                                    Subcategory.remove({CATEGORY_ID: id})
                                                                                        .exec()
                                                                                        .then(res11 => {
                                                                                            Category.remove({_id: id})
                                                                                                .exec()
                                                                                                .then(res12 => {
                                                                                                    res.status(200).json({
                                                                                                        status: "success",
                                                                                                        data: {
                                                                                                            message: 'subcategory and all dependencies deleted'
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

