const express = require("express");
const router = express.Router();
const { submitFeedback, getFeedback } = require("../controller/feedbackController");
const { protect, admin } = require("../middleware/authMiddleware");
const { feedbackValidation } = require("../middleware/validation");

router.route("/").post(protect, feedbackValidation, submitFeedback).get(protect, admin, getFeedback);

module.exports = router;
