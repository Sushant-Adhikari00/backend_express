const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Note = require("../models/noteModel");

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} 200 - An array of user objects
 */
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - The ID of the user to update
 * @param {string} req.body.role - The new role for the user
 * @returns {object} 200 - The updated user object
 * @returns {Error}  404 - User not found
 */
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

/**
 * @desc    Get all notes (for admin review)
 * @route   GET /api/admin/notes
 * @access  Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} 200 - An array of note objects
 */
const getNotesForAdmin = asyncHandler(async (req, res) => {
    const notes = await Note.find({}).populate("user", "name email");
    res.json(notes);
});

/**
 * @desc    Update note status (approve/reject)
 * @route   PUT /api/admin/notes/:id/status
 * @access  Private/Admin
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - The ID of the note to update
 * @param {string} req.body.status - The new status for the note
 * @returns {object} 200 - The updated note object
 * @returns {Error}  404 - Note not found
 */
const updateNoteStatus = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note) {
        note.status = req.body.status || note.status;
        const updatedNote = await note.save();
        res.json(updatedNote);
    } else {
        res.status(404);
        throw new Error("Note not found");
    }
});

module.exports = { getUsers, updateUserRole, getNotesForAdmin, updateNoteStatus };
