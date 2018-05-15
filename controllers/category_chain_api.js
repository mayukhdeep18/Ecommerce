const mongoose = require("mongoose");
const shape = require('shape-json');
const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const SubSubCategory = require("../models/subsubcategory");

//get category by id
exports.category_get_all = (req, res, next) => {

    const id = req.params.categoryId;
    var sub_category_arr = [];
    var sub_sub_category_arr = [];

    //get category name
    var query = Category.findById(id).select('PRODUCT_CATEGORY_NAME -_id');
    query.exec(function (err, result) {
        if (err) {
            return next(err);
        }

        //get sub category count on basis of category id
        var sub_count = SubCategory.count({PRODUCT_CATEGORY_ID: id});
        sub_count.exec(function (err, count) {
            if (err) {
                return next(err);
            }
            //loop through sub categories
            for (var i = 0; i < count-1; i++) {
                var sub_cat = SubCategory.find({PRODUCT_CATEGORY_ID: id}).select('PRODUCT_SUB_CATEGORY_NAME _id');
                sub_cat.exec(function (err, sub_cat_arr) {
                    if (err) {
                        return next(err);
                    }

                    //store sub category details in array
                    sub_category_arr[i] = sub_cat_arr;

                 // console.log(sub_category_arr[i]['_id']);

                  var new_data = sub_category_arr[i];
                  new_data.forEach(function (item) {
                     //console.log(item._id);

                      //get sub sub category count on basis of sub category id
                      var sub_sub_count = SubSubCategory.count({PRODUCT_SUB_CATEGORY_ID:item._id});
                      sub_sub_count.exec(function (err, count_sub) {
                          if (err) {
                              return next(err);
                          }

                          //loop through sub sub categories
                          for (var j = 0; j < count_sub - 1; j++) {
                              var sub_sub_cat = SubSubCategory.find({PRODUCT_SUB_CATEGORY_ID: item._id}).select('PRODUCT_SUB_CATEGORY_ID PRODUCT_SUB_SUB_CATEGORY_NAME _id');
                              sub_sub_cat.exec(function (err, sub_sub_cat_arr) {
                                  if (err) {
                                      return next(err);
                                  }

                                  //store sub sub categories in array
                                  sub_sub_category_arr[i] = sub_sub_cat_arr;


                              })
                          }
                          //display result
                          res.status(200).json({
                              status: "success",
                              error_msg: "",
                              data: {
                                  category: result.PRODUCT_CATEGORY_NAME,
                                  subcategory_id: item._id,
                                  subcategory_name: item.PRODUCT_SUB_CATEGORY_NAME,
                                  sub_sub_category_id: sub_sub_category_arr[j]
                              }


                          });
                      });
                  });

                    })

                }
            })
        })
    };



/*
    Category.findById(id)
        .select('PRODUCT_CATEGORY_NAME ACTIVE_FLAG _id')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status:"success",
                    error_msg:"",
                    data: {
                        category: doc
                       // subcategory: SubCategory6.find({PRODUCT_CATEGORY_ID: req.params.categoryId}).populate('PRODUCT_SUB_CATEGORY_NAME')
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

*/


