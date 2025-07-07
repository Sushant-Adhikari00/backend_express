const express = require("express");
const router = express.Router();
const { registerUser, authUser, verifyEmail, forgotPassword, resetPassword } = require("../controller/userController");
const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } = require("../middleware/validation");

// Route for registering a new user
router.route("/").post(registerValidation, registerUser);
// Route for authenticating a user and getting a token
router.route("/login").post(loginValidation, authUser);
// Route for email verification
router.route("/verifyemail/:token").get(verifyEmail);
// Route for forgot password
router.route("/forgotpassword").post(forgotPasswordValidation, forgotPassword);
// Route for reset password
router.route("/resetpassword/:token").put(resetPasswordValidation, resetPassword);

module.exports = router;
