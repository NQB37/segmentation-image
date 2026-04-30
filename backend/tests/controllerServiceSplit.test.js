import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

const controllerPath = (name) =>
    path.resolve(process.cwd(), 'controllers', `${name}Controller.js`);

describe('controller service split', () => {
    test.each(['board', 'invite', 'user'])(
        '%s controller delegates database work to a service',
        (name) => {
            const source = fs.readFileSync(controllerPath(name), 'utf8');

            expect(source).toContain(`../services/${name}Service.js`);
            expect(source).not.toContain('../models/');
        },
    );
});
