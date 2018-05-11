const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


//get all user details
exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    status: "error",
                    error: "Email exists",
                    data: {
                        message: "The email address entered already exists, Enter a new email ID"
                    }
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            status: "error",
                            error: err,
                            data: {
                                message: "An error has occurred as mentioned above"
                            }
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    status: "success",
                                    error: "",
                                    data: {
                                        message: "User created"
                                    }
                                });
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
                    }
                });
            }
        });
};

//user login module
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    status: "error",
                    error: "Auth failed",
                    data: {
                        message: "invalid email address"
                    }
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        status: "error",
                        error: "Auth failed",
                        data: {
                            message: "invalid password"
                        }
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "1h"
                        }
                    );
                    return res.status(200).json({
                        status: "success",
                        error: "",
                        data: {
                            message: "Auth successful",
                            token: token
                        }
                    });
                }
                res.status(401).json({
                    status: "error",
                    error: "Auth failed",
                    data: {
                        message: "incorrect email or password"
                    }
                });
            });
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

//get all user details
exports.user_get_all = (req, res, next) => {
    User.find()
        .select('email _id')
        .exec()
        .then(docs => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    users: docs.map(doc => {
                        return {
                            _id: doc._id,
                            email: doc.email
                        };
                    })
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                status: "success",
                error: err,
                data: {
                    message: "An error has occurred as mentioned above"
                }
            });
        });
};

//get user details by id
exports.user_get_user = (req, res, next) =>  {
    const id = req.params.userId;
    User.findById(id)
        .select('email _id')
        // .populate('PRODUCT_ID','PRODUCT_NAME')
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({
                    status: "success",
                    error: "",
                    data: {
                        productimages: doc
                    }
                });
            } else {
                res
                    .status(404)
                    .json({
                        status: "error",
                        error: "Id not found",
                        data: {
                            message: "No valid entry found for provided ID"
                        }
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:
                    {
                        message: "An error has occurred as mentioned above"
                    }
            });
        });
};


//delete user by id
exports.user_delete = (req, res, next) => {
    User.remove({ _id: req.params.userId })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                error: "",
                data: {
                    message: "User deleted"
                }
            });
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

