const mongoose = require("mongoose");
const Ecommerce_category = require("../models/ecommerce_category");

//get all active ecommerce category details
exports.ecomm_category_get_all = (req, res, next) => {
    Ecommerce_category.find({ACTIVE_FLAG:'Y'})
        .select('ECOMMERCE_NAME ECOMMERCE_DESCRIPTION ECOMMERCE_LOGO ECOMMERCE_WEB_URL ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    ecommerce_details: docs.map(doc => {
                        return {
                            ecommerce_id: doc._id,
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



//create ecommerce category
exports.ecommerce_create_category = (req, res, next) =>  {
    /* Product_details.findById(req.body.PRODUCT_ID)
         .then(product => {
             if (!product) {
                 return res.status(404).json({
                     message: "Product not found"
                 });
             }
             const productimage = new Ecommerce_category({
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
    const ecommerce_category = new Ecommerce_category({
        _id: new mongoose.Types.ObjectId(),
        //PRODUCT_ID: req.body.PRODUCT_ID,
        ECOMMERCE_NAME: req.body.ECOMMERCE_NAME,
        ECOMMERCE_DESCRIPTION: req.body.ECOMMERCE_DESCRIPTION,
        ECOMMERCE_LOGO: req.file.path,
        ECOMMERCE_WEB_URL: req.body.ECOMMERCE_WEB_URL,
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
                    message: "Product image list created successfully",
                    createdProductimage: {
                        ecommerce_id: result.ECOMMERCE_ID,
                        ecommerce_name: result.ECOMMERCE_NAME,
                        ecommerce_description: result.ECOMMERCE_DESCRIPTION,
                        ecommerce_logo: result.ECOMMERCE_LOGO,
                        ecommerce_web_url: result.ECOMMERCE_WEB_URL,
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

//get  ecommerce category details by id
exports.ecommerce_category_get_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    Ecommerce_category.findById(id)
        .select('ECOMMERCE_NAME ECOMMERCE_DESCRIPTION ECOMMERCE_LOGO ECOMMERCE_WEB_URL ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        ecommerce_category: doc
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

//update ecommerce category details by id
exports.ecommerce_category_update_by_id = (req, res, next) =>  {
    const id = req.params.ecommcategoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Ecommerce_category.update({ _id: id }, { $set: updateOps })
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

//Delete ecommerce category details by id
exports.ecommerce_category_delete_by_id = (req, res, next) => {
    const id = req.params.ecommcategoryId;
    Ecommerce_category.findById(id);

    Ecommerce_category.remove({ _id: id })
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