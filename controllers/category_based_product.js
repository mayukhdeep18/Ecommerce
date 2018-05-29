const async = require("async");
const Filter_category = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");


//get product and filter details by category id
exports.get_product_by_categoryId = (req, res, next) => {
    const id = req.params.categoryId;

    var fil_arr = [];
    var fil_type_opt_arr = [];
    var final_arr = [];
    var fil_opt_arr = [];
    var output = [];

   function get_filter(id,callback) {
       Filter_category.find({CATEGORY_ID: id})
           .select('CATEGORY_ID _id')
           .populate('FILTER_ID')
           .exec(function (err, docs_1) {
               if (err) {
                   console.log(err);
               }
               else if (docs_1) {
                   Promise.resolve((() => {
                       let new_arr = [];
                       for (let m of docs_1) {
                           //console.log(m.FILTER_ID._id);
                           new_arr.push(get_filter_values(m.FILTER_ID._id));
                           console.log("output", get_filter_values(m.FILTER_ID._id));
                           //console.log("sar",new_arr);

                       }
                       return new_arr;
                   })
                   ()).then((docs_3) => {
                       console.log("then block", docs_3);
                   }).catch((err) => {
                       console.log(err);
                   });
               }
           })
   }


                   /*
                    for (var filter_type of docs_1)
                    {
                        var filter_id = filter_type.FILTER_ID._id;
                        //fil_arr.push(filter_id);
                        get_filter_values(filter_id,function (res) {

                            final_arr.push({filter_type: res[0].filter_type, filter_value: res[0].filter_value});
                            //console.log("sar",final_arr);
                            return callback(final_arr);
                        })
                    }
                    console.log("final_array",final_arr);*/

                    //var fil_arr_len = fil_arr.length;

                 /* for (var filter_type_id of fil_arr)
                    {
                        get_filter_values(filter_type_id,function (res) {

                            final_arr.push({filter_type: res[0].filter_type, filter_value: res[0].filter_value});
                            //console.log("sar",final_arr);
                            return callback(final_arr);

                        })

                       console.log("sar2",final_arr);

                    }
                    console.log("sar",final_arr);
                }
                else
                {
                    res
                        .status(404)
                        .json({
                            status: "error",
                            error: "Id not found",
                            message: "No valid entry found for provided ID"
                        });
                }

            })
    }*/

   function get_filter_values(filter_type_id,callback)
   {
       Filter_options.find({FILTER_ID: filter_type_id})
           .select('DISPLAY_TEXT URL_SLUG')
           .populate('FILTER_ID')
           .exec(function (err,docs_2) {
               if(err)
               {
                   console.log(err);
               }
               else if (docs_2.length >0)
               {
                   fil_opt_arr = [];
                   fil_type_opt_arr = [];

                   for (var filter_options of docs_2)
                   {
                       fil_opt_arr.push(
                           filter_options.DISPLAY_TEXT
                       );
                   }

                   fil_type_opt_arr.push({filter_type: filter_options.FILTER_ID.FILTER_CATEGORY_NAME, filter_value: fil_opt_arr});
                   return callback(fil_type_opt_arr);
               }
           })
   }


get_filter(id,function (response) {
console.log(response);
})


};
