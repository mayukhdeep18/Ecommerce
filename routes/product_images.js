const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ImageController = require("../controllers/product_images");


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

router.get("/", ImageController.images_get_all);

router.get("/:activeFlag", ImageController.images_get_all_flag);

router.post("/",checkAuth, upload.single('PRODUCT_IMAGE_REF_1'), ImageController.image_upload);

router.get("/:productimageId", ImageController.image_get_image);

router.patch("/:productimageId",checkAuth, ImageController.image_update_image);

router.delete("/:productimageId",checkAuth, ImageController.image_delete);

module.exports = router;