import assert from 'node:assert/strict';
import { getCanvasZipEntries } from './canvasDownload.js';

const makeCanvas = (name) => ({
    toDataURL: () => `data:image/png;base64,${name}`,
});

assert.deepEqual(
    getCanvasZipEntries({
        imageCanvas: makeCanvas('image-data'),
        annotationCanvas: makeCanvas('annotation-data'),
        maskCanvas: makeCanvas('mask-data'),
        combinedCanvas: makeCanvas('combined-data'),
    }),
    [
        { name: 'image.png', data: 'image-data' },
        { name: 'label.png', data: 'annotation-data' },
        { name: 'segmentation.png', data: 'mask-data' },
        { name: 'combined.png', data: 'combined-data' },
    ],
);
