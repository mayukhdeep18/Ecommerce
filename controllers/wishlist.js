const mongoose = require("mongoose");
const Customer = require("../models/filters");
const product = require("../models/product_details");
const Wishlist = require("../models/wishlist");

//get all active wishlist  details
exports.wishlist_conn_get_all = (req, res, next) => {
    Wishlist.find({ACTIVE_FLAG:'Y'})
        .select("UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('CUSTOMER_ID')
        .populate('PRODUCT_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    wishlist: docs.map(doc => {
                        return {
                            wishlist_id: doc._id,
                            filter_id: doc.CUSTOMER_ID._id,
                            customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                            product_id: doc.PRODUCT_ID._id,
                            product_name: doc.PRODUCT_ID.PRODUCT_NAME,
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



//create a new wishlist
exports.wishlist_conn_create = (req, res, next) => {

    if(Customer.findById(req.body.CUSTOMER_ID) && product.findById(req.body.PRODUCT_ID))
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
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "wishlist  stored",
                        wishlsit_created: {
                            _id: result._id,
                            CUSTOMER_ID: result.CUSTOMER_ID,
                            PRODUCT_ID: result.PRODUCT_ID,
                            UPDATED_BY: result.UPDATED_BY,
                            UPDATED_DATE: result.UPDATED_DATE,
                            ACTIVE_FLAG: result.ACTIVE_FLAG
                        }
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
    else {
        res
            .status(404)
            .json({
                status: "error",
                error: "ID doesn't exist",
                data: {
                    message: "product id or customer id does not exist"
                }
            });
    }
};


//get wishlist details by id
exports.wishlist_conn_get_by_id = (req, res, next) => {
    const id = req.params.wishlistId;
    Wishlist.findById(id)
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
                        filter_id: doc.CUSTOMER_ID._id,
                        customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
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
};


//delete a wishlist by id
exports.wishlist_conn_delete = (req, res, next) => {
    const id = req.params.wishlistId;
    Wishlist.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'wishlist  deleted'
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