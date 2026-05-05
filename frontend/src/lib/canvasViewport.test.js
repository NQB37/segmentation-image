import assert from 'node:assert/strict';
import {
    clampScale,
    getCanvasPoint,
    getCanvasPointFromNormalizedPoint,
    getGestureCursorStyle,
    getTransformOrigin,
    getViewportTransform,
} from './canvasViewport.js';

const rect = {
    left: 10,
    top: 20,
    width: 200,
    height: 100,
};

const canvas = {
    width: 1000,
    height: 500,
    getBoundingClientRect: () => rect,
};

assert.equal(clampScale(0.5), 1);
assert.equal(clampScale(12), 10);
assert.equal(clampScale(4), 4);

assert.deepEqual(
    getCanvasPoint({ clientX: 110, clientY: 70 }, canvas),
    { x: 500, y: 250 },
);

assert.deepEqual(
    getCanvasPointFromNormalizedPoint({ x: 0.25, y: 0.75 }, canvas),
    { x: 250, y: 375 },
);

assert.deepEqual(
    getGestureCursorStyle({ x: 0.25, y: 0.75 }),
    { left: '25%', top: '75%' },
);

assert.equal(getGestureCursorStyle(null), null);

assert.deepEqual(
    getTransformOrigin({ clientX: 60, clientY: 45 }, canvas),
    { x: 25, y: 25 },
);

assert.equal(
    getViewportTransform({ x: 12, y: -8 }, 3),
    'translate(12px, -8px) scale(3)',
);
