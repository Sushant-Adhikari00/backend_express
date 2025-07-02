const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getUsers, updateUserRole, getNotesForAdmin, updateNoteStatus } = require("../controller/adminController");

router.route("/users").get(protect, admin, getUsers);
router.route("/users/:id").put(protect, admin, updateUserRole);
router.route("/notes").get(protect, admin, getNotesForAdmin);
router.route("/notes/:id/status").put(protect, admin, updateNoteStatus);

module.exports = router;
