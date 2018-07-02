const mongoose = require("mongoose");
const Filters = require("../models/filters");

//get all active filter categories
exports.filter_category_get_all = (req, res, next) => {
    Filters.find({ACTIVE_FLAG:'Y'})
        .select('FILTER_ID FILTER_CATEGORY_NAME UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                const response = {
                    seller_categories: docs.map(doc => {
                        return {
                            doc_id: doc._id,
                            filter_id: doc.FILTER_ID,
                            filter_category_name: doc.FILTER_CATEGORY_NAME,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
                };
                // if (docs.length >= 0) {
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
                        message: 'No filter types found'
                    }
                });
            }

        })
        .catch(err => {

            res.status(500).json({
                status: "error",
                error: err,
                data:{
                    message: "Internal server error!"
                }
            });
        });
};


//create a new filter category --NOT USED ANYMORE, DONE DIRECTLY WHILE LINKING CATEGORIES
exports.filter_create_category = (req, res, next) =>{

    var fil_id = req.body.FILTER_CATEGORY_NAME.replace(/[^a-zA-Z0-9]/g,'-');

    if(fil_id.length > 0)
    {
        const filter = new Filters({
            _id: new mongoose.Types.ObjectId(),
            FILTER_ID: fil_id.toLowerCase(),
            FILTER_CATEGORY_NAME: req.body.FILTER_CATEGORY_NAME.toLowerCase(),
            UPDATED_BY: req.body.UPDATED_BY,
            UPDATED_DATE: new Date(),
            ACTIVE_FLAG: req.body.ACTIVE_FLAG
        });
        filter
            .save()
            .then(result => {

                res.status(201).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        message: "Filter type created successfully"
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
    }

};

//get filter_category by id
exports.filter_category_get_by_id = (req, res, next) =>{
    const id = req.params.filter_categoryId;
    Filters.find({FILTER_ID: id})
        .select('FILTER_ID FILTER_CATEGORY_NAME UPDATED_BY UPDATED_DATE ACTIVE_FLAG _id')
        .exec()
        .then(docs => {
            if(docs.length > 0)
            {
                const response = {
                    //count: docs.length,
                    seller_categories: docs.map(doc => {
                        return {
                            doc_id: doc._id,
                            filter_id: doc.FILTER_ID,
                            filter_category_name: doc.FILTER_CATEGORY_NAME,
                            updated_by_user: doc.UPDATED_BY,
                            updated_on: doc.UPDATED_DATE,
                            isActive: doc.ACTIVE_FLAG
                        };
                    })
                };
                // if (docs.length >= 0) {
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
                    status:"failure",
                    data: {
                        message: 'No filter types found'
                    }
                });
            }

        })
        .catch(err => {

            res.status(500).json({
                status: "error",
                error: err,
                data:{
                    message: "Internal server error!"
                }
            });
        });
};

//update filter_category details by id
exports.filter_category_update_by_id = (req, res, next) =>{
    const id = req.params.filter_categoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Filters.update({ FILTER_ID: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: "filter_category updated"
                }
            });
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

//delete a filter_category by id
exports.filter_category_delete_by_id = (req, res, next) =>{
    const id = req.params.filter_categoryId;
    Filters.remove({ FILTER_ID: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: 'filter_category deleted'
                }
            });
        })
        .catch(err => {

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
