const mongoose = require("mongoose");
const Product_images = require("../models/product_images");
const Product = require("../models/product_details");

//get all active product image details
exports.images_get_all = (req, res, next) => {
    Product_images.find({ACTIVE_FLAG:'Y'})
        .select('PRODUCT_IMAGE_ID PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
        .populate('PRODUCT_ID')
        .exec()
        .then(docs => {

            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        product_images: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                product_image_id: doc.PRODUCT_IMAGE_ID,
                                product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                product_image_link: doc.PRODUCT_IMAGE_REF_1,
                                updated_by: doc.UPDATED_BY,
                                updated_date: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "failure",
                    error: "",
                    data: {
                        message: "No images have been found"
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

//upload image by product id
exports.image_upload = (req, res, next) =>  {

    const id = req.body.PRODUCT_ID

    Product.findById(id)
        .select('PRODUCT_ID _id')
        .exec()
        .then(doc => {
            var Img_id = "img_" + doc.PRODUCT_ID;
            console.log("img_id", Img_id);

            if (Product.findById(req.body.PRODUCT_ID) && Img_id.length > 0) {
                const productimage = new Product_images({
                    _id: new mongoose.Types.ObjectId(),
                    PRODUCT_IMAGE_ID: Img_id.toLowerCase(),
                    PRODUCT_ID: req.body.PRODUCT_ID,
                    PRODUCT_IMAGE_REF_1: req.file.path,
                    UPDATED_BY: req.body.UPDATED_BY,
                    UPDATED_DATE: new Date(),
                    ACTIVE_FLAG: req.body.ACTIVE_FLAG
                });
                productimage
                    .save()
                    .then(result => {
                        //console.log(result);
                        res.status(201).json({
                            status: "success",
                            data: {
                                message: "Product image list created successfully"
                            }
                        });
                    }).catch(err => {
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
                res.status(500).json({
                    status: "error",
                    error: "",
                    data: {
                        message: "Please check the entered details"
                    }
                });
            }
        }).catch(err => {
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

//get product image details by id
exports.image_get_image = (req, res, next) => {
    const id = req.params.productimageId;
    Product_images.find({PRODUCT_IMAGE_ID:id})
        .select('PRODUCT_IMAGE_ID PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
        .populate('PRODUCT_ID')
        .exec()
        .then(docs => {

            if(docs.length > 0)
            {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        product_images: docs.map(doc => {
                            return {
                                doc_id: doc._id,
                                product_image_id: doc.PRODUCT_IMAGE_ID,
                                product_name: doc.PRODUCT_ID.PRODUCT_NAME,
                                product_image_link: doc.PRODUCT_IMAGE_REF_1,
                                updated_by: doc.UPDATED_BY,
                                updated_date: doc.UPDATED_DATE,
                                isActive: doc.ACTIVE_FLAG
                            };
                        })
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status: "failure",
                    error: "",
                    data: {
                        message: "No images have been found"
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

//update product image details by id
exports.image_update_image = (req, res, next) =>  {
    const id = req.params.productimageId;
    const updateOps = {};
    updateOps['PRODUCT_IMAGE_REF_1'] = req.file.path ;

    Product_images.update({ PRODUCT_IMAGE_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: 'product image updated'
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

//Delete product image details by id
exports.image_delete = (req, res, next) => {
    const id = req.params.productimageId;
    //Product_images.find({PRODUCT_IMAGE_ID: id});
    Product_images.remove({ PRODUCT_IMAGE_ID: id })
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