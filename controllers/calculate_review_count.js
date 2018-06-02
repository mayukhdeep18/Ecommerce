
const Product = require("../models/product_details");
const Review = require("../models/review_details");


//get all active product details
exports.product_update_review = (req, res, next) => {

    const id = req.params.productId;

    var counter = 0;

    //look up filter options on the basis of category id
    Review.find({PRODUCT_ID: id})
        .select("REVIEW_TITLE PRODUCT_ID _id")
        .exec()
        .then(doc => {

            if(doc)
            {
                for(var item of doc)
                {
                    counter++;
                }

                console.log("rating", counter);

                const updateOps = {};
                updateOps['REVIEW_COUNT'] = counter;

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

