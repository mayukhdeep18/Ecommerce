const mongoose = require("mongoose");
const Customer = require("../models/customer");

//get all active customer image details
exports.customer_get_all = (req, res, next) => {
    Customer.find({ACTIVE_FLAG:'Y'})
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
                status: "success",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};



//create customer by product id
exports.customer_create = (req, res, next) =>  {
    const customer = new Customer({
        _id: new mongoose.Types.ObjectId(),
        CUSTOMER_NAME: req.body.CUSTOMER_NAME,
        CUSTOMER_DATE_OF_BIRTH: req.body.CUSTOMER_DATE_OF_BIRTH,
        CUSTOMER_GENDER: req.body.CUSTOMER_GENDER,
        CUSTOMER_EMAIL_ID: req.body.CUSTOMER_EMAIL_ID,
        CUSTOMER_ADDRESS_LINE_1: req.body.CUSTOMER_ADDRESS_LINE_1,
        CUSTOMER_ADDRESS_LINE_2: req.body.CUSTOMER_ADDRESS_LINE_2,
        CUSTOMER_CITY_NAME: req.body.CUSTOMER_CITY_NAME,
        CUSTOMER_STATE_NAME: req.body.CUSTOMER_STATE_NAME,
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
            console.log(result);
            res.status(201).json({
                status: "success",
                error: "",
                data: {
                    message: "Customer list created successfully",
                    createdcustomer: {
                        _id: result._id,
                        CUSTOMER_NAME: result.CUSTOMER_NAME,
                        CUSTOMER_DATE_OF_BIRTH: result.CUSTOMER_DATE_OF_BIRTH,
                        CUSTOMER_GENDER: result.CUSTOMER_GENDER,
                        CUSTOMER_EMAIL_ID: result.CUSTOMER_EMAIL_ID,
                        CUSTOMER_ADDRESS_LINE_1: result.CUSTOMER_ADDRESS_LINE_1,
                        CUSTOMER_ADDRESS_LINE_2: result.CUSTOMER_ADDRESS_LINE_2,
                        CUSTOMER_CITY_NAME: result.CUSTOMER_CITY_NAME,
                        CUSTOMER_STATE_NAME: result.CUSTOMER_STATE_NAME,
                        CUSTOMER_ZIP: result.CUSTOMER_ZIP,
                        CUSTOMER_PHONE_NUMBER: result.CUSTOMER_PHONE_NUMBER,
                        CUSTOMER_PROFILE_PICTURE_LINK: result.CUSTOMER_PROFILE_PICTURE_LINK,
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
};

//get customer details by id
exports.customer_get_by_id = (req, res, next) => {
    const id = req.params.customerId;
    Customer.findById(id)
        .select('CUSTOMER_NAME CUSTOMER_DATE_OF_BIRTH CUSTOMER_GENDER CUSTOMER_EMAIL_ID CUSTOMER_ADDRESS_LINE_1 CUSTOMER_ADDRESS_LINE_2 CUSTOMER_CITY_NAME CUSTOMER_STATE_NAME CUSTOMER_ZIP CUSTOMER_PHONE_NUMBER CUSTOMER_PROFILE_PICTURE_LINK UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
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
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        message: "No valid entry found for provided ID"
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

//update customer details by id
exports.customer_update_by_id = (req, res, next) =>  {
    const id = req.params.customerId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Customer.update({ _id: id }, { $set: updateOps })
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

    Customer.remove({ _id: id })
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