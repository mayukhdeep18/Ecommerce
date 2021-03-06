const mongoose = require("mongoose");
const EcommCategory = require("../models/ecommerce_category");
const EcommProduct = require("../models/ecommerce_product_details");

const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const Subsubcategory = require("../models/subsubcategory");

const Product = require("../models/product_details");
const Rating = require("../models/rating_details");
const Review = require("../models/review_details");

//get all active ecommerce product details
exports.ecommproduct_get_all = (req, res, next) => {
    var perPage = 9;
    var page = req.params.page || 1;
    var ecom_arr = [];
    if( page > 0 && page < 20)
    {
        EcommProduct.find()
            .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('ECOMMERCE_CATEGORY_ID')
            .populate('PRODUCT_ID')
            .populate('CATEGORY_ID')
            .populate('SUB_CATEGORY_ID')
            .populate('SUB_SUB_CATEGORY_ID',null)
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .sort({UPDATED_DATE: -1, MEAN_RATING: -1, PRODUCT_PRICE: 1})
            .exec()
            .then(doc => {

                EcommProduct.count()
                    .exec()
                    .then(count => {
                        if(doc.length > 0)
                        {
                            for(var item of doc)
                            {
                                var product_sub_sub_category_name;
                                var product_sub_sub_category_id ;
                                if(item.SUB_SUB_CATEGORY_ID !=null)
                                {
                                    product_sub_sub_category_name = item.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                                    product_sub_sub_category_id = item.SUB_SUB_CATEGORY_ID._id;
                                }
                                ecom_arr.push({
                                    ecommerce_product_details_id: item._id,
                                    ecommerce_category_id: item.ECOMMERCE_CATEGORY_ID._id,
                                    ecommerce_category_details: item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                    product_category_id: item.CATEGORY_ID._id,
                                    product_category_name: item.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                    product_sub_category_id: item.SUB_CATEGORY_ID._id,
                                    product_sub_category_name: item.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                    product_sub_sub_category_id: product_sub_sub_category_id,
                                    product_sub_sub_category_name: product_sub_sub_category_name,
                                    ecommerce_product_name: item.ECOMMERCE_PRODUCT_NAME,
                                    ecommerce_product_price: item.ECOMMERCE_PRODUCT_PRICE,
                                    ecommerce_prodct_shpmnt_duratn: item.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                                    product_url: item.PRODUCT_URL,
                                    ecommerce_product_id: item.ECOMMERCE_PRODUCT_ID,
                                    product_id: item.PRODUCT_ID._id,
                                    product_specifications:JSON.parse(item.PRODUCT_ID.PRODUCT_SPECIFICATIONS),
                                    updated_by_user: item.UPDATED_BY,
                                    updated_on: item.UPDATED_DATE,
                                    isActive: item.ACTIVE_FLAG,
                                })
                            }

                            res.status(200).json({
                                status: "success",
                                data: {
                                    ecom_arr,
                                    pages: Math.ceil(count / perPage)
                                }
                            });
                        }
                        else {
                            res.status(404).json({
                                status: "error",
                                data: {
                                    message: "No ecommerce products available"
                                }
                            });
                        }

                    })
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
        res.status(500).json({
            status: "error",
            data: {
                message: "Invalid page number"
            }
        });
    }
};

//get ecommerce product details by id
exports.ecommproduct_details_get_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;

    var ecom_arr = [];

        EcommProduct.findById(id)
            .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('ECOMMERCE_CATEGORY_ID')
            .populate('PRODUCT_ID')
            .populate('CATEGORY_ID')
            .populate('SUB_CATEGORY_ID')
            .populate('SUB_SUB_CATEGORY_ID',null)
            .exec()
            .then(item => {

                        if(item != null)
                        {
                                var product_sub_sub_category_name;
                                var product_sub_sub_category_id ;
                                if(item.SUB_SUB_CATEGORY_ID !=null)
                                {
                                    product_sub_sub_category_name = item.SUB_SUB_CATEGORY_ID.SUB_SUB_CATEGORY_NAME;
                                    product_sub_sub_category_id = item.SUB_SUB_CATEGORY_ID._id;
                                }
                                ecom_arr.push({
                                    ecommerce_product_details_id: item._id,
                                    ecommerce_category_id: item.ECOMMERCE_CATEGORY_ID._id,
                                    ecommerce_category_details: item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                    product_category_id: item.CATEGORY_ID._id,
                                    product_category_name: item.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                    product_sub_category_id: item.SUB_CATEGORY_ID._id,
                                    product_sub_category_name: item.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                                    product_sub_sub_category_id: product_sub_sub_category_id,
                                    product_sub_sub_category_name: product_sub_sub_category_name,
                                    ecommerce_product_name: item.ECOMMERCE_PRODUCT_NAME,
                                    ecommerce_product_price: item.ECOMMERCE_PRODUCT_PRICE,
                                    ecommerce_prodct_shpmnt_duratn: item.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                                    product_url: item.PRODUCT_URL,
                                    ecommerce_product_id: item.ECOMMERCE_PRODUCT_ID,
                                    product_id: item.PRODUCT_ID._id,
                                    product_specifications:JSON.parse(item.PRODUCT_ID.PRODUCT_SPECIFICATIONS),
                                    updated_by_user: item.UPDATED_BY,
                                    updated_on: item.UPDATED_DATE,
                                    isActive: item.ACTIVE_FLAG,
                                })


                            res.status(200).json({
                                status: "success",
                                data: {
                                    ecom_arr
                                }
                            });
                        }
                        else {
                            res.status(404).json({
                                status: "error",
                                data: {
                                    message: "No ecommerce products available"
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


//update ecommerce product details by id - TO BE UPDATED
exports.ecommproduct_update_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    const updateOps = {};
    const updateOps_1 = {};
    var min = 0;
    var sum_rating = 0;
    var counter = 0;
    var counter_1 = 0;
    var mean_rating = 0;
    var min_name;
    var rev_cont = 0;

            EcommProduct.find({ECOMMERCE_PRODUCT_ID: id})
                .select('ECOMMERCE_PRODUCT_PRICE PRODUCT_ID')
                .populate('ECOMMERCE_CATEGORY_ID')
                .exec()
                .then(ecom_1 => {

                    var prod_id = ecom_1[0].PRODUCT_ID;
                    //console.log('prod_id',prod_id);

                    EcommProduct.find({PRODUCT_ID: prod_id, ACTIVE_FLAG: 'Y'})
                        .select('ECOMMERCE_PRODUCT_PRICE')
                        .populate('ECOMMERCE_CATEGORY_ID')
                        .exec()
                        .then(ecom_2 => {

                            for(var item of ecom_2)
                            {
                                if(item.ECOMMERCE_PRODUCT_PRICE < min || min === 0)
                                {
                                    min = item.ECOMMERCE_PRODUCT_PRICE;
                                    min_name = item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME;

                                }
                            }
                            updateOps_1['PRODUCT_PRICE'] = min;
                            updateOps_1['LEAST_PRICE_ECOMMERCE'] = min_name;

                           // console.log('min_price',min);
                           // console.log('min price name',min_name.toLocaleLowerCase());

                            Rating.find({PRODUCT_ID: prod_id, ACTIVE_FLAG: 'Y'})
                                .select("RATING_NUMBER PRODUCT_ID _id")
                                .exec()
                                .then(rating_1 => {
                                    for (var item_1 of rating_1) {
                                        sum_rating = sum_rating + item_1.RATING_NUMBER;
                                        counter_1++;
                                    }

                                   // console.log('sum of all ratings',sum_rating);
                                   // console.log('number of ratings',counter_1);

                                    if(counter_1 === 0)
                                    {
                                        updateOps_1['MEAN_RATING'] = 0;
                                        updateOps_1['RATING_COUNT'] = 0;
                                    }
                                    else{
                                        mean_rating = sum_rating / counter_1;
                                        updateOps_1['MEAN_RATING'] = mean_rating;
                                        updateOps_1['RATING_COUNT'] = counter_1;
                                    }

                                  //  console.log('mean rating',mean_rating);
                                   // console.log('number of ratings',counter_1);

                                    Review.find({PRODUCT_ID: prod_id, ACTIVE_FLAG: 'Y'})
                                        .select("ECOMMERCE_REVIEW PRODUCT_ID _id")
                                        .exec()
                                        .then(review_1 => {
                                            for (var item_2 of review_1) {
                                               var obj = JSON.parse(item_2.ECOMMERCE_REVIEW);
                                                rev_cont = rev_cont + Object.keys(obj).length;
                                            }


                                            updateOps_1['REVIEW_COUNT'] = rev_cont;
                                            //console.log('number of reviews',rev_cont);


                                            Product.update({ _id: prod_id }, {$set: updateOps_1})
                                                .exec()
                                                .then(final => {

                                                    res.status(200).json({
                                                        status: "success",
                                                        data: {
                                                            message: 'product details updated and stored'
                                                        }
                                                    });
                                                }).catch(err => {
                                                console.log(err);
                                                res.status(500).json({
                                                    status: "error",
                                                    error: err,
                                                    data: {
                                                        message: "5 Internal server error"
                                                    }
                                                });
                                            });
                                        }).catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: "failure",
                                            error: err,
                                            data: {
                                                message: "4 Internal server error"
                                            }
                                        });
                                    });
                                }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: "failure",
                                    error: err,
                                    data: {
                                        message: "3 Internal server error"
                                    }
                                });
                            });

                        }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: "failure",
                            error: err,
                            data: {
                                message: "2 Internal server error"
                            }
                        });
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "failure",
                    error: err,
                    data: {
                        message: "1 Internal server error"
                    }
                });
            });

};


