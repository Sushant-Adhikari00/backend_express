const express = require("express");
const router = express.Router({ mergeParams: true });
const { getComments, addComment } = require("../controller/commentController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getComments).post(protect, addComment);

module.exports = router;
