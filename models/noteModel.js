const mongoose = require("mongoose");

// Note schema definition
const noteSchema = mongoose.Schema(
    {
        // The user who owns the note
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        // Title of the note
        title: {
            type: String,
            required: [true, "Please add a title"],
            minlength: [1, "Title cannot be empty"],
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        // Description of the note
        description: {
            type: String,
            required: [true, "Please add a description"],
            minlength: [1, "Description cannot be empty"],
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        // File path for the note
        file: {
            type: String,
            required: true,
        },
        // Status of the note, can be 'pending', 'approved', or 'rejected'
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        // Access Control List for the note
        acl: [
            {
                // User who has access
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                // Access level, can be 'edit' or 'view'
                access: {
                    type: String,
                    enum: ["edit", "view"],
                    required: true,
                },
            },
        ],
    },
    { 
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true 
    }
);

noteSchema.pre('save', function (next) {
    const aclUsers = this.acl.map(entry => entry.user.toString());
    const uniqueAclUsers = new Set(aclUsers);

    if (aclUsers.length !== uniqueAclUsers.size) {
        const err = new Error('Duplicate user found in ACL');
        next(err);
    } else {
        next();
    }
});

noteSchema.index({ owner: 1 });
noteSchema.index({ status: 1 });
noteSchema.index({ 'acl.user': 1 });

module.exports = mongoose.model("Note", noteSchema);
