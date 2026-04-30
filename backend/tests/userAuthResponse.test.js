import { jest, describe, beforeEach, test, expect } from '@jest/globals';
import { resetStore, userModel } from './helpers/memoryModels.js';

process.env.SECRET = 'test-secret';

await jest.unstable_mockModule('../models/userModel.js', () => ({
    default: userModel,
}));

const { login, signup } = await import('../services/userService.js');

beforeEach(() => {
    resetStore();
});

describe('auth response', () => {
    test('signup returns the user id for ownership checks', async () => {
        const result = await signup({
            email: 'owner@example.com',
            name: 'Owner',
            password: 'StrongPass123!',
            confirmPassword: 'StrongPass123!',
        });

        expect(result._id).toBeTruthy();
    });

    test('login returns the user id for ownership checks', async () => {
        const created = await signup({
            email: 'owner@example.com',
            name: 'Owner',
            password: 'StrongPass123!',
            confirmPassword: 'StrongPass123!',
        });

        const result = await login({
            email: 'owner@example.com',
            password: 'StrongPass123!',
        });

        expect(result._id).toBe(created._id);
    });
});
