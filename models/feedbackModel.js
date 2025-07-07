const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        subject: {
            type: String,
            required: [true, "Please add a subject"],
            minlength: [1, "Subject cannot be empty"],
            maxlength: [100, "Subject cannot exceed 100 characters"],
        },
        message: {
            type: String,
            required: [true, "Please add a message"],
            minlength: [1, "Message cannot be empty"],
            maxlength: [1000, "Message cannot exceed 1000 characters"],
        },
    },
    {
        timestamps: true,
    }
);

feedbackSchema.index({ user: 1 });

module.exports = mongoose.model("Feedback", feedbackSchema);
