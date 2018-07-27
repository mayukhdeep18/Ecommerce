/*
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
*/
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const categoryRoutes = require("./routes/category");
const catflagRoutes = require("./routes/category_flag");
const subcategoryRoutes = require("./routes/subcategory");
const subcatflagRoutes = require("./routes/subcategory_flag");
const productimageRoutes = require("./routes/product_images");
const prodimageflagRoutes = require("./routes/product_images_flag");
const userRoutes = require('./routes/user');
const subsubcategoryRoutes = require("./routes/subsubcategory");
const subsubcatflagRoutes = require("./routes/subsubcategory_flag");
const sellercategoryRoutes = require("./routes/seller_category");
const sellercatflagRoutes = require("./routes/seller_category_flag");
const sellersubcategoryRoutes = require("./routes/seller_subcategory");
const sellersubcatflagRoutes = require("./routes/seller_subcategory_flag");
const EcommercecategoryRoutes = require("./routes/ecommerce_category");
const EcommercecatflagRoutes = require("./routes/ecommerce_category_flag");
const CategoryChainRoutes = require("./routes/category_chain_api");
const CategorySubCategoryHierarchyRoutes = require("./routes/category_subcategory_hierarchy");
const SubcategorySubSubCategoryHierarchyRoutes = require("./routes/subcategory_subsubcategory_hierarchy");
const CatSubcatSubsubcatHierarchy = require("./routes/cat_subcat_subsubcat_hierarchy");
const EcommProductCategoryRoutes = require("./routes/ecommerce_product_details");
const EcommProdFlagCategoryRoutes = require("./routes/ecommerce_product_details_flag");
const ProductCategoryRoutes = require("./routes/product_details");
const ProductFlagCategoryRoutes = require("./routes/product_details_flag");
const FilterCategoryRoutes = require("./routes/filters");
const FilterFlagRoutes = require("./routes/filters_flag");
const FiltersCategoriesRoutes = require("./routes/filters_categories");
const FilterCategoriesFlagRoutes = require("./routes/filters_categories_flag");
const FilterOptionRoutes = require("./routes/filter_options");
const FilterOptionFlagRoutes = require("./routes/filter_options_flag");
const FilterOptProdRoutes = require("./routes/filter_options_products");
const FilterOptProdFlagRoutes = require("./routes/filter_options_products_flag");
const CollectionsRoutes = require("./routes/collections");
const CollectionsFlagRoutes = require("./routes/collections_flag");
const CustomerRoutes = require("./routes/customer");
const CustomerFlagRoutes = require("./routes/customer_flag");
const WishlistRoutes = require("./routes/wishlist");
const WishlistFlagRoutes = require("./routes/wishlist_flag");
const RatingRoutes = require("./routes/rating_details");
const RatingFlagRoutes = require("./routes/rating_details_flag");
const ReviewRoutes = require("./routes/review_details");
const ReviewFlagRoutes = require("./routes/review_details_flag");
const AnalyticsRoutes = require("./routes/customer_analytics");
const AnalyticsFlagRoutes = require("./routes/customer_analytics_flag");
const OfferRoutes = require("./routes/offer_details");
const OfferFlagRoutes = require("./routes/offer_details_flag");
const ProdRatingFilterRoutes = require("./routes/rating_product_filter");
const CategoryProdRoutes = require("./routes/category_based_product");
const SubCategoryProdRoutes = require("./routes/sub_category_based_product");
const SubSubCategoryProdRoutes = require("./routes/sub_sub_category_based_product");
const FilterProdRoutes = require("./routes/filtering_products");
const CalcMeanRatingRoutes = require("./routes/calculate_mean_rating");
const CalcReviewCountRoutes = require("./routes/calculate_review_count");
const SignupRoutes = require("./routes/signup");
const CommonRoutes = require("./routes/commonroutes");
const ActivateEmailRoutes = require("./routes/activateEmail");
const LoginRoutes = require("./routes/login");
const ProfileRoutes = require("./routes/profile");
const ForgotPassordRoutes = require("./routes/forgotpassword");
const SortingFilterRoutes = require("./routes/sorting_filter");
const SotringFilterFlagRoutes = require("./routes/sorting_filter_flag");
const CatFilProdRoutes = require("./routes/cat_based_products_with_sorting_filter");
const SubcatFilProdRoutes = require("./routes/subcat_based_products_with_sorting_filter");
const SubsubcatFilProdRoutes = require("./routes/subsubcat_based_products_with_sorting_filter");
const FilSortProdRoutes = require("./routes/filtering_products_with_sorting_filter");
const SearchRoutes = require("./routes/search");
const adminSignup = require("./routes/admin_signup");
const TrendRoutes = require("./routes/trending_products");
const HotDealsRoutes = require("./routes/hot_deals");
const BannerRoutes = require("./routes/banner");
const HomeBannerRoutes = require("./routes/home_banner");

/*mongoose.connect(
    "mongodb://"+process.env.Zoom_user+":"+process.env.ZOOM_PWD+"@localhost:27017/zoomzoom",
    {useMongoClient: true}, { autoIndex: false  });*/

