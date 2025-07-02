const express = require("express");
const router = express.Router();
const { registerUser, authUser } = require("../controller/userController");

// Route for registering a new user
router.route("/").post(registerUser);
// Route for authenticating a user and getting a token
router.post("/login", authUser);

module.exports = router;
