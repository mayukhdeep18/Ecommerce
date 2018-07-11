const mongoose = require("mongoose");
const Banner = require("../models/banner");

//add in banner table
exports.banner_create = (req, res, next) => {
    var ban_id = req.body.BANNER_NAME.replace(/[^a-zA-Z0-9]/g,'-') ;

    Banner.find({BANNER_ID: ban_id.toLowerCase()})
        .select('BANNER_ID ACTIVE_FLAG _id')
        .exec()
        .then(doc => {

            if(doc.length > 0)
            {
                res.status(500).json({
                    status: "error",
                    data: {
                        message: "Product already exists in trending!"
                    }

                });
            }
            else
            {
                const banner = new Banner({
                    _id: new mongoose.Types.ObjectId(),
                    BANNER_ID: ban_id.toLowerCase() ,
                    BANNER_NAME: req.body.BANNER_NAME,
                    BANNER_PICTURE: req.body.BANNER_PICTURE,
                    BANNER_PRODUCT_URL: req.body.BANNER_PRODUCT_URL,
                    UPDATED_DATE: new Date(),
                    ACTIVE_FLAG: req.body.ACTIVE_FLAG
                });
                banner
                    .save()
                    .then(result => {
                        res.status(201).json({
                            status: "success",
                            data: {
                                message: "Banner details stored"
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
};

//get all trending products
exports.get_all_banner = (req, res, next) => {
    Banner.find()
        .select('BANNER_ID BANNER_NAME BANNER_PICTURE BANNER_PRODUCT_URL UPDATED_DATE UPDATED_BY ACTIVE_FLAG _id')
        .populate('PRODUCT_ID')
        .exec()
        .then(docs => {

            if (docs.length > 0) {
                const response = {
                    trending: docs.map(prod_item => {
                        return {
                           banner_doc_id: prod_item._id,
                           banner_id: prod_item.BANNER_ID,
                           banner_name: prod_item.BANNER_NAME,
                           banner_picture: prod_item.BANNER_PICTURE,
                           banner_prod_url: prod_item.BANNER_PRODUCT_URL,
                            updated_by_user: prod_item.UPDATED_BY,
                            updated_on: prod_item.UPDATED_DATE,
                            isActive: prod_item.ACTIVE_FLAG
                        }
                    })
                };
                res.status(200).json({
                    status:"success",
                    data: {
                        response
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status:"error",
                    data: {
                        message: 'No banner products found!'
                    }
                });
            }
        }).catch(err => {
        console.log(err);
        res.status(500).json({
            status: "error",
            error: err,
            data:{
                message: "Internal server error!"
            }
        });
    });
};

//get banner details by id
exports.banner_get_by_id = (req, res, next) => {
    var id = req.params.bannerId;
    Banner.find({BANNER_ID: id})
        .select('BANNER_ID BANNER_NAME BANNER_PICTURE BANNER_PRODUCT_URL UPDATED_DATE UPDATED_BY ACTIVE_FLAG _id')
        .populate('PRODUCT_ID')
        .exec()
        .then(docs => {

            if (docs.length > 0) {
                const response = {
                    trending: docs.map(prod_item => {
                        return {
                            banner_doc_id: prod_item._id,
                            banner_id: prod_item.BANNER_ID,
                            banner_name: prod_item.BANNER_NAME,
                            banner_picture: prod_item.BANNER_PICTURE,
                            banner_prod_url: prod_item.BANNER_PRODUCT_URL,
                            updated_by_user: prod_item.UPDATED_BY,
                            updated_on: prod_item.UPDATED_DATE,
                            isActive: prod_item.ACTIVE_FLAG
                        }
                    })
                };
                res.status(200).json({
                    status:"success",
                    data: {
                        response
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status:"error",
                    data: {
                        message: 'No banner products found!'
                    }
                });
            }
        }).catch(err => {
        console.log(err);
        res.status(500).json({
            status: "error",
            error: err,
            data:{
                message: "Internal server error!"
            }
        });
    });
};

//update banner product
exports.banner_update_by_id = (req, res, next) =>{
    const id = req.params.bannerId;
    var ban_id = req.body.BANNER_NAME.replace(/[^a-zA-Z0-9]/g,'-') ;

    const updateOps = {};

    updateOps['BANNER_ID'] = ban_id.toLowerCase();
        updateOps['BANNER_NAME']= req.body.BANNER_NAME;
        updateOps['BANNER_PICTURE']= req.body.BANNER_PICTURE;
        updateOps['BANNER_PRODUCT_URL']= req.body.BANNER_PRODUCT_URL;
    updateOps['ACTIVE_FLAG'] = req.body.ACTIVE_FLAG;
    updateOps['UPDATED_DATE'] = new Date();
    Banner.update({ BANNER_ID: id }, { $set: updateOps },{multi: true})
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: "banner details updated"
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

//delete a banner product by id
exports.banner_delete = (req, res, next) =>{
    const id = req.params.bannerId;
    Banner.remove({ BANNER_ID: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: 'banner product deleted'
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