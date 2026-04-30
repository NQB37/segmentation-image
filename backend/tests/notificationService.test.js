import { jest, describe, test, expect } from '@jest/globals';

const notifications = [
  {
    _id: 'accepted-notification',
    toId: 'user-1',
    type: 'invite.created',
    readAt: null,
    inviteId: { _id: 'invite-accepted', status: 'Accepted' },
  },
  {
    _id: 'pending-notification',
    toId: 'user-1',
    type: 'invite.created',
    readAt: null,
    inviteId: { _id: 'invite-pending', status: 'Pending' },
  },
  {
    _id: 'board-notification',
    toId: 'user-1',
    type: 'member.added',
    readAt: null,
  },
];

const createQuery = (resolver) => {
  const query = {
    populate() {
      return query;
    },
    sort() {
      return query;
    },
    limit() {
      return query;
    },
    then(resolve, reject) {
      return Promise.resolve(resolver()).then(resolve, reject);
    },
    catch(reject) {
      return Promise.resolve(resolver()).catch(reject);
    },
  };

  return query;
};

await jest.unstable_mockModule('../models/notificationModel.js', () => ({
  default: {
    find: jest.fn(() => createQuery(() => notifications)),
    countDocuments: jest.fn(() => Promise.resolve(notifications.length)),
  },
}));

await jest.unstable_mockModule('../utils/socket.js', () => ({
  emitToUser: jest.fn(),
}));

const { getUnreadCount, listNotifications } = await import(
  '../services/notificationService.js'
);

describe('notification service', () => {
  test('listNotifications excludes invite notifications that are no longer pending', async () => {
    const result = await listNotifications('user-1');

    expect(result.map((notification) => notification._id)).toEqual([
      'pending-notification',
      'board-notification',
    ]);
  });

  test('getUnreadCount excludes invite notifications that are no longer pending', async () => {
    await expect(getUnreadCount('user-1')).resolves.toBe(2);
  });
});
