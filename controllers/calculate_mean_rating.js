
const Product = require("../models/product_details");
const Rating = require("../models/rating_details");


//get all active product details
exports.product_update_rating = (req, res, next) => {

    const id = req.params.productId;
    var sum_rating = 0;
    var counter = 0;
    var mean_rating;


    //look up filter options on the basis of category id
    Rating.find({PRODUCT_ID: id})
        .select("RATING_NUMBER PRODUCT_ID _id")
        .exec()
        .then(doc => {

            if(doc)
            {
                for(var item of doc)
                {
                    sum_rating = sum_rating + item.RATING_NUMBER;
                    counter++;
                }

                mean_rating = sum_rating/counter;
                console.log("rating", mean_rating);

                const updateOps = {};
                    updateOps['MEAN_RATING'] = mean_rating;

                Product.update({ _id: id }, { $set: updateOps })
                    .exec()
                    .then(result => {
                        res.status(200).json({
                            status: "success",
                            error: "",
                            data: {
                                message: 'product rating updated'
                            }
                        });
                    })
            }
            else
            {
                res.status(500).json({
                    status: "error",
                    error: "",
                    data: {
                       message: "rating not found for given product id"
                    }
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "success",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};

