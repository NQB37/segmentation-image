export const clampScale = (value, min = 1, max = 10) => (
    Math.min(Math.max(value, min), max)
);

export const getCanvasPoint = (event, canvas) => {
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
    };
};

export const getCanvasPointFromNormalizedPoint = (point, canvas) => {
    if (!canvas || !point) return { x: 0, y: 0 };

    return {
        x: point.x * canvas.width,
        y: point.y * canvas.height,
    };
};

export const getGestureCursorStyle = (point) => {
    if (!point) return null;

    return {
        left: `${point.x * 100}%`,
        top: `${point.y * 100}%`,
    };
};

export const getTransformOrigin = (event, element) => {
    if (!element) return { x: 0, y: 0 };

    const rect = element.getBoundingClientRect();

    return {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
    };
};

export const getViewportTransform = (pos, scale) => (
    `translate(${pos.x}px, ${pos.y}px) scale(${scale})`
);
