const mongoose = require("mongoose");
const Ecommerce_category = require("../models/ecommerce_category");
const EcomProd = require("../models/ecommerce_product_details");
const Product = require("../models/product_details");

//get all active ecommerce category details
exports.ecomm_category_get_all = (req, res, next) => {
    Ecommerce_category.find()
        .select('ECOMMERCE_ID ECOMMERCE_NAME ECOMMERCE_DESCRIPTION ECOMMERCE_LOGO ECOMMERCE_WEB_URL ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    data: {
                        ecommerce_details: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                ecommerce_id: doc.ECOMMERCE_ID,
                                ecommerce_name: doc.ECOMMERCE_NAME,
                                ecommerce_description: doc.ECOMMERCE_DESCRIPTION,
                                ecommerce_logo: JSON.parse(doc.ECOMMERCE_LOGO),
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
                    status: "error",
                    data: {
                        message: "Internal server error!"
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

//create ecommerce category
exports.ecommerce_create_category = (req, res, next) =>  {

    var ecom_id = req.body.ECOMMERCE_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    if(ecom_id.length > 0)
    {
        Ecommerce_category.find({ECOMMERCE_ID: ecom_id.toLowerCase() })
            .select('_id')
            .exec()
            .then(doc=> {
                if(doc.length > 0)
                {
                    res.status(500).json({
                        status: "error",
                        data: {
                            message: "Ecommerce category already exists!"
                        }
                    });
                }
                else
                {
                    const ecommerce_category = new Ecommerce_category({
                        _id: new mongoose.Types.ObjectId(),
                        ECOMMERCE_ID: ecom_id.toLowerCase(),
                        ECOMMERCE_NAME: req.body.ECOMMERCE_NAME.toLowerCase(),
                        ECOMMERCE_DESCRIPTION: req.body.ECOMMERCE_DESCRIPTION.toLowerCase(),
                        ECOMMERCE_LOGO: JSON.stringify(req.body.ECOMMERCE_LOGO),
                        ECOMMERCE_WEB_URL: req.body.ECOMMERCE_WEB_URL.toLowerCase(),
                        UPDATED_BY: req.body.UPDATED_BY,
                        UPDATED_DATE: new Date(),
                        ACTIVE_FLAG: req.body.ACTIVE_FLAG
                    });
                    ecommerce_category
                        .save()
                        .then(result => {

                            res.status(201).json({
                                status: "success",
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
    }
    else
    {
        res.status(500).json({
            status: "error",
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
                    data: {
                        ecommerce_details: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                ecommerce_id: doc.ECOMMERCE_ID,
                                ecommerce_name: doc.ECOMMERCE_NAME,
                                ecommerce_description: doc.ECOMMERCE_DESCRIPTION,
                                ecommerce_logo: JSON.parse(doc.ECOMMERCE_LOGO),
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
                    status: "error",
                    data: {
                        message: "Internal server error!"
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

//update ecommerce category details by id
exports.ecommerce_category_update_by_id = (req, res, next) =>  {
    const id = req.params.ecommcategoryId;
    const updateOps = {};
    const updateRes = {};
    var ecom_id = req.body.ECOMMERCE_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    updateOps['ECOMMERCE_NAME'] = req.body.ECOMMERCE_NAME;
    updateOps['ECOMMERCE_DESCRIPTION']= req.body.ECOMMERCE_DESCRIPTION;
    updateOps['ECOMMERCE_LOGO'] = JSON.stringify(req.body.ECOMMERCE_LOGO);
    updateOps['ECOMMERCE_WEB_URL'] = req.body.ECOMMERCE_WEB_URL;
    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateOps['UPDATED_DATE'] = new Date();
    updateOps['ECOMMERCE_ID'] = ecom_id.toLowerCase();
    updateRes['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateRes['UPDATED_DATE'] = new Date();

    Ecommerce_category.update({ ECOMMERCE_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            EcomProd.update({ECOMMERCE_CATEGORY_ID: id},{$set: updateRes},{multi:true})
                .exec()
                .then(res1 => {
                    res.status(200).json({
                        status: "success",
                        data: {
                            message: 'details have been updated'
                        }
                    });
                }).catch(err => {
                console.log(err);
                res.status(500).json({
                    status: "error",
                    error: err,
                    message: "Internal server error!"
                });
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                message: "Internal server error!"
            });
        });
};

//Update ecommerce logo ---NO LONGER REQUIRED----
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
    var arr = [];

    Product.find({ECOMMERCE_CATEGORY_ID: id})
        .select('ECOMMERCE_CATEGORY_ID ECOMMERCE_PRODUCT_DETAILS_ID ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            for(var item of doc)
            {
                arr.push(item.ECOMMERCE_PRODUCT_DETAILS_ID);
            }
            Ecommerce_category.remove({ _id: id })
                .exec()
                .then(result => {
                    EcomProd.remove({ECOMMERCE_CATEGORY_ID: id})
                        .exec()
                        .then(res1 => {
                            Product.update({ECOMMERCE_PRODUCT_DETAILS_ID: {$in: arr} },{$unset: {ECOMMERCE_CATEGORY_ID: 1,ECOMMERCE_PRODUCT_DETAILS_ID: 1}},{multi: true})
                                .exec()
                                .then(res2 => {
                                    res.status(200).json({
                                        status: "success",
                                        data: {
                                            message: 'ecommerce category deleted and dependencies have been deleted/updated!'
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
        })

};