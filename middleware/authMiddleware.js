const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { constants } = require("../constants");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            if (error.name === 'TokenExpiredError') {
                throw new Error('Not authorized, token expired');
            } else {
                throw new Error("Not authorized, token invalid");
            }
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === constants.ADMIN_ROLE) {
        next();
    } else {
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
};

module.exports = { protect, admin };
