import assert from 'node:assert/strict';
import {
    HAND_COMMANDS,
    getCursorPoint,
    getPinchDistance,
    isPinching,
    mapHandGestureToCommand,
    mirrorGesturePoint,
} from './handGestureMapping.js';

const landmarks = Array.from({ length: 21 }, () => ({ x: 0, y: 0, z: 0 }));
landmarks[4] = { x: 0.1, y: 0.1, z: 0 };
landmarks[8] = { x: 0.13, y: 0.13, z: 0 };

assert.deepEqual(getCursorPoint(landmarks), { x: 0.13, y: 0.13, z: 0 });
assert.deepEqual(mirrorGesturePoint({ x: 0.13, y: 0.75, z: 0 }), {
    x: 0.87,
    y: 0.75,
    z: 0,
});
assert.ok(getPinchDistance(landmarks) < 0.055);
assert.equal(isPinching(landmarks), true);

assert.deepEqual(
    mapHandGestureToCommand({ gestureName: 'Open_Palm', landmarks }),
    { type: HAND_COMMANDS.DRAW, point: { x: 0.87, y: 0.13, z: 0 } },
);

const openLandmarks = landmarks.map((landmark) => ({ ...landmark }));
openLandmarks[4] = { x: 0.1, y: 0.1, z: 0 };
openLandmarks[8] = { x: 0.9, y: 0.9, z: 0 };

assert.deepEqual(
    mapHandGestureToCommand({ gestureName: 'Closed_Fist', landmarks: openLandmarks }),
    { type: HAND_COMMANDS.PAN, point: { x: 0.1, y: 0.9, z: 0 } },
);

assert.deepEqual(
    mapHandGestureToCommand({ gestureName: 'Thumb_Up', landmarks: openLandmarks }),
    { type: HAND_COMMANDS.TOGGLE_TOOL },
);

assert.deepEqual(
    mapHandGestureToCommand({ gestureName: 'Open_Palm', landmarks: openLandmarks }),
    { type: HAND_COMMANDS.IDLE },
);

assert.deepEqual(
    mapHandGestureToCommand({ gestureName: 'None', landmarks: openLandmarks }),
    { type: HAND_COMMANDS.CURSOR, point: { x: 0.1, y: 0.9, z: 0 } },
);
