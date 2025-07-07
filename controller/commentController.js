const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");
const Note = require("../models/noteModel");

/**
 * @desc    Get comments for a note
 * @route   GET /api/notes/:noteId/comments
 * @access  Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.noteId - The ID of the note
 * @returns {object} 200 - An array of comment objects
 */
const getComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ note: req.params.noteId }).populate("user", "name");
    res.status(200).json(comments);
});

/**
 * @desc    Add a comment to a note
 * @route   POST /api/notes/:noteId/comments
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.noteId - The ID of the note
 * @param {string} req.body.text - The text of the comment
 * @returns {object} 201 - The created comment object
 * @returns {Error}  404 - Note not found
 */
const addComment = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const { noteId } = req.params;

    const note = await Note.findById(noteId);

    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }

    const comment = await Comment.create({
        text,
        note: noteId,
        user: req.user.id,
    });

    res.status(201).json(comment);
});

module.exports = { getComments, addComment };
