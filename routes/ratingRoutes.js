const express = require("express");
const router = express.Router({ mergeParams: true });
const { getRatings, addRating } = require("../controller/ratingController");
const { protect } = require("../middleware/authMiddleware");
const { ratingValidation } = require("../middleware/validation");

router.route("/").get(getRatings).post(protect, ratingValidation, addRating);

module.exports = router;
