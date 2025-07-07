const express = require("express");
const router = express.Router();
const {
    getNotes,
    createNote,
    getNote,
    updateNote,
    deleteNote,
    shareNote,
    searchNotes,
} = require("../controller/notesController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { createNoteValidation, shareNoteValidation, updateNoteValidation } = require("../middleware/validation");

// Nested routes for comments and ratings
router.use("/:noteId/comments", require("./commentRoutes"));
router.use("/:noteId/ratings", require("./ratingRoutes"));

// Routes for getting all notes and creating a new note
router.route("/").get(protect, getNotes).post(protect, upload.single("file"), createNoteValidation, createNote);
// Route for searching notes
router.route("/search").get(protect, searchNotes);

// Routes for getting, updating, and deleting a single note
router.route("/:id").get(protect, getNote).put(protect, upload.single("file"), updateNoteValidation, updateNote).delete(protect, deleteNote);
// Route for sharing a note
router.route("/:id/share").post(protect, shareNoteValidation, shareNote);


module.exports = router;