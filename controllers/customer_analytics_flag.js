const mongoose = require("mongoose");
const Analytics = require("../models/customer_analytics");

//get all Analytics details by active flag
exports.customer_analytics_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Analytics.find({ACTIVE_FLAG: 'Y'})
            .select("CUSTOMER_PRODUCT_CLICK_COUNT CUSTOMER_PRODUCT_SHARE_COUNT ADDED_TO_WISHLIST_FLAG INTERNET_PROTOCOL_ADDRESS MEDIA_ACCESS_CONTROL_ADDRESS INTRNATNL_MOBIL_EQUIPMNT_IDNTY MOBILE_NETWORK_CODE MOBILE_COUNTRY_CODE OPERATING_SYSTEM_TYPE OPERATING_SYSTEM_VERSION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_ID')
            .populate('CUSTOMER_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        rating: docs.map(doc => {
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
                    status: "success",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            });
    }
    else if (actFlag === 'N')
    {
        Analytics.find({ACTIVE_FLAG: 'N'})
            .select("CUSTOMER_PRODUCT_CLICK_COUNT CUSTOMER_PRODUCT_SHARE_COUNT ADDED_TO_WISHLIST_FLAG INTERNET_PROTOCOL_ADDRESS MEDIA_ACCESS_CONTROL_ADDRESS INTRNATNL_MOBIL_EQUIPMNT_IDNTY MOBILE_NETWORK_CODE MOBILE_COUNTRY_CODE OPERATING_SYSTEM_TYPE OPERATING_SYSTEM_VERSION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
            .populate('PRODUCT_ID')
            .populate('CUSTOMER_ID')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        customer: docs.map(doc => {
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
                    status: "success",
                    error: err,
                    data: {
                        message: "An error has occurred as mentioned above"
                    }
                });
            });
    }
    else
    {
        res
            .status(500)
            .json({
                status: "error",
                error: "Incorrect flag",
                data: {
                    message: "Incorrect flag value. Flag must be either Y or N"
                }
            });
    }
};