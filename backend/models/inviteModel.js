import mongoose from 'mongoose';
const { Schema } = mongoose;
const inviteSchema = new Schema(
    {
        toId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        boardId: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
        status: { type: String, required: true },
    },
    { timestamps: true },
);

inviteSchema.index(
    { toId: 1, boardId: 1, status: 1 },
    {
        unique: true,
        partialFilterExpression: { status: 'Pending' },
    },
);

export default mongoose.model('Invite', inviteSchema);
