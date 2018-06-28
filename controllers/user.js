const mongoose = require("mongoose");
const User = require("../models/user");

//get all active users
exports.user_get_all = (req, res, next) => {
    User.find({emailverified:'true'})
        .select('userid useremail username userinfo role _id')
        .exec()
        .then(docs => {

            if(docs.length > 0)
            {
                const response = {
                    users: docs.map(doc => {
                        return {
                            userid: doc.userid,
                            useremail: doc.useremail,
                            username: doc.username,
                            userinfo: doc.userinfo,
                            role: doc.role,
                            doc_id: doc._id
                        };
                    })
                };
                // if (docs.length >= 0) {
                res.status(200).json({
                    status:"success",
                    data: {
                        response
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status:"failure",
                    data: {
                        message: 'No details found for users'
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:{
                    message: "Internal server error"
                }
            });
        });
};

//get user by id
exports.user_get_by_id = (req, res, next) =>{
    const id = req.params.userId;
    User.find({userid:id})
        .select('userid useremail username userinfo role _id')
        .exec()
        .then(docs => {

            if(docs.length > 0)
            {
                const response = {
                    //count: docs.length,
                    users: docs.map(doc => {
                        return {
                            userid: doc.userid,
                            useremail: doc.useremail,
                            username: doc.username,
                            userinfo: doc.userinfo,
                            role: doc.role,
                            doc_id: doc._id
                        };
                    })
                };
                // if (docs.length >= 0) {
                res.status(200).json({
                    status:"success",
                    data: {
                        response
                    }
                });
            }
            else
            {
                res.status(404).json({
                    status:"failure",
                    data: {
                        message: 'No details found for user'
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data:{
                    message: "Internal server error"
                }
            });
        });
};

//update user details by id
exports.user_update_by_id = (req, res, next) =>{
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ userid: id }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: "user details updated"
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error!"
                }
            });
        });
};

//delete a user by id
exports.user_delete = (req, res, next) =>{
    const id = req.params.userId;
    User.remove({ userid: id })
        .exec()
        .then(result => {
            res.status(200).json({
                status: "success",
                data: {
                    message: 'user deleted'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                status: "error",
                error: err,
                data: {
                    message: "Internal server error!"
                }
            });
        });
};
