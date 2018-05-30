const Filter_category = require("../models/filters_categories");
const Filter_options = require("../models/filter_options");
const Filter_options_product = require("../models/filter_options_products");
const Product = require("../models/product_details");
const Ecommerce_prod_details = require("../models/ecommerce_product_details");


//get product and filter details by sub category id
exports.get_product_by_subcategoryId = (req, res, next) => {
    const id = req.params.subcategoryId;
    var fil_arr = [];
    var fil_cat_arr = [];
    var final_arr = [];

    var prod_arr = [];
    var prod_cat_arr = [];
    var prod_final_arr = [];

    //look up filter id on basis of sub category id
    Filter_category.find({SUB_CATEGORY_ID: id})
        .select('SUB_CATEGORY_ID')
        .populate('FILTER_ID')
        .exec()
        .then(fil_cat => {
            if(fil_cat)
            {
                //iterate through all the filter details fetched
                for( var item_1 of fil_cat)
                {
                    //create an array with the filter id and filter type name
                    fil_cat_arr.push({FILTER_TYPE: item_1.FILTER_ID._id, FILTER_NAME: item_1.FILTER_ID.FILTER_CATEGORY_NAME})
                }

                //look up filter options on the basis of sub category id
                Filter_options.find({SUB_CATEGORY_ID: id})
                    .select("DISPLAY_TEXT ACTIVE_FLAG _id")
                    .populate('FILTER_ID')
                    .exec()
                    .then(doc => {

                        //traverse through array with the filter id and filter type name
                        for(var item of fil_cat_arr)
                        {
                            //store the filter type name in a temp variable
                            var filter_name = item.FILTER_NAME;

                            //traverse through the filter options object looked up on the basis of category id
                            for(var item_2 of doc)
                            {
                                //store the filter type id from the filter table and filter type id from the filter options table in a temp variable
                                var outer_id = item.FILTER_TYPE;
                                var inner_id = item_2.FILTER_ID._id;

                                //if both the above filter id are equal then create an array with the filter option values for the corresponding array
                                if (outer_id.equals(inner_id))
                                {
                                    fil_arr.push(item_2.DISPLAY_TEXT);

                                }
                            }

                            //push the filter options array and the corresponding filter type name in the final array
                            final_arr.push({fil_type: filter_name, fil_value: fil_arr})

                            //clear the temporary array to store filter options value
                            fil_arr = [];
                        }

                        // look up ecommerce product details and product details on the basis of sub category id
                        Product.find({PRODUCT_SUB_CATEGORY_ID: id})
                            .select("PRODUCT_NAME PRODUCT_SUB_TITLE PRODUCT_DESCRIPTION PRODUCT_PRICE PRODUCT_SPECIFICATIONS ACTIVE_FLAG _id")
                            .populate('PRODUCT_IMAGE_ID')
                            .populate('ECOMMERCE_CATEGORY_ID')
                            .populate('ECOMMERCE_PRODUCT_DETAILS_ID')
                            .exec()
                            .then(doc_2 => {

                                //iterate through all the product details fetched
                                for( var prod_item of doc_2)
                                {
                                    //create an array with the product id, product name, product specifications, product price, product image url
                                    prod_cat_arr.push({prod_id: prod_item._id,
                                        prod_name: prod_item.PRODUCT_NAME,
                                        prod_spec: JSON.parse(prod_item.PRODUCT_SPECIFICATIONS),
                                        prod_price: prod_item.PRODUCT_PRICE,
                                        prod_img_url: prod_item.PRODUCT_IMAGE_ID.PRODUCT_IMAGE_REF_1})
                                }

                                //look up ecommerce details on the basis of sub category id
                                Ecommerce_prod_details.find({SUB_CATEGORY_ID: id})
                                    .select("ECOMMERCE_PRODUCT_PRICE PRODUCT_URL _id")
                                    .populate('ECOMMERCE_CATEGORY_ID')
                                    .populate('PRODUCT_ID')
                                    .exec()
                                    .then(ecom_doc => {

                                        //traverse through array with product details
                                        for (var prod_cat_item of prod_cat_arr) {

                                            //traverse through the ecommerce details object looked up on the basis of category id
                                            for (var ecom_item of ecom_doc) {
                                                //store the product id from the product table and product id from the ecommerce details table in a temp variable
                                                var outer_id = prod_cat_item.prod_id;
                                                var inner_id = ecom_item.PRODUCT_ID._id;

                                                //if both the above product id are equal then create an array with the ecommerce detail values for the corresponding array
                                                if (outer_id.equals(inner_id)) {
                                                    prod_arr.push({
                                                        ecomm_price: ecom_item.ECOMMERCE_PRODUCT_PRICE,
                                                        ecomm_url: ecom_item.PRODUCT_URL,
                                                        ecom_name: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_NAME,
                                                        ecom_logo: ecom_item.ECOMMERCE_CATEGORY_ID.ECOMMERCE_LOGO
                                                    });

                                                }
                                            }

                                            //push the ecommerce details array and the corresponding product details in the final array
                                            prod_final_arr.push({prod_details: prod_cat_item, ecom_details: prod_arr})

                                            //clear the temporary array to store filter options value
                                            prod_arr = [];
                                        }

                                        //final output
                                        res.status(200).json({
                                            status: "success",
                                            error: "",
                                            data: {
                                                filters: final_arr,
                                                product_details: prod_final_arr
                                            }
                                        });
                                    })
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
