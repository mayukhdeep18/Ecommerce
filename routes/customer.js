const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const CustomerController = require("../controllers/customer");


//multer code for image upload

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only jpeg and png are accepted'),false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

//routes to execute controller functions
router.get("/", CustomerController.customer_get_all);

router.post("/",/*checkAuth,*/ upload.single('CUSTOMER_PROFILE_PICTURE_LINK'), CustomerController.customer_create);

router.get("/:customerId", CustomerController.customer_get_by_id);

router.patch("/:customerId",/*checkAuth,*/ CustomerController.customer_update_by_id);

router.patch("/profile_pic/:customerId",/*checkAuth,*/upload.single('CUSTOMER_PROFILE_PICTURE_LINK'), CustomerController.customer_update_profile_pic_by_id);

router.delete("/:customerId",/*checkAuth,*/ CustomerController.customer_delete_by_id);

module.exports = router;