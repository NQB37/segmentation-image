export const HAND_COMMANDS = {
    IDLE: 'idle',
    CURSOR: 'cursor',
    DRAW: 'draw',
    PAN: 'pan',
    ZOOM: 'zoom',
    TOGGLE_TOOL: 'toggle_tool',
};

const THUMB_TIP = 4;
const INDEX_TIP = 8;
const PINCH_THRESHOLD = 0.055;

export const getLandmarkPoint = (landmarks, index) => {
    const landmark = landmarks?.[index];
    if (!landmark) return null;

    return {
        x: landmark.x,
        y: landmark.y,
        z: landmark.z || 0,
    };
};

export const getPinchDistance = (landmarks) => {
    const thumb = getLandmarkPoint(landmarks, THUMB_TIP);
    const index = getLandmarkPoint(landmarks, INDEX_TIP);
    if (!thumb || !index) return Number.POSITIVE_INFINITY;

    const dx = thumb.x - index.x;
    const dy = thumb.y - index.y;
    return Math.sqrt(dx * dx + dy * dy);
};

export const isPinching = (landmarks) => (
    getPinchDistance(landmarks) < PINCH_THRESHOLD
);

export const getCursorPoint = (landmarks) => getLandmarkPoint(landmarks, INDEX_TIP);

export const mirrorGesturePoint = (point) => {
    if (!point) return null;

    return {
        ...point,
        x: Number((1 - point.x).toFixed(6)),
    };
};

export const mapHandGestureToCommand = ({ gestureName, landmarks }) => {
    if (!landmarks) return { type: HAND_COMMANDS.IDLE };

    const point = mirrorGesturePoint(getCursorPoint(landmarks));

    if (isPinching(landmarks)) {
        return {
            type: HAND_COMMANDS.DRAW,
            point,
        };
    }

    if (gestureName === 'Open_Palm') {
        return { type: HAND_COMMANDS.IDLE };
    }

    if (gestureName === 'Closed_Fist') {
        return {
            type: HAND_COMMANDS.PAN,
            point,
        };
    }

    if (gestureName === 'Thumb_Up') {
        return { type: HAND_COMMANDS.TOGGLE_TOOL };
    }

    return {
        type: HAND_COMMANDS.CURSOR,
        point,
    };
};
