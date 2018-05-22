const express = require("express");
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const OfferController = require("../controllers/offer_details");


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
router.get("/", OfferController.offer_get_all);

router.post("/",/*checkAuth,*/ upload.single('SPECIAL_OFFER_IMAGE_LINK'), OfferController.offer_create);

router.get("/:offerId", OfferController.offer_get_by_id);

router.patch("/:offerId",/*checkAuth,*/ OfferController.offer_update);

router.delete("/:offerId",/*checkAuth,*/ OfferController.offer_delete);

module.exports = router;