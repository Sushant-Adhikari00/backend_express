const express = require("express");
const router = express.Router({ mergeParams: true });
const { getComments, addComment } = require("../controller/commentController");
const { protect } = require("../middleware/authMiddleware");
const { addCommentValidation } = require("../middleware/validation");

router.route("/").get(getComments).post(protect, addCommentValidation, addComment);

module.exports = router;
