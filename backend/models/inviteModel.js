const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inviteSchema = new Schema(
    {
        fromId: {
            type: String,
            required: true,
        },
        toId: { type: String, required: true },
        boardId: { type: String, required: true },
        status: { type: String, required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Invite', inviteSchema);
