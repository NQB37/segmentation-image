const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const inviteSchema = new Schema(
    {
        toId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
        status: { type: String, required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Invite', inviteSchema);
