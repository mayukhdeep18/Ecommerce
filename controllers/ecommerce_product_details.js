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
    EcommProduct.find({ACTIVE_FLAG:'Y'})
        .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('ECOMMERCE_CATEGORY_ID')
        .populate('PRODUCT_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID')
        .populate('SUB_SUB_CATEGORY_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    ecommproduct: docs.map(doc => {
                        return {
                            ecommerce_product_details_id: doc._id,
                            ecommerce_category_id: doc.ECOMMERCE_CATEGORY_ID._id,
                            ecommerce_category_details: doc.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                            product_category_id: doc.CATEGORY_ID._id,
                            product_category_name: doc.CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                            product_sub_category_id: doc.SUB_CATEGORY_ID._id,
                            product_sub_category_name: doc.SUB_CATEGORY_ID.PRODUCT_SUB_CATEGORY_NAME,
                            product_sub_sub_category_id: doc.SUB_SUB_CATEGORY_ID._id,
                            product_sub_sub_category_name: doc.SUB_SUB_CATEGORY_ID.PRODUCT_SUB_SUB_CATEGORY_NAME,
                            ecommerce_product_name: doc.ECOMMERCE_PRODUCT_NAME,
                            ecommerce_product_price: doc.ECOMMERCE_PRODUCT_PRICE,
                            ecommerce_prodct_shpmnt_duratn: doc.ECOMMERCE_PRODCT_SHPMNT_DURATN,
                            product_url: doc.PRODUCT_URL,
                            ecommerce_product_id: doc.ECOMMERCE_PRODUCT_ID,
                            product_id: doc.PRODUCT_ID._id,
                            product_specifications:JSON.parse(doc.PRODUCT_ID.PRODUCT_SPECIFICATIONS),
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

//get ecommerce product details by id
exports.ecommproduct_details_get_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    EcommProduct.findById(id)
        .select("ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_NAME ECOMMERCE_PRODUCT_PRICE PRODUCT_URL ECOMMERCE_PRODUCT_ID UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('ECOMMERCE_NAME _id')
        .populate('PRODUCT_ID')
        .populate('CATEGORY_ID')
        .populate('SUB_CATEGORY_ID')
        .populate('SUB_SUB_CATEGORY_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        message: doc
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        message: "No valid entry found for provided subcategory ID"
                    });
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


//update ecommerce product details by id
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
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }


            EcommProduct.find({_id: id})
                .select('ECOMMERCE_PRODUCT_PRICE PRODUCT_ID')
                .populate('ECOMMERCE_CATEGORY_ID')
                .exec()
                .then(ecom_1 => {

                    var prod_id = ecom_1[0].PRODUCT_ID;
                    console.log(prod_id);



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

                            console.log(min);
                            console.log(min_name);

                            Rating.find({PRODUCT_ID: prod_id, ACTIVE_FLAG: 'Y'})
                                .select("RATING_NUMBER PRODUCT_ID _id")
                                .exec()
                                .then(rating_1 => {
                                    for (var item_1 of rating_1) {
                                        sum_rating = sum_rating + item_1.RATING_NUMBER;
                                        counter_1++;
                                    }

                                    console.log(sum_rating);
                                    console.log(counter_1);

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

                                    console.log(mean_rating);
                                    console.log(counter_1);

                                    Review.find({PRODUCT_ID: prod_id, ACTIVE_FLAG: 'Y'})
                                        .select("REVIEW_TITLE PRODUCT_ID _id")
                                        .exec()
                                        .then(review_1 => {
                                            for (var item_2 of review_1) {
                                                counter++;
                                            }


                                            updateOps_1['REVIEW_COUNT'] = counter;
                                            console.log(counter);


                                            Product.update({ _id: prod_id }, {$set: updateOps_1})
                                                .exec()
                                                .then(final => {

                                                    res.status(200).json({
                                                        status: "success",
                                                        error: "",
                                                        data: {
                                                            message: 'product details updated and stored'
                                                        }
                                                    });
                                                }).catch(err => {
                                                console.log(err);
                                                res.status(500).json({
                                                    status: "success",
                                                    error: err,
                                                    data: {
                                                        message: "An error has occurred as mentioned above"
                                                    }
                                                });
                                            });
                                        }).catch(err => {
                                        console.log(err);
                                        res.status(500).json({
                                            status: "success",
                                            error: err,
                                            data: {
                                                message: "An error has occurred as mentioned above"
                                            }
                                        });
                                    });
                                }).catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    status: "success",
                                    error: err,
                                    data: {
                                        message: "An error has occurred as mentioned above"
                                    }
                                });
                            });

                        }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            status: "success",
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    });
                }).catch(err => {
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


//delete ecommerce product details by id
exports.ecommproduct_delete_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    EcommProduct.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'subcategory deleted'
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


//create a new ecommerce product detail
exports.ecommproduct_new_create = (req, res, next) => {

    var Ecom_name = req.body.ECOMMERCE_NAME.toLowerCase();
    console.log('ecom_name', Ecom_name);

    EcommCategory.find({ECOMMERCE_NAME: Ecom_name})
        .select('ECOMMERCE_ID _id')
        .exec()
        .then(docs => {
            console.log('docs',docs);

            var Ecomm_id = docs[0]._id;

            console.log('Ecomm_length',Ecomm_id);

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
                                        res.status(201).json({
                                            status: "success",
                                            error: "",
                                            data: {
                                                message: "ecommerce details stored"
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

            }
            else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Ecommerce doesn't exist",
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
                message: "An error has occurred as mentioned above"
            }
        });
    });

};


//map ecommerce product and product along with ratings and reviews a new ecommerce product detail
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

                       console.log('ecom_upd',updateOps );
                       console.log('ecom_id', Ecom_id);

                        EcommProduct.update({ _id: Ecom_id}, {$set: updateOps})
                            .exec()
                            .then( ecom_upd => {

                                Rating.find({ECOMMERCE_PRODUCT_ID: Ecom_id})
                                    .select('ECOMMERCE_PRODUCT_ID PRODUCT_ID ACTIVE_FLAG _id')
                                    .exec()
                                    .then(rat_upd => {

                                        Rating_upd['PRODUCT_ID'] = prod_res[0]._id.toString();
                                        Rating_upd['ACTIVE_FLAG'] = 'Y';

                                        console.log('rat_upd', Rating_upd);
                                        console.log('rat_id_upd', rat_upd[0]._id);

                                        Rating.update({_id: rat_upd[0]._id},{$set:Rating_upd})
                                            .exec()
                                            .then(rating_upd => {

                                                Review.find({ECOMMERCE_PRODUCT_ID: Ecom_id})
                                                    .select('ECOMMERCE_PRODUCT_ID PRODUCT_ID ACTIVE_FLAG _id')
                                                    .exec()
                                                    .then(review_upd => {
                                                        Review_upd['PRODUCT_ID'] = prod_res[0]._id.toString();
                                                        Review_upd['ACTIVE_FLAG'] = 'Y';

                                                        console.log('rev_upd', Review_upd);
                                                        console.log('rev_id_upd', review_upd[0]._id);

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


