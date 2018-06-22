const mongoose = require("mongoose");
const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const SubSubCategory = require("../models/subsubcategory");

//get subcategory details by category id
exports.subsubcategory_get_by_subcategoryId = (req, res, next) => {
    const id = req.params.subcategoryId;

    Subcategory.find({SUB_CATEGORY_ID: id})
        .select('SUB_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME _id')
        .exec()
        .then(sub_res => {
            SubSubCategory.find({SUB_CATEGORY_ID: sub_res[0]._id})
                .select("SUB_SUB_CATEGORY_ID SUB_SUB_CATEGORY_NAME ACTIVE_FLAG _id")
                //.populate('PRODUCT_CATEGORY_NAME')
                .exec()
                .then(docs => {
                    console.log("From database", docs);
                    if (docs) {
                        res.status(200).json({
                            status: "success",
                            data: {
                                subcategory_subsubcategory_hierarchy: docs
                            }
                        });
                    } else {
                        res
                            .status(404)
                            .json({
                                status: "error",
                                error: "Id not found",
                                message: "No valid entry found for provided subcategory ID"
                            });
                    }
                })
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