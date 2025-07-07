const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
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
        value: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

ratingSchema.index({ user: 1, note: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
