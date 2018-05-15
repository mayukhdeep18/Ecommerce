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
const CategoryChainRoutes = require("./routes/category_chain_api")


mongoose.connect(
    "mongodb://zoom:"+
    process.env.ZOOM_PWD +
    "@ds131697.mlab.com:31697/zoommyprice",
    {
        useMongoClient: true
    }
);

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

