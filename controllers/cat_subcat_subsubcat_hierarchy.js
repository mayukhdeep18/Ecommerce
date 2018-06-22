const Category = require("../models/category");
const SubCategory = require("../models/subcategory");
const SubSubCategory = require("../models/subsubcategory");


//get sub category and sub sub category hierarchy by category id
exports.get_category_hierarchy = (req, res, next) => {
    const id = req.params.categoryId;
    var subsub_cat_arr = [];
    var subcat_arr = [];
    var sub_cat_hier = [];
    var final_cat_arr = [];

    Category.find({CATEGORY_ID: id})
        .select('PRODUCT_CATEGORY_NAME _id')
        .exec()
        .then(cat_find => {

           // console.log('cat_id',cat_find[0]._id);

            //look up sub category details on basis of category id
            SubCategory.find({PRODUCT_CATEGORY_ID: cat_find[0]._id})
                .select('SUB_CATEGORY_ID PRODUCT_SUB_CATEGORY_NAME _id')
                .populate('PRODUCT_CATEGORY_ID')
                .exec()
                .then(fil_subcat => {
                    if(fil_subcat)
                    {
                        //iterate through all the sub category fetched
                        for( var item_1 of fil_subcat)
                        {
                            //create an array with the sub category id and sub category name
                            subcat_arr.push({sub_cat_id: item_1.SUB_CATEGORY_ID, sub_cat_name: item_1.PRODUCT_SUB_CATEGORY_NAME})
                        }

                        //look up sub sub category details on the basis of category id
                        SubSubCategory.find({CATEGORY_ID: cat_find[0]._id})
                            .select("SUB_SUB_CATEGORY_ID SUB_SUB_CATEGORY_NAME _id")
                            .populate('SUB_CATEGORY_ID')
                            .exec()
                            .then(doc => {

                                //traverse through array with the sub category id and sub category name
                                for(var item of subcat_arr)
                                {
                                    //traverse through the sub sub category object looked up on the basis of category id
                                    for(var item_2 of doc)
                                    {
                                        //store the sub category id from the sub category and sub category id from the sub sub category table in a temp variable
                                        var outer_id = item.sub_cat_id;
                                        var inner_id = item_2.SUB_CATEGORY_ID.SUB_CATEGORY_ID;

                                        //if both the above sub category id are equal then create an array with the sub sub category values for the corresponding array
                                        if (outer_id === inner_id)
                                        {
                                            subsub_cat_arr.push({sub_sub_cat_id: item_2.SUB_SUB_CATEGORY_ID,
                                                sub_sub_cat_name: item_2.SUB_SUB_CATEGORY_NAME });

                                        }
                                    }

                                    //push the sub sub category array and the corresponding sub category array in the sub category hierarchy array
                                    sub_cat_hier.push({sub_category: item, sub_sub_category: subsub_cat_arr})

                                    //clear the temporary array to store sub sub category array
                                    subsub_cat_arr = [];
                                }

                                // look up category details on the basis of category id
                                Category.find({CATEGORY_ID: id})
                                    .select("CATEGORY_ID PRODUCT_CATEGORY_NAME _id")
                                    .exec()
                                    .then(doc_2 => {

                                       // console.log('category',doc_2);

                                        //push the category details and the sub category hierarchy array in the final array
                                        final_cat_arr.push({category_id: doc_2[0].CATEGORY_ID,
                                            category_name: doc_2[0].PRODUCT_CATEGORY_NAME,
                                            subcategories: sub_cat_hier});

                                        //final output
                                        res.status(200).json({
                                            status: "success",
                                            data: {
                                                category_hierarchy: final_cat_arr
                                            }
                                        });
                                    })
                            })
                    }
                    else {
                        res
                            .status(404)
                            .json({
                                status: "error",
                                error: "Id not found",
                                message: "No valid entry found for provided category ID"
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

