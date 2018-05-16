const mongoose = require("mongoose");
const shape = require('shape-json');
const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const SubSubCategory = require("../models/subsubcategory");


//get category by id
exports.category_get_all_by_id = (req, res, next) => {
 const id = req.params.categoryId;
 var rest = [];
    SubCategory.find({PRODUCT_CATEGORY_ID:id}).select('PRODUCT_SUB_CATEGORY_NAME')
        .exec()
        .then(docs => {
            console.log("From database", docs);
            docs.forEach(
                function (hierarchy) {
                    //hierarchy.subcategories = SubCategory.find({PRODUCT_CATEGORY_ID:id}).toArray();


                    SubSubCategory.find({PRODUCT_SUB_CATEGORY_ID: hierarchy._id}).select('PRODUCT_SUB_SUB_CATEGORY_NAME _id')
                        .exec().then(result=>{
                            hierarchy.subcategories = result.toArray();
                            //CategorySchema.insert(hierarchy);
                    });


                        //.populate('PRODUCT_SUB_CATEGORY_NAME _id')
                        //.exec()
                        //.then(result =>{
                       // hierarchy.subcategories = result;
                            res.status(200).json({
                                status: "success",
                                error: "",
                                data: {
                                    subcategory_hierarchy:hierarchy
                                }
                            });
                        //})
                }
            );

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
 /*

    (
       function (err,hierarchy) {
           //console.log(err);
           if(err){
              // console.log(err);
               return next(err);

           }

           hierarchy.subcategories = SubCategory.find({PRODUCT_CATEGORY_ID:id}).toArray();
           hierarchy.susubcategories = SubSubCategory.find({PRODUCT_SUB_CATEGORY_ID:subcategories._id}).toArray();
           res.status(200).json({
               status: "success",
               error: "",
               data: {
                   subcategory_hierarchy: hierarchy
               }
           });
       }

   );

*/
};
