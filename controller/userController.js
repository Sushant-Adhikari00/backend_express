const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.username - The user's username
 * @param {string} req.body.email - The user's email address
 * @param {string} req.body.password - The user's password
 * @returns {object} 201 - An object containing the user's data and a JWT token
 * @returns {Error}  400 - User with this email or username already exists
 * @returns {Error}  400 - Invalid user data
 * @returns {Error}  500 - Email could not be sent
 */
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if a user with the given email or username already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
        res.status(400);
        throw new Error("User with this email or username already exists");
    }

    // Create a new user
    const user = await User.create({
        username,
        email,
        password,
    });

    // If the user is created successfully, send verification email
    if (user) {
        const verificationToken = user.getVerificationToken();
        await user.save({ validateBeforeSave: false });

        const verificationUrl = `${req.protocol}://${req.get('host')}/api/users/verifyemail/${verificationToken}`;

        const message = `Please verify your email by clicking on this link: <a href="${verificationUrl}">${verificationUrl}</a>`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification',
                message,
            });

            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                message: 'Verification email sent to your email address',
            });
        } catch (error) {
            user.emailVerificationToken = undefined;
            user.emailVerificationExpires = undefined;
            await user.save({ validateBeforeSave: false });

            res.status(500);
            throw new Error('Email could not be sent');
        }
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

/**
 * @desc    Auth user & get token
 * @route   POST /api/users/login
 * @access  Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.login - The user's email or username
 * @param {string} req.body.password - The user's password
 * @returns {object} 200 - An object containing the user's data and a JWT token
 * @returns {Error}  401 - Invalid password
 * @returns {Error}  401 - User not found
 * @returns {Error}  401 - Please verify your email first
 */
const authUser = asyncHandler(async (req, res) => {
    const { login, password } = req.body;

    // Find the user by email or username
    const user = await User.findOne({ 
        $or: [{ email: login }, { username: login }],
     });

    // If the user exists and the password matches, return the user's data and a token
    if (user) {
        if (await user.matchPassword(password)) {
            if (!user.isVerified) {
                res.status(401);
                throw new Error("Please verify your email first");
            }
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401);
            throw new Error("Invalid password");
        }
    } else {
        res.status(401);
        throw new Error("User not found");
    }
});

/**
 * @desc    Verify user email
 * @route   GET /api/users/verifyemail/:token
 * @access  Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.token - The email verification token
 * @returns {object} 200 - Email verified successfully
 * @returns {Error}  400 - Invalid or expired token
 */
const verifyEmail = asyncHandler(async (req, res) => {
    const verificationToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        emailVerificationToken: verificationToken,
        emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
});

/**
 * @desc    Forgot password
 * @route   POST /api/users/forgotpassword
 * @access  Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.body.email - The user's email address
 * @returns {object} 200 - Token sent to email
 * @returns {Error}  404 - User not found with that email
 * @returns {Error}  500 - Email could not be sent
 */
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found with that email');
    }

    const resetToken = user.getVerificationToken(); // Reusing getVerificationToken for password reset
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: <a href="${resetUrl}">${resetUrl}</a>. If you did not request this, please ignore this email and your password will remain unchanged.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message,
        });

        res.status(200).json({ message: 'Token sent to email' });
    } catch (error) {
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
});

/**
 * @desc    Reset password
 * @route   PUT /api/users/resetpassword/:token
 * @access  Public
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {string} req.params.token - The password reset token
 * @param {string} req.body.password - The new password
 * @returns {object} 200 - Password reset successfully
 * @returns {Error}  400 - Invalid or expired token
 */
const resetPassword = asyncHandler(async (req, res) => {
    const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        emailVerificationToken: resetToken,
        emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }

    user.password = req.body.password;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
});

module.exports = { registerUser, authUser, verifyEmail, forgotPassword, resetPassword };
