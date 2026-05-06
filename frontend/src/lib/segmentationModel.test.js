import assert from 'node:assert/strict';
import {
    SEGMENTATION_IMAGE_SIZE,
    getPredictionDimensions,
    getSegmentationModelLoader,
    predictionValueToAlpha,
} from './segmentationModel.js';

assert.equal(SEGMENTATION_IMAGE_SIZE, 256);

assert.deepEqual(
    getPredictionDimensions({ shape: [1, 256, 256, 1] }),
    { width: 256, height: 256, channels: 1 },
);

assert.deepEqual(
    getPredictionDimensions({ shape: [128, 64, 2] }),
    { width: 64, height: 128, channels: 2 },
);

assert.deepEqual(
    getPredictionDimensions({ shape: [32, 16] }),
    { width: 16, height: 32, channels: 1 },
);

assert.equal(predictionValueToAlpha(0.49), 0);
assert.equal(predictionValueToAlpha(0.5), 180);
assert.equal(predictionValueToAlpha(0.75), 180);
assert.equal(predictionValueToAlpha(0.75, 0.8), 0);

assert.equal(
    getSegmentationModelLoader({ format: 'graph-model' }),
    'loadGraphModel',
);

assert.equal(
    getSegmentationModelLoader({ format: 'layers-model' }),
    'loadLayersModel',
);
