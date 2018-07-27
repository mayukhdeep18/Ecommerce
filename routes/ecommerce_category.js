const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const EcommerceCategoryController = require("../controllers/ecommerce_category");


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

router.get("/", EcommerceCategoryController.ecomm_category_get_all);

router.post("/", upload.single('ECOMMERCE_LOGO'), EcommerceCategoryController.ecommerce_create_category);

router.get("/:ecommcategoryId", EcommerceCategoryController.ecommerce_category_get_by_id);

router.patch("/:ecommcategoryId", EcommerceCategoryController.ecommerce_category_update_by_id);

router.patch("/logo_update/:ecommcategoryId", upload.single('ECOMMERCE_LOGO'), EcommerceCategoryController.ecom_logo_update_by_id);

router.delete("/:ecommcategoryId", EcommerceCategoryController.ecommerce_category_delete_by_id);

module.exports = router;