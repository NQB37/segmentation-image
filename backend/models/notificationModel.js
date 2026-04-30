import mongoose from 'mongoose';

const { Schema } = mongoose;

const notificationTypes = [
  'invite.created',
  'invite.accepted',
  'invite.canceled',
  'board.deleted',
  'member.added',
  'member.removed',
];

const notificationSchema = new Schema(
  {
    toId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fromId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: notificationTypes,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
    },
    inviteId: {
      type: Schema.Types.ObjectId,
      ref: 'Invite',
    },
    readAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ toId: 1, createdAt: -1 });
notificationSchema.index({ toId: 1, readAt: 1 });

export default mongoose.model('Notification', notificationSchema);
