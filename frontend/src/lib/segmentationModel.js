export const SEGMENTATION_IMAGE_SIZE = 256;
const MASK_ALPHA = 180;
const MASK_COLOR = [34, 197, 94];

export const getPredictionDimensions = (prediction) => {
    const { shape } = prediction;

    if (shape.length === 4) {
        return { height: shape[1], width: shape[2], channels: shape[3] };
    }

    if (shape.length === 3) {
        return { height: shape[0], width: shape[1], channels: shape[2] };
    }

    if (shape.length === 2) {
        return { height: shape[0], width: shape[1], channels: 1 };
    }

    throw new Error(`Unsupported prediction shape: ${shape.join('x')}`);
};

export const predictionValueToAlpha = (value, threshold = 0.5) => (
    value >= threshold ? MASK_ALPHA : 0
);

export const getSegmentationModelLoader = (manifest) => (
    manifest?.format === 'graph-model' ? 'loadGraphModel' : 'loadLayersModel'
);

export const loadSegmentationModel = async (tf, modelUrl) => {
    const response = await fetch(modelUrl);

    if (!response.ok) {
        throw new Error(`Failed to load model manifest: ${response.status}`);
    }

    const manifest = await response.json();
    const loaderName = getSegmentationModelLoader(manifest);

    return tf[loaderName](modelUrl);
};

export const createSegmentationInputTensor = (tf, sourceCanvas) => (
    tf.tidy(() => {
        const pixels = tf.browser.fromPixels(sourceCanvas);
        const resized = tf.image.resizeBilinear(
            pixels,
            [SEGMENTATION_IMAGE_SIZE, SEGMENTATION_IMAGE_SIZE],
            true,
        );

        return resized.div(255).expandDims(0);
    })
);

const getMaskValue = (data, pixelIndex, channels) => {
    if (channels === 1) {
        return data[pixelIndex];
    }

    const offset = pixelIndex * channels;
    let maxValue = data[offset];

    for (let channel = 1; channel < channels; channel += 1) {
        maxValue = Math.max(maxValue, data[offset + channel]);
    }

    return maxValue;
};

export const drawPredictionMask = async (prediction, targetCanvas) => {
    const { width, height, channels } = getPredictionDimensions(prediction);
    const data = await prediction.data();
    const workingCanvas = document.createElement('canvas');
    workingCanvas.width = width;
    workingCanvas.height = height;

    const workingContext = workingCanvas.getContext('2d');
    const maskImage = workingContext.createImageData(width, height);

    for (let index = 0; index < width * height; index += 1) {
        const value = getMaskValue(data, index, channels);
        const alpha = predictionValueToAlpha(value);
        const imageOffset = index * 4;

        maskImage.data[imageOffset] = MASK_COLOR[0];
        maskImage.data[imageOffset + 1] = MASK_COLOR[1];
        maskImage.data[imageOffset + 2] = MASK_COLOR[2];
        maskImage.data[imageOffset + 3] = alpha;
    }

    workingContext.putImageData(maskImage, 0, 0);

    const targetContext = targetCanvas.getContext('2d');
    targetContext.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    targetContext.imageSmoothingEnabled = false;
    targetContext.drawImage(workingCanvas, 0, 0, targetCanvas.width, targetCanvas.height);
};

export const runSegmentation = async ({ tf, model, sourceCanvas, targetCanvas }) => {
    const input = createSegmentationInputTensor(tf, sourceCanvas);
    const prediction = model.predict(input);
    const predictionTensor = Array.isArray(prediction) ? prediction[0] : prediction;

    try {
        await drawPredictionMask(predictionTensor, targetCanvas);
    } finally {
        input.dispose();
        predictionTensor.dispose();

        if (Array.isArray(prediction)) {
            prediction
                .filter((tensor) => tensor !== predictionTensor)
                .forEach((tensor) => tensor.dispose());
        }
    }
};
