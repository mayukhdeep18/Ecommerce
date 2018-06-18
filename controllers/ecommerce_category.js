const mongoose = require("mongoose");
const Ecommerce_category = require("../models/ecommerce_category");

//get all active ecommerce category details
exports.ecomm_category_get_all = (req, res, next) => {
    Ecommerce_category.find({ACTIVE_FLAG:'Y'})
        .select('ECOMMERCE_ID ECOMMERCE_NAME ECOMMERCE_DESCRIPTION ECOMMERCE_LOGO ECOMMERCE_WEB_URL ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        ecommerce_details: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                ecommerce_id: doc.ECOMMERCE_ID,
                                ecommerce_name: doc.ECOMMERCE_NAME,
                                ecommerce_description: doc.ECOMMERCE_DESCRIPTION,
                                ecommerce_logo: doc.ECOMMERCE_LOGO,
                                ecommerce_web_url: doc.ECOMMERCE_WEB_URL,
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else {
                res.status(404).json({
                    status: "failure",
                    error: "",
                    data: {
                        message: "No ecommerce category found"
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



//create ecommerce category
exports.ecommerce_create_category = (req, res, next) =>  {

    var ecom_id = req.body.ECOMMERCE_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    if(ecom_id.length > 0)
    {
        const ecommerce_category = new Ecommerce_category({
            _id: new mongoose.Types.ObjectId(),
            ECOMMERCE_ID: ecom_id.toLowerCase(),
            ECOMMERCE_NAME: req.body.ECOMMERCE_NAME.toLowerCase(),
            ECOMMERCE_DESCRIPTION: req.body.ECOMMERCE_DESCRIPTION.toLowerCase(),
            ECOMMERCE_LOGO: req.file.path,
            ECOMMERCE_WEB_URL: req.body.ECOMMERCE_WEB_URL.toLowerCase(),
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        ecommerce_category
            .save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    status: "success",
                    error: "",
                    data: {
                        message: "Ecommerce category added successfully"
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
            status: "error",
            error: "",
            data: {
                message: "Please check your entries"
            }
        });
    }

};

//get  ecommerce category details by id
exports.ecommerce_category_get_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    Ecommerce_category.find({ECOMMERCE_ID: id})
        .select('ECOMMERCE_ID ECOMMERCE_NAME ECOMMERCE_DESCRIPTION ECOMMERCE_LOGO ECOMMERCE_WEB_URL ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        ecommerce_details: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                ecommerce_id: doc.ECOMMERCE_ID,
                                ecommerce_name: doc.ECOMMERCE_NAME,
                                ecommerce_description: doc.ECOMMERCE_DESCRIPTION,
                                ecommerce_logo: doc.ECOMMERCE_LOGO,
                                ecommerce_web_url: doc.ECOMMERCE_WEB_URL,
                                updated_by_user: doc.UPDATED_BY,
                                updated_on: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else {
                res.status(404).json({
                    status: "failure",
                    error: "",
                    data: {
                        message: "No ecommerce category found"
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

//update ecommerce category details by id
exports.ecommerce_category_update_by_id = (req, res, next) =>  {
    const id = req.params.ecommcategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Ecommerce_category.update({ ECOMMERCE_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'details have been updated'
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

//Update ecommerce logo
exports.ecom_logo_update_by_id = (req, res, next) =>  {
    const id = req.params.ecommcategoryId;
    const updateOps = {};

    updateOps['ECOMMERCE_LOGO'] = req.file.path ;

    Ecommerce_category.update({ ECOMMERCE_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'ecommerce logo updated'
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


//Delete ecommerce category details by id
exports.ecommerce_category_delete_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    Ecommerce_category.findById(id);

    Ecommerce_category.remove({ ECOMMERCE_ID: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'product image deleted'
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