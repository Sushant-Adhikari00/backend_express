const asyncHandler = require("express-async-handler");
const Rating = require("../models/ratingModel");
const Note = require("../models/noteModel");

/**
 * @desc    Get ratings for a note
 * @route   GET /api/notes/:noteId/ratings
 * @access  Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.noteId - The ID of the note
 * @returns {object} 200 - An array of rating objects
 */
const getRatings = asyncHandler(async (req, res) => {
    const ratings = await Rating.find({ note: req.params.noteId }).populate("user", "name");
    res.status(200).json(ratings);
});

/**
 * @desc    Add a rating to a note
 * @route   POST /api/notes/:noteId/ratings
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.noteId - The ID of the note
 * @param {number} req.body.value - The rating value (e.g., 1-5)
 * @returns {object} 201 - The created rating object
 * @returns {Error}  404 - Note not found
 */
const addRating = asyncHandler(async (req, res) => {
    const { value } = req.body;
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }

    const rating = await Rating.create({
        value,
        note: noteId,
        user: req.user.id,
    });

    res.status(201).json(rating);
});

module.exports = { getRatings, addRating };