//delete ecommerce product details by id
exports.ecommproduct_delete_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;

    EcommProduct.remove({ _id: id })
        .exec()
        .then(result => {
            Rating.remove({ECOMMERCE_PRODUCT_ID: id})
                .exec()
                .then(res1 => {
                    Review.remove({ECOMMERCE_PRODUCT_ID: id})
                        .exec()
                        .then(res2 => {
                            Product.update({ECOMMERCE_PRODUCT_DETAILS_ID: id},{$unset: {ECOMMERCE_PRODUCT_DETAILS_ID: 1, ECOMMERCE_CATEGORY_ID: 1}},{multi: true})
                                .exec()
                                .then(res3 => {
                                    res.status(200).json({
                                        status: "success",
                                        data: {
                                            message: 'ecommerce product and dependencies deleted'
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
};


//create a new ecommerce product detail
exports.ecommproduct_new_create = (req, res, next) => {

    var Ecom_name = req.body.ECOMMERCE_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    EcommProduct.find({ECOMMERCE_PRODUCT_ID: req.body.ECOMMERCE_PRODUCT_ID})
        .select('_id')
        .exec()
        .then(ecom_res=>{
            if(ecom_res.length >0)
            {
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Ecommerce product already exists!"
                    }
                });
            }
            else
            {
                EcommCategory.find({ECOMMERCE_ID: Ecom_name.toLowerCase()})
                    .select('ECOMMERCE_ID _id')
                    .exec()
                    .then(docs => {

                        var Ecomm_id = docs[0]._id;

                        if(Ecomm_id != null)
                        {
                            const ecommproduct = new EcommProduct({
                                _id: new mongoose.Types.ObjectId(),
                                ECOMMERCE_CATEGORY_ID: Ecomm_id,
                                ECOMMERCE_NAME: req.body.ECOMMERCE_NAME,
                                ECOMMERCE_PRODUCT_ID: req.body.ECOMMERCE_PRODUCT_ID,
                                ECOMMERCE_PRODUCT_NAME: req.body.ECOMMERCE_PRODUCT_NAME.toLowerCase(),
                                ECOMMERCE_PRODUCT_PRICE: parseFloat(req.body.ECOMMERCE_PRODUCT_PRICE),
                                ECOMMERCE_PRODCT_SHPMNT_DURATN: req.body.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                                PRODUCT_URL: req.body.PRODUCT_URL,
                                UPDATED_BY: req.body.UPDATED_BY,
                                UPDATED_DATE: new Date(),
                                ACTIVE_FLAG: req.body.ACTIVE_FLAG
                            });
                            ecommproduct
                                .save()
                                .then(result => {

                                    const rating = new Rating({
                                        _id: new mongoose.Types.ObjectId(),
                                        ECOMMERCE_PRODUCT_ID: result._id,
                                        RATING_NUMBER: req.body.RATING_NUMBER,
                                        UPDATED_BY: req.body.UPDATED_BY,
                                        UPDATED_DATE: new Date(),
                                        ACTIVE_FLAG: req.body.ACTIVE_FLAG
                                    });
                                    rating
                                        .save()
                                        .then(rat_result => {

                                            const review = new Review({
                                                _id: new mongoose.Types.ObjectId(),
                                                ECOMMERCE_PRODUCT_ID: result._id,
                                                ECOMMERCE_REVIEW: JSON.stringify(req.body.ECOMMERCE_REVIEW),
                                                UPDATED_BY: req.body.UPDATED_BY,
                                                UPDATED_DATE: new Date(),
                                                ACTIVE_FLAG: req.body.ACTIVE_FLAG
                                            });
                                            review
                                                .save()
                                                .then(rev_result => {

                                                    var Ecom_id = result._id;
                                                    var Prod_id = req.body.PRODUCT_ID;

                                                    const updateOps = {};
                                                    const Rating_upd = {};
                                                    const Review_upd = {};
                                                    const Prod_upd = {};

                                                    EcommProduct.findById({_id: result._id})
                                                        .select('ECOMMERCE_CATEGORY_ID ACTIVE_FLAG _id')
                                                        .exec()
                                                        .then(ecom_res => {

                                                            Product.findById({_id:Prod_id})
                                                                .select('PRODUCT_ID PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_ID _id')
                                                                .exec()
                                                                .then(prod_res => {

                                                                    Prod_upd['ECOMMERCE_CATEGORY_ID'] = ecom_res.ECOMMERCE_CATEGORY_ID.toString();
                                                                    Prod_upd['ECOMMERCE_PRODUCT_DETAILS_ID'] = ecom_res._id.toString();

                                                                    Product.update({ _id: Prod_id }, {$set: Prod_upd})
                                                                        .exec()
                                                                        .then(prod_update => {

                                                                            updateOps['PRODUCT_ID'] = prod_res._id.toString();
                                                                            updateOps['CATEGORY_ID'] = prod_res.PRODUCT_CATEGORY_ID.toString();
                                                                            updateOps['SUB_CATEGORY_ID'] = prod_res.PRODUCT_SUB_CATEGORY_ID.toString();
                                                                            if(prod_res.PRODUCT_SUB_SUB_CATEGORY_ID !=null)
                                                                            {
                                                                                updateOps['SUB_SUB_CATEGORY_ID'] = prod_res.PRODUCT_SUB_SUB_CATEGORY_ID.toString();
                                                                            }
                                                                            updateOps['ACTIVE_FLAG'] = 'Y';

                                                                            //console.log('ecom_upd',updateOps );
                                                                            //console.log('ecom_id', Ecom_id);

                                                                            EcommProduct.update({ _id: Ecom_id}, {$set: updateOps})
                                                                                .exec()
                                                                                .then( ecom_upd => {

                                                                                    Rating.find({ECOMMERCE_PRODUCT_ID: Ecom_id})
                                                                                        .select('ECOMMERCE_PRODUCT_ID PRODUCT_ID ACTIVE_FLAG _id')
                                                                                        .exec()
                                                                                        .then(rat_upd => {

                                                                                            Rating_upd['PRODUCT_ID'] = prod_res._id.toString();
                                                                                            Rating_upd['ACTIVE_FLAG'] = 'Y';

                                                                                            //console.log('rat_upd', Rating_upd);
                                                                                            //console.log('rat_id_upd', rat_upd[0]._id);

                                                                                            Rating.update({_id: rat_upd[0]._id},{$set:Rating_upd})
                                                                                                .exec()
                                                                                                .then(rating_upd => {

                                                                                                    Review.find({ECOMMERCE_PRODUCT_ID: Ecom_id})
                                                                                                        .select('ECOMMERCE_PRODUCT_ID PRODUCT_ID ACTIVE_FLAG _id')
                                                                                                        .exec()
                                                                                                        .then(review_upd => {
                                                                                                            Review_upd['PRODUCT_ID'] = prod_res._id.toString();
                                                                                                            Review_upd['ACTIVE_FLAG'] = 'Y';

                                                                                                            //console.log('rev_upd', Review_upd);
                                                                                                            //console.log('rev_id_upd', review_upd[0]._id);

                                                                                                            Review.update({_id: review_upd[0]._id},{$set: Review_upd})
                                                                                                                .exec()
                                                                                                                .then(rev_upd => {

                                                                                                                    res.status(201).json({
                                                                                                                        status: "success",
                                                                                                                        data: {
                                                                                                                            ECOMMERCE_PRODUCT_ID: result.ECOMMERCE_PRODUCT_ID,
                                                                                                                            message: "ecommerce details added and product mapping done"
                                                                                                                        }
                                                                                                                    });

                                                                                                                }).catch(err => {
                                                                                                                res.status(500).json({
                                                                                                                    status: "error",
                                                                                                                    error: err,
                                                                                                                    data: {
                                                                                                                        message: "7. Internal server error!"
                                                                                                                    }
                                                                                                                });
                                                                                                            });
                                                                                                        }).catch(err => {
                                                                                                        res.status(500).json({
                                                                                                            status: "error",
                                                                                                            error: err,
                                                                                                            data: {
                                                                                                                message: "6. Internal server error!"
                                                                                                            }
                                                                                                        });
                                                                                                    });

                                                                                                }).catch(err => {
                                                                                                console.log(err);
                                                                                                res.status(500).json({
                                                                                                    status: "error",
                                                                                                    error: err,
                                                                                                    data: {
                                                                                                        message: "5. Internal server error!"
                                                                                                    }
                                                                                                });
                                                                                            });
                                                                                        }).catch(err => {
                                                                                        console.log(err);
                                                                                        res.status(500).json({
                                                                                            status: "error",
                                                                                            error: err,
                                                                                            data: {
                                                                                                message: "4. Internal server error!"
                                                                                            }
                                                                                        });
                                                                                    });
                                                                                }).catch(err => {
                                                                                res.status(500).json({
                                                                                    status: "error",
                                                                                    error: err,
                                                                                    data: {
                                                                                        message: "3. Internal server error!"
                                                                                    }
                                                                                });
                                                                            });
                                                                        }).catch(err => {
                                                                        console.log(err);
                                                                        res.status(500).json({
                                                                            status: "error",
                                                                            error: err,
                                                                            data: {
                                                                                message: "2. Internal server error!"
                                                                            }
                                                                        });
                                                                    });
                                                                }).catch(err => {
                                                                console.log(err);
                                                                res.status(500).json({
                                                                    status: "error",
                                                                    error: err,
                                                                    data: {
                                                                        message: "1. Internal server error!"
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
                                        message: "Ecommerce Category does not exist. Please enter a valid ecommerce name"
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

//update ecommerce table details only
exports.ecommproduct_update_ecom_only = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    var Ecom_name = req.body.ECOMMERCE_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    const updateOps = {};
    const updatedRes = {};

    EcommCategory.find({ECOMMERCE_ID: Ecom_name.toLowerCase()})
        .select('ECOMMERCE_ID _id')
        .exec()
        .then(docs => {

            var Ecomm_id = docs[0]._id;

            if (Ecomm_id != null) {

                updateOps['ECOMMERCE_NAME'] = req.body.ECOMMERCE_NAME;
                updateOps['ECOMMERCE_PRODUCT_ID'] = req.body.ECOMMERCE_PRODUCT_ID;
                updateOps['ECOMMERCE_PRODUCT_PRICE'] = parseFloat(req.body.ECOMMERCE_PRODUCT_PRICE);
                updateOps['PRODUCT_URL'] = req.body.PRODUCT_URL;
                updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                updateOps['UPDATED_DATE'] = new Date();
                updatedRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
                updatedRes['UPDATED_DATE'] = new Date();

                EcommProduct.update({_id: id},{$set: updateOps})
                    .exec()
                    .then(result => {
                                Rating.update({ECOMMERCE_PRODUCT_ID: id},{$set: updatedRes})
                                    .exec()
                                    .then(res2 => {
                                        Review.update({ECOMMERCE_PRODUCT_ID: id},{$set: updatedRes})
                                            .exec()
                                            .then(res1 => {
                                                res.status(201).json({
                                                    status: "success",
                                                    ECOMMERCE_PRODUCT_ID: req.body.ECOMMERCE_PRODUCT_ID,
                                                    data: {
                                                        message: "Ecommerce Product details and dependencies udpated!"
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
                    res.status(404).json({
                            status: "error",
                            data: {
                                message: "Ecommerce Category does not exist. Please enter a valid ecommerce name"
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
};


//map ecommerce product and product along with ratings and reviews a new ecommerce product detail - OLD CODE, NO LONGER NEEDED
exports.ecommproduct_map = (req, res, next) => {

    var Ecom_id = req.params.Ecommerce_id;
    var Prod_id = req.body.PRODUCT_ID;

    const updateOps = {};
    const Rating_upd = {};
    const Review_upd = {};
    const Prod_upd = {};

    EcommProduct.findById({_id: Ecom_id})
        .select('ECOMMERCE_CATEGORY_ID ACTIVE_FLAG _id')
        .exec()
        .then(ecom_res => {

            Product.find({PRODUCT_ID:Prod_id})
            .select('PRODUCT_ID PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_ID _id')
            .exec()
            .then(prod_res => {

                Prod_upd['ECOMMERCE_CATEGORY_ID'] = ecom_res.ECOMMERCE_CATEGORY_ID.toString();
                Prod_upd['ECOMMERCE_PRODUCT_DETAILS_ID'] = ecom_res._id.toString();

                Product.update({ _id: prod_res[0]._id }, {$set: Prod_upd})
                    .exec()
                    .then(prod_update => {

                       updateOps['PRODUCT_ID'] = prod_res[0]._id.toString();
                       updateOps['CATEGORY_ID'] = prod_res[0].PRODUCT_CATEGORY_ID.toString();
                       updateOps['SUB_CATEGORY_ID'] = prod_res[0].PRODUCT_SUB_CATEGORY_ID.toString();
                       updateOps['SUB_SUB_CATEGORY_ID'] = prod_res[0].PRODUCT_SUB_SUB_CATEGORY_ID.toString();
                       updateOps['ACTIVE_FLAG'] = 'Y';

                       //console.log('ecom_upd',updateOps );
                       //console.log('ecom_id', Ecom_id);

                        EcommProduct.update({ _id: Ecom_id}, {$set: updateOps})
                            .exec()
                            .then( ecom_upd => {

                                Rating.find({ECOMMERCE_PRODUCT_ID: Ecom_id})
                                    .select('ECOMMERCE_PRODUCT_ID PRODUCT_ID ACTIVE_FLAG _id')
                                    .exec()
                                    .then(rat_upd => {

                                        Rating_upd['PRODUCT_ID'] = prod_res[0]._id.toString();
                                        Rating_upd['ACTIVE_FLAG'] = 'Y';

                                        //console.log('rat_upd', Rating_upd);
                                        //console.log('rat_id_upd', rat_upd[0]._id);

                                        Rating.update({_id: rat_upd[0]._id},{$set:Rating_upd})
                                            .exec()
                                            .then(rating_upd => {

                                                Review.find({ECOMMERCE_PRODUCT_ID: Ecom_id})
                                                    .select('ECOMMERCE_PRODUCT_ID PRODUCT_ID ACTIVE_FLAG _id')
                                                    .exec()
                                                    .then(review_upd => {
                                                        Review_upd['PRODUCT_ID'] = prod_res[0]._id.toString();
                                                        Review_upd['ACTIVE_FLAG'] = 'Y';

                                                        //console.log('rev_upd', Review_upd);
                                                        //console.log('rev_id_upd', review_upd[0]._id);

                                                        Review.update({_id: review_upd[0]._id},{$set: Review_upd})
                                                            .exec()
                                                            .then(rev_upd => {

                                                                res.status(201).json({
                                                                    status: "success",
                                                                    error: "",
                                                                    data: {
                                                                        message: "ecommerce product mapping done"
                                                                    }
                                                                });

                                                            }).catch(err => {
                                                            res.status(500).json({
                                                                status: "failure",
                                                                error: err,
                                                                data: {
                                                                    message: "7. An error has occurred as mentioned above"
                                                                }
                                                            });
                                                        });
                                                    }).catch(err => {
                                                    res.status(500).json({
                                                        status: "failure",
                                                        error: err,
                                                        data: {
                                                            message: "6. An error has occurred as mentioned above"
                                                        }
                                                    });
                                                });

                                            }).catch(err => {
                                                console.log(err);
                                            res.status(500).json({
                                                status: "failure",
                                                error: err,
                                                data: {
                                                    message: "5. An error has occurred as mentioned above"
                                                }
                                            });
                                        });
                                    }).catch(err => {
                                        console.log(err);
                                    res.status(500).json({
                                        status: "failure",
                                        error: err,
                                        data: {
                                            message: "4. An error has occurred as mentioned above"
                                        }
                                    });
                                });
                            }).catch(err => {
                            res.status(500).json({
                                status: "failure",
                                error: err,
                                data: {
                                    message: "3. An error has occurred as mentioned above"
                                }
                            });
                        });
                    }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                        status: "failure",
                        error: err,
                        data: {
                            message: "2. An error has occurred as mentioned above"
                        }
                    });
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "failure",
                    error: err,
                    data: {
                        message: "1. An error has occurred as mentioned above"
                    }
                });
            });
        })

};


