const mongoose = require("mongoose");
const Product_images = require("../models/product_images");

//get all active product image details
exports.images_get_all = (req, res, next) => {
    Product_images.find({ACTIVE_FLAG:'Y'})
        .select('PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
        // .populate('PRODUCT_ID','PRODUCT_NAME')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    productimages: docs.map(doc => {
                        return {
                            _id: doc._id,
                            PRODUCT_IMAGE_REF_1: doc.PRODUCT_IMAGE_REF_1,
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
};


//get all product image details by active flag
exports.images_get_all_flag = (req, res, next) => {
    const actFlag = req.params.activeFlag;
    if (actFlag === 'Y') {
        Product_images.find({ACTIVE_FLAG: 'Y'})
            .select('PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
            // .populate('PRODUCT_ID','PRODUCT_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        productimages: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_IMAGE_REF_1: doc.PRODUCT_IMAGE_REF_1,
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
        Product_images.find({ACTIVE_FLAG: 'N'})
            .select('PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
            // .populate('PRODUCT_ID','PRODUCT_NAME')
            .exec()
            .then(docs => {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        productimages: docs.map(doc => {
                            return {
                                _id: doc._id,
                                PRODUCT_IMAGE_REF_1: doc.PRODUCT_IMAGE_REF_1,
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

//upload image by product id
exports.image_upload = (req, res, next) =>  {
    /* Product_details.findById(req.body.PRODUCT_ID)
         .then(product => {
             if (!product) {
                 return res.status(404).json({
                     message: "Product not found"
                 });
             }
             const productimage = new Product_images({
                 _id: new mongoose.Types.ObjectId(),
                 //PRODUCT_ID: req.body.PRODUCT_ID,
                 PRODUCT_IMAGE_REF_1: req.files[0].path,
                 PRODUCT_IMAGE_REF_2: req.files[1].path,
                 PRODUCT_IMAGE_REF_3: req.files[2].path,
                 PRODUCT_IMAGE_REF_4: req.files[3].path,
                 PRODUCT_IMAGE_REF_5: req.files[4].path,
                 PRODUCT_IMAGE_REF_6: req.files[5].path,
                 PRODUCT_IMAGE_REF_7: req.files[6].path,
                 PRODUCT_IMAGE_REF_8: req.files[7].path,
                 UPDATED_BY: req.body.UPDATED_BY,
                 UPDATED_DATE: new Date(),
                 ACTIVE_FLAG: req.body.ACTIVE_FLAG
             });
             return productimage.save();
         })
         .then(result => {
             console.log(result);
             res.status(201).json({
                 message: "Product images stored",
                 createdProductimage: {
                     _id: result._id,
                     //PRODUCT_ID: result.PRODUCT_ID,
                     PRODUCT_IMAGE_REF_1: result.PRODUCT_IMAGE_REF_1,
                     PRODUCT_IMAGE_REF_2: result.PRODUCT_IMAGE_REF_2,
                     PRODUCT_IMAGE_REF_3: result.PRODUCT_IMAGE_REF_3,
                     PRODUCT_IMAGE_REF_4: result.PRODUCT_IMAGE_REF_4,
                     PRODUCT_IMAGE_REF_5: result.PRODUCT_IMAGE_REF_5,
                     PRODUCT_IMAGE_REF_6: result.PRODUCT_IMAGE_REF_6,
                     PRODUCT_IMAGE_REF_7: result.PRODUCT_IMAGE_REF_7,
                     PRODUCT_IMAGE_REF_8: result.PRODUCT_IMAGE_REF_8,
                     UPDATED_BY: result.UPDATED_BY,
                     UPDATED_DATE: result.UPDATED_DATE,
                     ACTIVE_FLAG: result.ACTIVE_FLAG
                 },
                 request: {
                     type: "GET",
                     url: "http://localhost:3000/product_images/" + result._id
                 }
             });
         })
         .catch(err => {
             console.log(err);
             res.status(500).json({
                 error: err
             });
         });
 });*/
    const productimage = new Product_images({
        _id: new mongoose.Types.ObjectId(),
        //PRODUCT_ID: req.body.PRODUCT_ID,
        PRODUCT_IMAGE_REF_1: req.file.path,
        UPDATED_BY: req.body.UPDATED_BY,
        UPDATED_DATE: new Date(),
        ACTIVE_FLAG: req.body.ACTIVE_FLAG
    });
    productimage
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                status: "success",
                error: "",
                data: {
                    message: "Product image list created successfully",
                    createdProductimage: {
                        _id: result._id,
                        //PRODUCT_ID: result.PRODUCT_ID,
                        PRODUCT_IMAGE_REF_1: result.PRODUCT_IMAGE_REF_1,
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

//get product image details by id
exports.image_get_image = (req, res, next) => {
    const id = req.params.productimageId;
    Product_images.findById(id)
        .select('PRODUCT_IMAGE_REF_1 ACTIVE_FLAG _id')
        // .populate('PRODUCT_ID','PRODUCT_NAME')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        productimages: doc
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

//update product image details by id
exports.image_update_image = (req, res, next) =>  {
    const id = req.params.productimageId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product_images.update({ _id: id }, { $set: updateOps })
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
    Product_images.findById(id);

    Product_images.remove({ _id: id })
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