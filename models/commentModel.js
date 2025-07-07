const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        note: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Note",
        },
        text: {
            type: String,
            required: true,
            minlength: [1, "Comment cannot be empty"],
            maxlength: [500, "Comment cannot exceed 500 characters"],
        },
    },
    { 
        timestamps: true 
    }
);

commentSchema.index({ user: 1 });
commentSchema.index({ note: 1 });

module.exports = mongoose.model("Comment", commentSchema);
