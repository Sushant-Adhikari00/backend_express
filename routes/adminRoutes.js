const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getUsers, updateUserRole, getNotesForAdmin, updateNoteStatus } = require("../controller/adminController");
const { updateUserRoleValidation, updateNoteStatusValidation } = require("../middleware/validation");

router.route("/users").get(protect, admin, getUsers);
router.route("/users/:id").put(protect, admin, updateUserRoleValidation, updateUserRole);
router.route("/notes").get(protect, admin, getNotesForAdmin);
router.route("/notes/:id/status").put(protect, admin, updateNoteStatusValidation, updateNoteStatus);

module.exports = router;
