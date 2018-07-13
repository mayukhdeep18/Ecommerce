const mongoose = require("mongoose");
const User = require("../models/user");
const product = require("../models/product_details");
const Wishlist = require("../models/wishlist");

//get all active wishlist  details
exports.wishlist_conn_get_all = (req, res, next) => {
    var wish_arr = [];
    Wishlist.find({ACTIVE_FLAG:'Y'})
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('CUSTOMER_ID')
        .populate('PRODUCT_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                for (var item of docs)
                {
                    wish_arr.push({
                        wishlist_id: item._id,
                        customer_id: item.CUSTOMER_ID.userid,
                        customer_name: item.CUSTOMER_ID.userinfo.fullname,
                        prod_id: item.PRODUCT_ID._id,
                        product_id: item.PRODUCT_ID.PRODUCT_ID,
                        product_name: item.PRODUCT_ID.PRODUCT_NAME,
                        prod_spec: JSON.parse(item.PRODUCT_ID.PRODUCT_SPECIFICATIONS),
                        product_sub_title: item.PRODUCT_ID.PRODUCT_SUB_TITLE,
                        product_description: item.PRODUCT_ID.PRODUCT_DESCRIPTION,
                        prod_url: item.PRODUCT_ID.PRODUCT_URL,
                        prod_rating: parseFloat(item.PRODUCT_ID.MEAN_RATING).toFixed(2),
                        prod_rating_count: item.PRODUCT_ID.RATING_COUNT,
                        prod_review_count: item.PRODUCT_ID.REVIEW_COUNT,
                        prod_price: item.PRODUCT_ID.PRODUCT_PRICE,
                        prod_price_ecomm: item.PRODUCT_ID.LEAST_PRICE_ECOMMERCE,
                        updated_date: item.UPDATED_DATE,
                        active_flag: item.ACTIVE_FLAG})
                }
                res.status(200).json({
                    status: "success",
                    data: {
                        wish_arr
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "error",
                    data: {
                       message: "No wishlist products added!"
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
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//create a new wishlist
exports.wishlist_conn_create = (req, res, next) => {

    var id = req.body.PRODUCT_ID;

        Wishlist.find({PRODUCT_ID: id})
        .select('CUSTOMER_ID PRODUCT_ID ACTIVE_FLAG')
        .exec()
            .then( res1 => {
                if(res1.length > 0)
                {
                    res.status(500)
                        .json({
                            status: "error",
                            data: {
                                message: "product already in wishlist!"
                            }
                        });
                }
                else
                {
                    const wishlist = new Wishlist({
                        _id: new mongoose.Types.ObjectId(),
                        CUSTOMER_ID: req.body.CUSTOMER_ID,
                        PRODUCT_ID: req.body.PRODUCT_ID,
                        UPDATED_BY: req.body.UPDATED_BY,
                        UPDATED_DATE: new Date(),
                        ACTIVE_FLAG: req.body.ACTIVE_FLAG
                    });
                    wishlist
                        .save()
                        .then(result => {

                            res.status(201).json({
                                status: "success",
                                data: {
                                    message: "Product stored in wishlist"
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

/*
//get wishlist details by id
exports.wishlist_conn_get_by_id = (req, res, next) => {
    const id = req.params.wishlistId;
    Wishlist.findById({id})
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('CUSTOMER_ID')
        .populate('PRODUCT_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        wishlist_id: doc._id,
                        filter_id: doc.CUSTOMER_ID.userid,
                        customer_name: doc.CUSTOMER_ID.userinfo.fullname,
                        product_id: doc.PRODUCT_ID._id,
                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
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
*/

/*
//update wishlist details by id
exports.wishlist_conn_update = (req, res, next) => {
    const id = req.params.wishlistId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Wishlist.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'wishlist  updated'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "success",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};*/


//delete a wishlist by id
exports.wishlist_conn_delete = (req, res, next) => {
    const id = req.params.wishlistId;
    Wishlist.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: 'Product deleted from wishlist'
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