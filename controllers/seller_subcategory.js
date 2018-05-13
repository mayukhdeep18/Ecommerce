const mongoose = require("mongoose");
const Seller_subcategory = require("../models/seller_subcategory");
const Seller_category = require("../models/seller_category");

//get all active seller subcategory details
exports.seller_subcategory_get_all = (req, res, next) => {
    Seller_subcategory.find({ACTIVE_FLAG:'Y'})
        .select("SELLER_CATEGORY_ID SELLER_SUB_CATEGORY_NAME SELLER_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id")
        .populate('SELLER_CATEGORY_ID','SELLER_CATEGORY_NAME')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    subcategorys: docs.map(doc => {
                        return {
                            seller_sub_category_id: doc._id,
                            seller_category_id: doc.SELLER_CATEGORY_ID,
                            seller_sub_category_name: doc.SELLER_SUB_CATEGORY_NAME,
                            seller_sub_category_description: doc.SELLER_SUB_CATEGORY_DESCRIPTION,
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




//create a new seller subcategory
exports.seller_subcategory_create = (req, res, next) => {
    Seller_category.findById(req.body.SELLER_CATEGORY_ID)
        .then(category => {
            if (!category) {
                return res.status(404).json({
                    status: "error",
                    error: "Seller_category not found",
                    data: {
                        message: "Seller_category not found, please try entering subcategory details for an existing category"
                    }
                });
            }
            const seller_subcategory = new Seller_subcategory({
                _id: new mongoose.Types.ObjectId(),
                SELLER_CATEGORY_ID: req.body.SELLER_CATEGORY_ID,
                SELLER_SUB_CATEGORY_NAME: req.body.SELLER_SUB_CATEGORY_NAME,
                SELLER_SUB_CATEGORY_DESCRIPTION: req.body.SELLER_SUB_CATEGORY_DESCRIPTION,
                UPDATED_BY: req.body.UPDATED_BY,
                UPDATED_DATE: new Date(),
                ACTIVE_FLAG: req.body.ACTIVE_FLAG
            });
            return seller_subcategory.save();
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                status: "success",
                error: "",
                data: {
                    message: "Seller_subcategory stored",
                    createdSeller_subcategory: {
                        _id: result._id,
                        seller_category_id: result.SELLER_CATEGORY_ID,
                        seller_sub_category_name: result.SELLER_SUB_CATEGORY_NAME,
                        seller_sub_category_description: result.SELLER_SUB_CATEGORY_DESCRIPTION,
                        updated_by_user: result.UPDATED_BY,
                        updated_on: result.UPDATED_DATE,
                        isActive: result.ACTIVE_FLAG
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

//get seller subcategory details by id
exports.seller_subcategory_get_subcategory = (req, res, next) => {
    const id = req.params.sellersubcategoryId;
    Seller_subcategory.findById(id)
        .select('SELLER_CATEGORY_ID SELLER_SUB_CATEGORY_NAME SELLER_SUB_CATEGORY_DESCRIPTION UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .populate('SELLER_CATEGORY_ID','SELLER_CATEGORY_NAME')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        seller_subcategory: doc
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


//update seller subcategory details by id
exports.seller_subcategory_update = (req, res, next) => {
    const id = req.params.sellersubcategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Seller_subcategory.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'seller subcategory updated'
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


//delete a seller sub category by id
exports.seller_subcategory_delete = (req, res, next) => {
    const id = req.params.sellersubcategoryId;
    Seller_subcategory.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'seller subcategory deleted'
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