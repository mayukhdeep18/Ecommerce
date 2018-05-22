const mongoose = require("mongoose");
const Product = require("../models/product_details");
const Customer = require("../models/customer");
const Analytics = require("../models/customer_analytics");

//get all customer analytics details
exports.customer_analytics_get_all = (req, res, next) => {
    Analytics.find({ACTIVE_FLAG:'Y'})
        .select("CUSTOMER_PRODUCT_CLICK_COUNT CUSTOMER_PRODUCT_SHARE_COUNT ADDED_TO_WISHLIST_FLAG INTERNET_PROTOCOL_ADDRESS MEDIA_ACCESS_CONTROL_ADDRESS INTRNATNL_MOBIL_EQUIPMNT_IDNTY MOBILE_NETWORK_CODE MOBILE_COUNTRY_CODE OPERATING_SYSTEM_TYPE OPERATING_SYSTEM_VERSION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('CUSTOMER_ID')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    customer_analytics: docs.map(doc => {
                return {
                    customer_analytics_id: doc._id,
                    product_id: doc.PRODUCT_ID._id,
                    product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                    customer_id: doc.CUSTOMER_ID._id,
                    customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                    customer_product_click_count :doc.CUSTOMER_PRODUCT_CLICK_COUNT,
                    customer_product_share_count :doc.CUSTOMER_PRODUCT_SHARE_COUNT,
                    added_to_wishlist_flag :doc.ADDED_TO_WISHLIST_FLAG,
                    internet_protocol_address :doc.INTERNET_PROTOCOL_ADDRESS,
                    media_access_control_address :doc.MEDIA_ACCESS_CONTROL_ADDRESS,
                    intrnatnl_mobil_equipmnt_idnty :doc.INTRNATNL_MOBIL_EQUIPMNT_IDNTY,
                    mobile_network_code :doc.MOBILE_NETWORK_CODE,
                    mobile_country_code :doc.MOBILE_COUNTRY_CODE,
                    operating_system_type :doc.OPERATING_SYSTEM_TYPE,
                    operating_system_version :doc.OPERATING_SYSTEM_VERSION,
                    updated_by: doc.UPDATED_BY,
                    updated_date: doc.UPDATED_DATE,
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




//create a new customer analytics
exports.customer_analytics_create = (req, res, next) => {
    if(Product.findById(req.body.PRODUCT_ID) && Customer.findById(req.body.CUSTOMER_ID))
    {
        const customer_analytics = new Analytics({
        _id: new mongoose.Types.ObjectId(),
        PRODUCT_ID: req.body.PRODUCT_ID,
        CUSTOMER_ID: req.body.CUSTOMER_ID,
            CUSTOMER_PRODUCT_CLICK_COUNT :req.body.CUSTOMER_PRODUCT_CLICK_COUNT,
            CUSTOMER_PRODUCT_SHARE_COUNT :req.body.CUSTOMER_PRODUCT_SHARE_COUNT,
            ADDED_TO_WISHLIST_FLAG :req.body.ADDED_TO_WISHLIST_FLAG,
            INTERNET_PROTOCOL_ADDRESS :req.body.INTERNET_PROTOCOL_ADDRESS,
            MEDIA_ACCESS_CONTROL_ADDRESS :req.body.MEDIA_ACCESS_CONTROL_ADDRESS,
            INTRNATNL_MOBIL_EQUIPMNT_IDNTY :req.body.INTRNATNL_MOBIL_EQUIPMNT_IDNTY,
            MOBILE_NETWORK_CODE :req.body.MOBILE_NETWORK_CODE,
            MOBILE_COUNTRY_CODE :req.body.MOBILE_COUNTRY_CODE,
            OPERATING_SYSTEM_TYPE :req.body.OPERATING_SYSTEM_TYPE,
            OPERATING_SYSTEM_VERSION :req.body.OPERATING_SYSTEM_VERSION,
        UPDATED_BY: req.body.UPDATED_BY,
        UPDATED_DATE: new Date(),
        ACTIVE_FLAG: req.body.ACTIVE_FLAG
    });
        customer_analytics
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                status: "success",
                error: "",
                data: {
                    message: "customer analytics stored",
                    created_customer_analytics: {
                        _id: result._id,
                    PRODUCT_ID: result.PRODUCT_ID,
                    CUSTOMER_ID: result.CUSTOMER_ID,
                        CUSTOMER_PRODUCT_CLICK_COUNT :result.CUSTOMER_PRODUCT_CLICK_COUNT,
                        CUSTOMER_PRODUCT_SHARE_COUNT :result.CUSTOMER_PRODUCT_SHARE_COUNT,
                        ADDED_TO_WISHLIST_FLAG :result.ADDED_TO_WISHLIST_FLAG,
                        INTERNET_PROTOCOL_ADDRESS :result.INTERNET_PROTOCOL_ADDRESS,
                        MEDIA_ACCESS_CONTROL_ADDRESS :result.MEDIA_ACCESS_CONTROL_ADDRESS,
                        INTRNATNL_MOBIL_EQUIPMNT_IDNTY :result.INTRNATNL_MOBIL_EQUIPMNT_IDNTY,
                        MOBILE_NETWORK_CODE :result.MOBILE_NETWORK_CODE,
                        MOBILE_COUNTRY_CODE :result.MOBILE_COUNTRY_CODE,
                        OPERATING_SYSTEM_TYPE :result.OPERATING_SYSTEM_TYPE,
                        OPERATING_SYSTEM_VERSION :result.OPERATING_SYSTEM_VERSION,
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
                    message: "customer id or product id does not exist"
                }
            });
    }
};

//get customer analytics details by id
exports.customer_analytics_get_by_id = (req, res, next) => {
    const id = req.params.analyticsId;
    Analytics.findById(id)
        .select("CUSTOMER_PRODUCT_CLICK_COUNT CUSTOMER_PRODUCT_SHARE_COUNT ADDED_TO_WISHLIST_FLAG INTERNET_PROTOCOL_ADDRESS MEDIA_ACCESS_CONTROL_ADDRESS INTRNATNL_MOBIL_EQUIPMNT_IDNTY MOBILE_NETWORK_CODE MOBILE_COUNTRY_CODE OPERATING_SYSTEM_TYPE OPERATING_SYSTEM_VERSION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_ID')
        .populate('CUSTOMER_ID')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        customer_analytics_id: doc._id,
                        product_id: doc.PRODUCT_ID._id,
                        product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                        customer_id: doc.CUSTOMER_ID._id,
                        customer_name: doc.CUSTOMER_ID.CUSTOMER_NAME,
                        customer_product_click_count :doc.CUSTOMER_PRODUCT_CLICK_COUNT,
                        customer_product_share_count :doc.CUSTOMER_PRODUCT_SHARE_COUNT,
                        added_to_wishlist_flag :doc.ADDED_TO_WISHLIST_FLAG,
                        internet_protocol_address :doc.INTERNET_PROTOCOL_ADDRESS,
                        media_access_control_address :doc.MEDIA_ACCESS_CONTROL_ADDRESS,
                        intrnatnl_mobil_equipmnt_idnty :doc.INTRNATNL_MOBIL_EQUIPMNT_IDNTY,
                        mobile_network_code :doc.MOBILE_NETWORK_CODE,
                        mobile_country_code :doc.MOBILE_COUNTRY_CODE,
                        operating_system_type :doc.OPERATING_SYSTEM_TYPE,
                        operating_system_version :doc.OPERATING_SYSTEM_VERSION,
                        updated_by: doc.UPDATED_BY,
                        updated_date: doc.UPDATED_DATE,
                        isActive: doc.ACTIVE_FLAG
            }
            });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        message: "No valid entry found for provided analytics ID"
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


//update customer analytics details by id
exports.customer_analytics_update = (req, res, next) => {
    const id = req.params.analyticsId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Analytics.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'customer analytics updated'
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


//delete a customer analytics by id
exports.customer_analytics_delete = (req, res, next) => {
    const id = req.params.analyticsId;
    Analytics.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'customer analytics deleted'
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