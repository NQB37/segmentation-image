import { useState } from 'react';
import BtnSegment from './BtnSegment';
import BtnVisible from '../BtnVisible';
import * as tf from '@tensorflow/tfjs';
import { useCanvasContext } from '../../../hooks/useCanvasContext';

const SegmentContainer = () => {
    const [model, setModel] = useState(null);
    const { bgCanvasRef, maskCanvasRef, maskToggle, handleMaskToggle } =
        useCanvasContext();
    const handleSegment = async () => {
        if (!model) {
            try {
                const loadedModel = await tf.loadLayersModel(
                    '/unet/model.json',
                );
                setModel(loadedModel);
                runSegment(loadedModel);
            } catch (error) {
                console.error('Failed to load model:', error);
            }
        } else {
            runSegment(model);
        }
    };
    const runSegment = async (model) => {
        const imgCtx = bgCanvasRef.current.getContext('2d');
        const { width, height } = bgCanvasRef.current;
        const imageData = imgCtx.getImageData(0, 0, width, height);

        // Convert canvas to tensor
        let tensor = tf.browser.fromPixels(imageData);

        // Convert to grayscale
        tensor = tf.image.rgbToGrayscale(tensor);

        // Resize to model input
        tensor = tf.image.resizeBilinear(tensor, [256, 256]);
        tensor = tf.expandDims(tensor, 0);

        // Predict
        let pred = model.predict(tensor);

        // Resize prediction back to canvas size
        pred = tf.image.resizeBilinear(pred, [height, width]);

        // Process prediction to mask
        const mask = pred.squeeze();
        const maskArr = await mask.arraySync();

        // Draw mask to maskCanvas
        const maskCtx = maskCanvasRef.current.getContext('2d');
        const maskImg = maskCtx.createImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const v = Math.floor(maskArr[y][x] * 255);

                maskImg.data[i] = v;
                maskImg.data[i + 1] = v;
                maskImg.data[i + 2] = v;
                maskImg.data[i + 3] = 255;
            }
        }
        maskCtx.putImageData(maskImg, 0, 0);

        // Cleanup
        tf.dispose([tensor, pred, mask]);

        console.log(maskArr);
    };
    return (
        <div>
            <div className="px-4 py-2 flex justify-between border-y border-black">
                <div className="font-bold">Segmentation</div>
                <div className="flex gap-3">
                    {/* <BtnVisible state={maskToggle} onClick={handleMaskToggle} /> */}
                    <BtnVisible />
                    <BtnSegment onClick={handleSegment} />
                </div>
            </div>
        </div>
    );
};

export default SegmentContainer;
