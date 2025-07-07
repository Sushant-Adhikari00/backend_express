const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { constants } = require("../constants");

// User schema definition
const userSchema = mongoose.Schema(
    {
        // Username of the user, must be unique
        username: {
            type: String,
            required: [true, "Please add a username"],
            unique: true,
        },
        // Email of the user, must be unique
        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
        },
        // User's password
        password: {
            type: String,
            required: [true, "Please add a password"],
            minlength: [8, "Password must be at least 8 characters long"],
            validate: {
                validator: function(v) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/.test(v);
                },
                message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            }
        },
        // Role of the user, can be 'user' or 'admin'
        role: {
            type: String,
            enum: [constants.USER_ROLE, constants.ADMIN_ROLE],
            default: constants.USER_ROLE,
        },
        // Email verification status
        isVerified: {
            type: Boolean,
            default: false,
        },
        // Token for email verification
        emailVerificationToken: String,
        // Expiration time for the email verification token
        emailVerificationExpires: Date,
    },
    { 
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true 
    }
);

// Method to generate an email verification token
userSchema.methods.getVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    this.emailVerificationExpires = Date.now() + constants.TOKEN_EXPIRATION_TIME; // Use constant for expiration time

    return verificationToken;
};

// Hash password before saving the user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