/*mongoose.connect(
    "mongodb://"+process.env.Zoom_user+":"+process.env.ZOOM_PWD+"@ds125821.mlab.com:25821/zoomzoom", {useMongoClient: true}, { autoIndex: false  }
);*/

mongoose.connect(
    "mongodb://"+process.env.Zoom_user+":"+process.env.ZOOM_PWD+"@ds135061.mlab.com:35061/zoombackup", {useMongoClient: true}, { autoIndex: false  }
);


app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "*"
    );
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use("/category", categoryRoutes);
app.use("/category_flag",catflagRoutes);
app.use("/subcategory", subcategoryRoutes);
app.use("/subcategory_flag", subcatflagRoutes);
app.use("/product_images", productimageRoutes);
app.use("/product_images_flag",prodimageflagRoutes);
app.use("/user", userRoutes);
app.use("/subsubcategory", subsubcategoryRoutes);
app.use("/subsubcategory_flag",subsubcatflagRoutes);
app.use("/seller_category", sellercategoryRoutes);
app.use("/seller_category_flag",sellercatflagRoutes);
app.use("/seller_subcategory", sellersubcategoryRoutes);
app.use("/seller_subcategory_flag",sellersubcatflagRoutes);
app.use("/ecommerce_category", EcommercecategoryRoutes);
app.use("/ecommerce_category_flag",EcommercecatflagRoutes);
app.use("/category_chain_api",CategoryChainRoutes);
app.use("/category_subcategory_hierarchy",CategorySubCategoryHierarchyRoutes);
app.use("/subcategory_subsubcategory_hierarchy",SubcategorySubSubCategoryHierarchyRoutes);
app.use("/cat_subcat_subsubcat_hierarchy",CatSubcatSubsubcatHierarchy);
app.use("/ecommerce_product_details",EcommProductCategoryRoutes);
app.use("/ecommerce_product_details_flag",EcommProdFlagCategoryRoutes);
app.use("/product_details",ProductCategoryRoutes);
app.use("/product_details_flag",ProductFlagCategoryRoutes);
app.use("/filters",FilterCategoryRoutes);
app.use("/filters_flag",FilterFlagRoutes);
app.use("/filters_categories",FiltersCategoriesRoutes);
app.use("/filters_categories_flag",FilterCategoriesFlagRoutes);
app.use("/filter_options",FilterOptionRoutes);
app.use("/filter_options_flag",FilterOptionFlagRoutes);
app.use("/filter_options_products",FilterOptProdRoutes);
app.use("/filter_options_products_flag",FilterOptProdFlagRoutes);
app.use("/collections",CollectionsRoutes);
app.use("/collections_flag",CollectionsFlagRoutes);
app.use("/customer",CustomerRoutes);
app.use("/customer_flag",CustomerFlagRoutes);
app.use("/wishlist",WishlistRoutes);
app.use("/wishlist_flag",WishlistFlagRoutes);
app.use("/rating_details",RatingRoutes);
app.use("/rating_details_flag",RatingFlagRoutes);
app.use("/review_details",ReviewRoutes);
app.use("/review_details_flag",ReviewFlagRoutes);
app.use("/customer_analytics",AnalyticsRoutes);
app.use("/customer_analytics_flag",AnalyticsFlagRoutes);
app.use("/offer_details",OfferRoutes);
app.use("/offer_details_flag",OfferFlagRoutes);
app.use("/rating_product_filter",ProdRatingFilterRoutes);
app.use("/category_based_product",CategoryProdRoutes);
app.use("/sub_category_based_product",SubCategoryProdRoutes);
app.use("/sub_sub_category_based_product",SubSubCategoryProdRoutes);
app.use("/filtering_products",FilterProdRoutes);
app.use("/calculate_mean_rating",CalcMeanRatingRoutes);
app.use("/calculate_review_count",CalcReviewCountRoutes);
app.use("/signup",SignupRoutes);
app.use("/commonroutes",CommonRoutes);
app.use("/activateEmail",ActivateEmailRoutes);
app.use("/login",LoginRoutes);
app.use("/profile",ProfileRoutes);
app.use("/forgotpassword",ForgotPassordRoutes);
app.use("/sorting_filter",SortingFilterRoutes);
app.use("/sorting_filter_flag",SotringFilterFlagRoutes);
app.use("/cat_based_products_with_sorting_filter",CatFilProdRoutes);
app.use("/subcat_based_products_with_sorting_filter",SubcatFilProdRoutes);
app.use("/subsubcat_based_products_with_sorting_filter",SubsubcatFilProdRoutes);
app.use("/filtering_products_with_sorting_filter",FilSortProdRoutes);
app.use("/search",SearchRoutes);
app.use("/admin_signup",adminSignup);
app.use("/trending_products",TrendRoutes);
app.use("/hot_deals",HotDealsRoutes);
app.use("/banner",BannerRoutes);
app.use("/home_banner",HomeBannerRoutes);

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    console.log(error);
    res.json({
        error: {
            status: "error",
            error_message: "Internal server error!"
        }
    });
});
module.exports = app;

