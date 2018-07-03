const mongoose = require("mongoose");
const Subcategory = require("../models/subcategory");
const Category = require("../models/category");

//get all active subcategory details
exports.subcategory_get_all = (req, res, next) => {
    Subcategory.find({ACTIVE_FLAG:'Y'})
        .select("SUB_CATEGORY_ID PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        subcategory: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                sub_category_id: doc.SUB_CATEGORY_ID,
                                category_name: doc.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                sub_category_name: doc.PRODUCT_SUB_CATEGORY_NAME,
                                sub_category_description: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                                updated_by: doc.UPDATED_BY,
                                updated_date: doc.UPDATED_DATE,
                                active_flag: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "No sub category found"
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

//create a new subcategory
exports.subcategory_create = (req, res, next) => {

    var Sub_id = req.body.PRODUCT_SUB_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    if(Sub_id.length > 0)
    {
        Subcategory.find({SUB_CATEGORY_ID: Sub_id.toLowerCase()})
            .select('_id')
            .exec()
            .then(doc => {
                if(doc.length >0)
                {
                    res.status(404)
                        .json({
                            status: "error",
                            data: {
                                message: "Sub category already exists!"
                            }
                        });
                }
                else{
                    if(
                        Category.findById(req.body.PRODUCT_CATEGORY_ID)
                    )
                    {
                        const subcategory = new Subcategory({
                            _id: new mongoose.Types.ObjectId(),
                            SUB_CATEGORY_ID: Sub_id.toLowerCase(),
                            PRODUCT_CATEGORY_ID: req.body.PRODUCT_CATEGORY_ID,
                            PRODUCT_SUB_CATEGORY_NAME: req.body.PRODUCT_SUB_CATEGORY_NAME.toLowerCase(),
                            PRODUCT_SUB_CATEGORY_DESCRIPTION: req.body.PRODUCT_SUB_CATEGORY_DESCRIPTION.toLowerCase(),
                            UPDATED_BY: req.body.UPDATED_BY,
                            UPDATED_DATE: new Date(),
                            ACTIVE_FLAG: req.body.ACTIVE_FLAG
                        });
                        subcategory
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    status: "success",
                                    data: {
                                        message: "Sub category details stored"
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
                    else {
                        res
                            .status(404)
                            .json({
                                status: "error",
                                data: {
                                    message: "Category does not exist!"
                                }
                            });
                    }
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
    else {
        res
            .status(500)
            .json({
                status: "error",
                data: {
                    message: "Please check all your fields!"
                }
            });
    }
};

//get subcategory details by id
exports.subcategory_get_subcategory = (req, res, next) => {
    const id = req.params.subcategoryId;
    Subcategory.find({SUB_CATEGORY_ID:id})
        .select("SUB_CATEGORY_ID PRODUCT_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME PRODUCT_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('PRODUCT_CATEGORY_ID')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    data: {
                        subcategory: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                sub_category_id: doc.SUB_CATEGORY_ID,
                                category_name: doc.PRODUCT_CATEGORY_ID.PRODUCT_CATEGORY_NAME,
                                sub_category_name: doc.PRODUCT_SUB_CATEGORY_NAME,
                                sub_category_description: doc.PRODUCT_SUB_CATEGORY_DESCRIPTION,
                                updated_by: doc.UPDATED_BY,
                                updated_date: doc.UPDATED_DATE,
                                active_flag: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "error",
                    data: {
                        message: "No sub category found"
                    }
                });
            }

        })
        .catch(err => {
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error"
                }
            });
        });
};

//update subcategory details by id
exports.subcategory_update = (req, res, next) => {
    const id = req.params.subcategoryId;
    var Sub_id = req.body.PRODUCT_SUB_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');
    const updateOps = {};

    updateOps['PRODUCT_CATEGORY_ID'] = req.body.PRODUCT_CATEGORY_ID;
    updateOps['PRODUCT_SUB_CATEGORY_NAME'] = req.body.PRODUCT_CATEGORY_NAME;
    updateOps['PRODUCT_SUB_CATEGORY_DESCRIPTION']= req.body.PRODUCT_CATEGORY_DESCRIPTION;
    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateOps['UPDATED_DATE'] = new Date();
    updateOps['SUB_CATEGORY_ID'] = Sub_id.toLowerCase();


    Subcategory.update({ SUB_CATEGORY_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: 'subcategory updated'
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
};

//delete a sub category by id
exports.subcategory_delete = (req, res, next) => {
    const id = req.params.subcategoryId;
    Subcategory.remove({ SUB_CATEGORY_ID: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: "subcategory deleted!"
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
                        message: "Internal server error!"
                    }
            });
        });
};
