const asyncHandler = require("express-async-handler");
const Feedback = require("../models/feedbackModel");

/**
 * @desc    Submit feedback
 * @route   POST /api/feedback
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.subject - The subject of the feedback
 * @param {string} req.body.message - The message of the feedback
 * @returns {object} 201 - The created feedback object
 */
const submitFeedback = asyncHandler(async (req, res) => {
    const { subject, message } = req.body;

    const feedback = await Feedback.create({
        user: req.user.id,
        subject,
        message,
    });

    res.status(201).json(feedback);
});

/**
 * @desc    Get all feedback (Admin only)
 * @route   GET /api/feedback
 * @access  Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} 200 - An array of feedback objects
 */
const getFeedback = asyncHandler(async (req, res) => {
    const feedback = await Feedback.find({}).populate("user", "name email");
    res.json(feedback);
});

module.exports = { submitFeedback, getFeedback };
