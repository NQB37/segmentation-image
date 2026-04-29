import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import {
    boardModel,
    labelModel,
    resetStore,
    userModel,
} from './helpers/memoryModels.js';

process.env.SECRET = 'test-secret';

await jest.unstable_mockModule('../models/boardModel.js', () => ({
    default: boardModel,
}));
await jest.unstable_mockModule('../models/labelModel.js', () => ({
    default: labelModel,
}));
await jest.unstable_mockModule('../models/userModel.js', () => ({
    default: userModel,
}));

const { default: app } = await import('../app.js');
const { default: Board } = await import('../models/boardModel.js');
const { default: Label } = await import('../models/labelModel.js');
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

describe('board authorization', () => {
    test('outsider cannot read board details', async () => {
        const owner = await createUser('owner@example.com');
        const outsider = await createUser('outsider@example.com');
        const board = await createBoard({ ownerId: owner._id });

        const response = await request(app)
            .get(`/api/boardRoute/${board._id}`)
            .set('Authorization', `Bearer ${tokenFor(outsider)}`);

        expect(response.status).toBe(403);

        const unchangedBoard = await Board.findById(board._id);
        expect(unchangedBoard.title).toBe('Board');
        expect(unchangedBoard.ownerId.toString()).toBe(owner._id.toString());
    });

    test('member can read board details', async () => {
        const owner = await createUser('owner@example.com');
        const member = await createUser('member@example.com');
        const board = await createBoard({
            ownerId: owner._id,
            membersId: [member._id],
        });

        const response = await request(app)
            .get(`/api/boardRoute/${board._id}`)
            .set('Authorization', `Bearer ${tokenFor(member)}`);

        expect(response.status).toBe(200);
    });

    test('outsider cannot update board', async () => {
        const owner = await createUser('owner@example.com');
        const outsider = await createUser('outsider@example.com');
        const board = await createBoard({
            title: 'Original',
            ownerId: owner._id,
        });

        const response = await request(app)
            .patch(`/api/boardRoute/${board._id}`)
            .set('Authorization', `Bearer ${tokenFor(outsider)}`)
            .send({ title: 'Renamed' });

        expect(response.status).toBe(403);

        const unchangedBoard = await Board.findById(board._id);
        expect(unchangedBoard.title).toBe('Original');
        expect(unchangedBoard.ownerId.toString()).toBe(owner._id.toString());
    });

    test('raw update cannot replace ownerId', async () => {
        const owner = await createUser('owner@example.com');
        const outsider = await createUser('outsider@example.com');
        const board = await createBoard({ ownerId: owner._id });

        const response = await request(app)
            .patch(`/api/boardRoute/${board._id}`)
            .set('Authorization', `Bearer ${tokenFor(owner)}`)
            .send({ ownerId: outsider._id, title: 'Renamed' });

        expect(response.status).toBe(200);

        const updatedBoard = await Board.findById(board._id);
        expect(updatedBoard.ownerId.toString()).toBe(owner._id.toString());
        expect(updatedBoard.title).toBe('Renamed');
    });

    test('deleting label affects only requested board', async () => {
        const owner = await createUser('owner@example.com');
        const label = await Label.create({ title: 'Shared', color: '#ff0000' });
        const firstBoard = await createBoard({
            title: 'First board',
            ownerId: owner._id,
            labelsId: [label._id],
        });
        const secondBoard = await createBoard({
            title: 'Second board',
            ownerId: owner._id,
            labelsId: [label._id],
        });

        const response = await request(app)
            .delete(`/api/boardRoute/${firstBoard._id}/label/${label._id}`)
            .set('Authorization', `Bearer ${tokenFor(owner)}`);

        expect(response.status).toBe(200);

        const updatedFirstBoard = await Board.findById(firstBoard._id);
        expect(updatedFirstBoard.labelsId.map(String)).not.toContain(
            label._id.toString(),
        );

        const untouchedBoard = await Board.findById(secondBoard._id);
        expect(untouchedBoard.labelsId.map(String)).toContain(
            label._id.toString(),
        );
    });
});
