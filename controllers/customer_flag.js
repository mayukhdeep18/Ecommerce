const mongoose = require("mongoose");
const Customer = require("../models/customer");

//get all customer details by active flag
exports.customer_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Customer.find({ACTIVE_FLAG: 'Y'})
            .select('CUSTOMER_NAME CUSTOMER_DATE_OF_BIRTH CUSTOMER_GENDER CUSTOMER_EMAIL_ID CUSTOMER_ADDRESS_LINE_1 CUSTOMER_ADDRESS_LINE_2 CUSTOMER_CITY_NAME CUSTOMER_STATE_NAME CUSTOMER_ZIP CUSTOMER_PHONE_NUMBER CUSTOMER_PROFILE_PICTURE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        customer: docs.map(doc => {
                            return {
                                customer_id: doc._id,
                                customer_name: doc.CUSTOMER_NAME,
                                customer_date_of_birth: doc.CUSTOMER_DATE_OF_BIRTH,
                                customer_gender: doc.CUSTOMER_GENDER,
                                customer_email_id: doc.CUSTOMER_EMAIL_ID,
                                customer_address_line_1: doc.CUSTOMER_ADDRESS_LINE_1,
                                customer_address_line_2: doc.CUSTOMER_ADDRESS_LINE_2,
                                customer_city_name: doc.CUSTOMER_CITY_NAME,
                                customer_state_name: doc.CUSTOMER_STATE_NAME,
                                customer_zip: doc.CUSTOMER_ZIP,
                                customer_phone_number: doc.CUSTOMER_PHONE_NUMBER,
                                customer_profile_picture_link: doc.CUSTOMER_PROFILE_PICTURE_LINK,
                                UPDATED_BY: doc.UPDATED_BY,
                                UPDATED_DATE: doc.UPDATED_DATE,
                                ACTIVE_FLAG: doc.ACTIVE_FLAG
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
        Customer.find({ACTIVE_FLAG: 'N'})
            .select('CUSTOMER_NAME CUSTOMER_DATE_OF_BIRTH CUSTOMER_GENDER CUSTOMER_EMAIL_ID CUSTOMER_ADDRESS_LINE_1 CUSTOMER_ADDRESS_LINE_2 CUSTOMER_CITY_NAME CUSTOMER_STATE_NAME CUSTOMER_ZIP CUSTOMER_PHONE_NUMBER CUSTOMER_PROFILE_PICTURE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        customer: docs.map(doc => {
                            return {
                                customer_id: doc._id,
                                customer_name: doc.CUSTOMER_NAME,
                                customer_date_of_birth: doc.CUSTOMER_DATE_OF_BIRTH,
                                customer_gender: doc.CUSTOMER_GENDER,
                                customer_email_id: doc.CUSTOMER_EMAIL_ID,
                                customer_address_line_1: doc.CUSTOMER_ADDRESS_LINE_1,
                                customer_address_line_2: doc.CUSTOMER_ADDRESS_LINE_2,
                                customer_city_name: doc.CUSTOMER_CITY_NAME,
                                customer_state_name: doc.CUSTOMER_STATE_NAME,
                                customer_zip: doc.CUSTOMER_ZIP,
                                customer_phone_number: doc.CUSTOMER_PHONE_NUMBER,
                                customer_profile_picture_link: doc.CUSTOMER_PROFILE_PICTURE_LINK,
                                UPDATED_BY: doc.UPDATED_BY,
                                UPDATED_DATE: doc.UPDATED_DATE,
                                ACTIVE_FLAG: doc.ACTIVE_FLAG
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
