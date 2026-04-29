import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const inviteSchema = new Schema(
    {
        toId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
        status: { type: String, required: true },
    },
    { timestamps: true },
);

export default mongoose.model('Invite', inviteSchema);
