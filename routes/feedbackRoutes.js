const express = require("express");
const router = express.Router();
const { submitFeedback, getFeedback } = require("../controller/feedbackController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, submitFeedback).get(protect, admin, getFeedback);

module.exports = router;
