const express = require("express");
const router = express.Router({ mergeParams: true });
const { getRatings, addRating } = require("../controller/ratingController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getRatings).post(protect, addRating);

module.exports = router;
