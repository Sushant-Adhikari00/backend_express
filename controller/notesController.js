const asyncHandler = require("express-async-handler");
const Note = require("../models/noteModel");

/**
 * @desc    Get all notes for the logged-in user
 * @route   GET /api/notes
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {object} 200 - An array of note objects
 */
const getNotes = asyncHandler(async (req, res) => {
    // Admins can see all notes
    if (req.user.role === 'admin') {
        const notes = await Note.find({});
        return res.status(200).json(notes);
    }
    // Regular users can see notes they own or have access to
    const notes = await Note.find({ $or: [{ owner: req.user.id }, { "acl.user": req.user.id }] });
    res.status(200).json(notes);
});

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.title - The title of the note
 * @param {string} req.body.description - The description of the note
 * @param {string} req.file.path - The path to the uploaded file
 * @returns {object} 201 - The created note object
 * @returns {Error}  400 - Please add all fields and upload a file
 */
const createNote = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const file = req.file ? req.file.path : null;

    if (!title || !description || !file) {
        res.status(400);
        throw new Error("Please add all fields and upload a file");
    }

    // Create a new note with the current user as the owner
    const note = await Note.create({
        title,
        description,
        file,
        owner: req.user.id,
    });

    res.status(201).json(note);
});

/**
 * @desc    Get a single note by ID
 * @route   GET /api/notes/:id
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - The ID of the note
 * @returns {object} 200 - The note object
 * @returns {Error}  404 - Note not found
 * @returns {Error}  401 - User not authorized
 */
const getNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }

    // Check if the user has access to the note
    const hasAccess = note.owner.toString() === req.user.id || 
                      note.acl.some(entry => entry.user.toString() === req.user.id) || 
                      req.user.role === 'admin';

    if (!hasAccess) {
        res.status(401);
        throw new Error("User not authorized");
    }

    res.status(200).json(note);
});

/**
 * @desc    Update a note
 * @route   PUT /api/notes/:id
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - The ID of the note
 * @param {string} req.body.title - The updated title of the note
 * @param {string} req.body.description - The updated description of the note
 * @param {string} req.file.path - The path to the updated file
 * @returns {object} 200 - The updated note object
 * @returns {Error}  404 - Note not found
 * @returns {Error}  401 - User not authorized to edit this note
 */
const updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }

    // Check if the user has edit access to the note
    const hasEditAccess = note.owner.toString() === req.user.id || 
                          note.acl.some(entry => entry.user.toString() === req.user.id && entry.access === 'edit') || 
                          req.user.role === 'admin';

    if (!hasEditAccess) {
        res.status(401);
        throw new Error("User not authorized to edit this note");
    }

    const { title, description } = req.body;
    const file = req.file ? req.file.path : note.file;

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(req.params.id, {
        title,
        description,
        file,
    }, {
        new: true,
    });

    res.status(200).json(updatedNote);
});

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - The ID of the note
 * @returns {object} 200 - A message confirming the note was removed
 * @returns {Error}  404 - Note not found
 * @returns {Error}  401 - User not authorized to delete this note
 */
const deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }

    // Check if the user is the owner of the note or an admin
    const isOwner = note.owner.toString() === req.user.id || req.user.role === 'admin';

    if (!isOwner) {
        res.status(401);
        throw new Error("User not authorized to delete this note");
    }

    await note.deleteOne();

    res.status(200).json({ message: "Note removed" });
});

/**
 * @desc    Share a note with another user
 * @route   POST /api/notes/:id/share
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.id - The ID of the note
 * @param {string} req.body.userId - The ID of the user to share the note with
 * @param {string} req.body.access - The access level to grant (e.g., 'read', 'edit')
 * @returns {object} 200 - The updated note object with the new ACL entry
 * @returns {Error}  404 - Note not found
 * @returns {Error}  401 - Only the owner can share this note
 * @returns {Error}  400 - You cannot share a note with yourself
 * @returns {Error}  400 - Please provide a userId and access level
 */
const shareNote = asyncHandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        res.status(404);
        throw new Error("Note not found");
    }

    // Only the owner or an admin can share the note
    const isOwner = note.owner.toString() === req.user.id || req.user.role === 'admin';

    if (!isOwner) {
        res.status(401);
        throw new Error("Only the owner can share this note");
    }

    const { userId, access } = req.body;

    // Prevent the owner from sharing the note with themselves
    if (note.owner.toString() === userId) {
        res.status(400);
        throw new Error("You cannot share a note with yourself");
    }

    if (!userId || !access) {
        res.status(400);
        throw new Error("Please provide a userId and access level");
    }

    // Check if the user already has access
    const existingAccess = note.acl.find(entry => entry.user.toString() === userId);

    if (existingAccess) {
        // Update existing access
        existingAccess.access = access;
    } else {
        // Add new access
        note.acl.push({ user: userId, access });
    }

    await note.save();

    res.status(200).json(note);
});

/**
 * @desc    Search notes by keyword
 * @route   GET /api/notes/search
 * @access  Private
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.query.keyword - The keyword to search for
 * @returns {object} 200 - An array of note objects that match the search criteria
 */
const searchNotes = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
        ? {
              $or: [
                  { title: { $regex: req.query.keyword, $options: "i" } },
                  { description: { $regex: req.query.keyword, $options: "i" } },
              ],
          }
        : {};

    let notes;
    // Admins can search all approved notes
    if (req.user.role === 'admin') {
        notes = await Note.find({ ...keyword, status: "approved" }).populate("owner", "username");
    } else {
        // Regular users can only search their own approved notes
        notes = await Note.find({ 
            ...keyword, 
            status: "approved",
            $or: [{ owner: req.user.id }, { "acl.user": req.user.id }] 
        }).populate("owner", "username");
    }

    res.json(notes);
});

module.exports = {
    getNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote,
    shareNote,
    searchNotes,
};