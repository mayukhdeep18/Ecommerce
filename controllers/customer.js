const mongoose = require("mongoose");
const Customer = require("../models/customer");

//get all active customer image details
exports.customer_get_all = (req, res, next) => {
    Customer.find({ACTIVE_FLAG:'Y'})
        .select('CUSTOMER_ID CUSTOMER_NAME CUSTOMER_DATE_OF_BIRTH CUSTOMER_GENDER CUSTOMER_EMAIL_ID CUSTOMER_ADDRESS_LINE_1 CUSTOMER_ADDRESS_LINE_2 CUSTOMER_CITY_NAME CUSTOMER_STATE_NAME CUSTOMER_ZIP CUSTOMER_PHONE_NUMBER CUSTOMER_PROFILE_PICTURE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        customer: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                customer_id: doc.CUSTOMER_ID,
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
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else
            {
                res.status(400).json({
                    status: "failure",
                    error: "",
                    data: {
                        message: "No customer data found"
                    }
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                status: "failure",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};


//create customer
exports.customer_create = (req, res, next) =>  {

    var cust_id = req.body.CUSTOMER_EMAIL_ID.replace(/[^a-zA-Z0-9]/g,'-');

    if(cust_id.length > 0)
    {
        const customer = new Customer({
            _id: new mongoose.Types.ObjectId(),
            CUSTOMER_ID: cust_id.toLowerCase(),
            CUSTOMER_NAME: req.body.CUSTOMER_NAME.toLowerCase(),
            CUSTOMER_DATE_OF_BIRTH: req.body.CUSTOMER_DATE_OF_BIRTH,
            CUSTOMER_GENDER: req.body.CUSTOMER_GENDER.toLowerCase(),
            CUSTOMER_EMAIL_ID: req.body.CUSTOMER_EMAIL_ID.toLowerCase(),
            CUSTOMER_ADDRESS_LINE_1: req.body.CUSTOMER_ADDRESS_LINE_1.toLowerCase(),
            CUSTOMER_ADDRESS_LINE_2: req.body.CUSTOMER_ADDRESS_LINE_2.toLowerCase(),
            CUSTOMER_CITY_NAME: req.body.CUSTOMER_CITY_NAME.toLowerCase(),
            CUSTOMER_STATE_NAME: req.body.CUSTOMER_STATE_NAME.toLowerCase(),
            CUSTOMER_ZIP: req.body.CUSTOMER_ZIP,
            CUSTOMER_PHONE_NUMBER: req.body.CUSTOMER_PHONE_NUMBER,
            CUSTOMER_PROFILE_PICTURE_LINK: req.file.path,
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        customer
            .save()
            .then(result => {
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "Customer list created successfully"
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
    else
    {
        res.status(500).json({
            status: "failure",
            error: "",
            data: {
                message: "Enter details correctly"
            }
        });
    }

};

//get customer details by id
exports.customer_get_by_id = (req, res, next) => {
    const id = req.params.customerId;
    Customer.find({CUSTOMER_ID:id})
        .select('CUSTOMER_ID CUSTOMER_NAME CUSTOMER_DATE_OF_BIRTH CUSTOMER_GENDER CUSTOMER_EMAIL_ID CUSTOMER_ADDRESS_LINE_1 CUSTOMER_ADDRESS_LINE_2 CUSTOMER_CITY_NAME CUSTOMER_STATE_NAME CUSTOMER_ZIP CUSTOMER_PHONE_NUMBER CUSTOMER_PROFILE_PICTURE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        customer: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                customer_id: doc.CUSTOMER_ID,
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
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else
            {
                res.status(400).json({
                    status: "failure",
                    error: "",
                    data: {
                        message: "No customer data found"
                    }
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                status: "failure",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};

//update customer details by id
exports.customer_update_by_id = (req, res, next) =>  {
    const id = req.params.customerId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Customer.update({ CUSTOMER_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'customer updated'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                message: "An error has occurred as mentioned above"
            });
        });
};


exports.customer_update_profile_pic_by_id = (req, res, next) =>  {
    const id = req.params.customerId;
    const updateOps = {};

        updateOps['CUSTOMER_PROFILE_PICTURE_LINK'] = req.file.path ;

    Customer.update({ CUSTOMER_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'customer updated'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                message: "An error has occurred as mentioned above"
            });
        });
};

//Delete customer details by id
exports.customer_delete_by_id = (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id);

    Customer.remove({ CUSTOMER_ID: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'customer deleted'
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