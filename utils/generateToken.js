const jwt = require("jsonwebtoken");
const { constants } = require("../constants");

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * The token is signed with JWT_SECRET from environment variables and expires after a predefined time.
 *
 * @param {string} id - The user ID for which the token is to be generated.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: constants.JWT_EXPIRATION_TIME,
    });
};

module.exports = generateToken;
