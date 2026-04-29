import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import {
    boardModel,
    inviteModel,
    resetStore,
    userModel,
} from './helpers/memoryModels.js';

process.env.SECRET = 'test-secret';

await jest.unstable_mockModule('../models/boardModel.js', () => ({
    default: boardModel,
}));
await jest.unstable_mockModule('../models/inviteModel.js', () => ({
    default: inviteModel,
}));
await jest.unstable_mockModule('../models/userModel.js', () => ({
    default: userModel,
}));

const { default: app } = await import('../app.js');
const { default: Board } = await import('../models/boardModel.js');
const { default: Invite } = await import('../models/inviteModel.js');
const { default: User } = await import('../models/userModel.js');

const tokenFor = (user) =>
    jwt.sign({ _id: user._id.toString() }, process.env.SECRET);

const createUser = (email) =>
    User.create({
        email,
        name: email.split('@')[0],
        password: 'password',
    });

const createBoard = (attrs = {}) =>
    Board.create({
        title: attrs.title || 'Board',
        image: attrs.image || 'data:image/png;base64,test',
        ownerId: attrs.ownerId,
        membersId: attrs.membersId || [],
        labelsId: attrs.labelsId || [],
        annotationImage: '',
        segmentImage: '',
    });

beforeEach(() => {
    resetStore();
});

describe('invite authorization', () => {
    test('outsider cannot send invite for board they do not own', async () => {
        const owner = await createUser('owner@example.com');
        const outsider = await createUser('outsider@example.com');
        const recipient = await createUser('recipient@example.com');
        const board = await createBoard({ ownerId: owner._id });

        const response = await request(app)
            .post('/api/inviteRoute/invite')
            .set('Authorization', `Bearer ${tokenFor(outsider)}`)
            .send({ toEmail: recipient.email, boardId: board._id });

        expect(response.status).toBe(403);

        await expect(
            Invite.countDocuments({ boardId: board._id, toId: recipient._id }),
        ).resolves.toBe(0);
    });

    test('only invite recipient can accept invite', async () => {
        const owner = await createUser('owner@example.com');
        const invited = await createUser('invited@example.com');
        const outsider = await createUser('outsider@example.com');
        const board = await createBoard({ ownerId: owner._id });
        const invite = await Invite.create({
            toId: invited._id,
            boardId: board._id,
            status: 'Pending',
        });

        const response = await request(app)
            .post(`/api/inviteRoute/invite/${invite._id}`)
            .set('Authorization', `Bearer ${tokenFor(outsider)}`)
            .send({ inviteId: invite._id, status: 'Accept' });

        expect(response.status).toBe(404);

        const unchangedInvite = await Invite.findById(invite._id);
        expect(unchangedInvite.status).toBe('Pending');

        const unchangedBoard = await Board.findById(board._id);
        expect(unchangedBoard.membersId).toHaveLength(0);
    });
});
