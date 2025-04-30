import { createContext, useState, useContext, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';

const CanvasContext = createContext();

export const useCanvasContext = () => useContext(CanvasContext);

export const CanvasProvider = ({ children }) => {
    // canvas ref
    const containerRef = useRef(null);
    const bgCanvasRef = useRef(null);
    const canvasRef = useRef(null);
    const maskCanvasRef = useRef(null);
    // move tool
    const [moveSelected, setMoveSelected] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [startPos, setStartPos] = useState(null);
    const [lastPos, setLastPos] = useState(null);
    // brush tool
    const [brushSelected, setBrushSelected] = useState(false);
    const [brushSize, setBrushSize] = useState(1);
    // fill tool
    const [fillSelected, setFillSelected] = useState(false);
    // eraser tool
    const [eraserSelected, setEraserSelected] = useState(false);
    const [eraserSize, setEraserSize] = useState(5);

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ff0000');
    const [scale, setScale] = useState(1);
    const [origin, setOrigin] = useState({ x: 0, y: 0 });
    const [totalDrawnLength, setTotalDrawnLength] = useState(0);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheelZoom, {
                passive: false,
            });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheelZoom);
            }
        };
    }, [scale]);

    const resetBtn = () => {
        setMoveSelected(false);
        setBrushSelected(false);
        setEraserSelected(false);
        setFillSelected(false);
    };

    // load image
    const handleLoadImage = (image) => {
        if (!image) return;
        const img = new Image();
        img.onload = () => {
            const bgCanvas = bgCanvasRef.current;
            if (!bgCanvas) {
                console.error('Canvas ref is null');
                return;
            }
            const ctx = bgCanvas.getContext('2d');
            bgCanvas.width = img.width;
            bgCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = image;
        console.log('load finished');
    };

    //handle move
    const handleMove = () => {
        resetBtn();
        setMoveSelected(true);
    };

    // handle brush
    const handleBrush = () => {
        resetBtn();
        setBrushSelected(true);
    };
    const handleBrushSize = (e) => {
        e.preventDefault();
        setBrushSize(e.target.value);
    };
    // handle fill color
    const handleFill = () => {
        resetBtn();
        setFillSelected(true);
    };

    // handle eraser
    const handleEraser = () => {
        resetBtn();
        setEraserSelected(true);
    };
    const handleEraserSize = (e) => {
        e.preventDefault();
        setEraserSize(e.target.value);
    };

    const startPan = (e) => {
        if (moveSelected) {
            setStartPos({ x: e.clientX, y: e.clientY });
            containerRef.current.style.cursor = 'grab';
        }
    };

    //handle move
    const pan = (e) => {
        if (moveSelected && startPos) {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;

            setPos((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));

            setStartPos({ x: e.clientX, y: e.clientY });
        }
    };

    const endPan = () => {
        setStartPos(null);
        containerRef.current.style.cursor = 'default';
    };

    // handle draw
    const getMousePosition = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale,
        };
    };

    const startDrawing = (e) => {
        if (brushSelected || eraserSelected) {
            setIsDrawing(true);
            const ctx = canvasRef.current.getContext('2d');
            if (eraserSelected) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = eraserSize;
            }
            if (brushSelected) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = color;
                ctx.lineWidth = brushSize;
            }
            const { x, y } = getMousePosition(e);
            ctx.beginPath();
            ctx.moveTo(x, y);

            setTotalDrawnLength(0);
            const startPos = getMousePosition(e);
            setLastPos(startPos);
        }
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current.getContext('2d');
        const { x, y } = getMousePosition(e);
        if (lastPos) {
            const dx = x - lastPos.x;
            const dy = y - lastPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            setTotalDrawnLength((prevLength) => prevLength + distance);
        }
        ctx.lineTo(x, y);
        ctx.stroke();
        setLastPos({ x, y });
    };

    const endDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            const ctx = canvasRef.current.getContext('2d');
            ctx.closePath();
            setLastPos(null);
        }
    };

    // handle fill
    const hexToRGBA = (hex) => [
        (parseInt(hex.slice(1), 16) >> 16) & 255,
        (parseInt(hex.slice(1), 16) >> 8) & 255,
        parseInt(hex.slice(1), 16) & 255,
        255,
    ];

    const fillArea = (startX, startY, fillHex) => {
        const { current: canvas } = canvasRef;
        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        const data = ctx.getImageData(0, 0, width, height);
        const pixels = data.data;
        const startColor = pixels.slice(
            (startY * width + startX) * 4,
            (startY * width + startX) * 4 + 4,
        );
        const fillColor = hexToRGBA(fillHex);
        if (startColor.every((v, i) => v === fillColor[i])) return;

        const match = (x, y) => {
            const i = (y * width + x) * 4;
            return startColor.every((v, idx) => v === pixels[i + idx]);
        };
        const color = (x, y) => {
            const i = (y * width + x) * 4;
            fillColor.forEach((v, idx) => (pixels[i + idx] = v));
        };

        const stack = [[startX, startY]];

        while (stack.length) {
            let [x, y] = stack.pop();

            while (x >= 0 && match(x, y)) x--;
            x++;

            let above = false,
                below = false;
            while (x < width && match(x, y)) {
                color(x, y);

                if (y > 0 && match(x, y - 1)) {
                    if (!above) stack.push([x, y - 1]);
                    above = true;
                } else above = false;

                if (y < height - 1 && match(x, y + 1)) {
                    if (!below) stack.push([x, y + 1]);
                    below = true;
                } else below = false;

                x++;
            }
        }
        ctx.putImageData(data, 0, 0);
    };

    // handle zoom
    const handleZoomChange = (e) => {
        const newScale = parseFloat(e.target.value);
        setScale(newScale);
    };

    const handleWheelZoom = (e) => {
        e.preventDefault();
        const zoomSpeed = 0.005;
        let newScale = scale - e.deltaY * zoomSpeed;
        newScale = Math.min(Math.max(newScale, 1), 10);

        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newOriginX = (mouseX / rect.width) * 100;
        const newOriginY = (mouseY / rect.height) * 100;
        setOrigin({ x: newOriginX, y: newOriginY });

        setScale(newScale);
    };

    const handleCanvasClick = (e) => {
        if (fillSelected) {
            const { x, y } = getMousePosition(e);
            fillArea(Math.floor(x), Math.floor(y), color);
        }
    };

    const handleClearCanvas = () => {
        const canvas = canvasRef.current.getContext('2d');
        canvas.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height,
        );
    };

    // change label
    const handleColorChange = (e) => {
        e.preventDefault();
        setColor(e.target.value);
    };

    // labels
    const [labels, setLabels] = useState([]);

    const handleAddLabel = (title, color) => {
        setLabels((prev) => [...prev, { text: title, color: color }]);
    };

    // segmentation
    const [model, setModel] = useState(null);
    const handleSegment = async () => {
        console.log('loading');
        if (!model) {
            try {
                console.log('loading');
                const loadedModel = await tf.loadLayersModel(
                    '../assets/model.json',
                );
                setModel(loadedModel);
                console.log('run');
                runSegment(loadedModel);
            } catch (error) {
                console.error('Failed to load model:', error);
            }
        } else {
            runSegment(model);
        }
    };
    const runSegment = async () => {
        const imgCtx = containerRef.current.getContext('2d');
        const { width, height } = containerRef.current;
        const imageData = imgCtx.getImageData(0, 0, width, height);
        // preprocess
        let tensor = tf.browser
            .fromPixels(imageData)
            .toFloat()
            .div(255)
            .expandDims(0);
        // resize
        tensor = tf.image.resizeBilinear(tensor, [256, 256]);
        let pred = model.predict(tensor);
        // resize back
        pred = tf.image.resizeBilinear(pred, [height, width]);

        const mask = pred.squeeze();
        const maskArr = await mask.array();

        // draw mask
        const maskCtx = maskCanvasRef.current.getContext('2d');
        const maskImg = maskCtx.createImageData(width, height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const v = Math.floor(maskArr[y][x] * 255);
                maskImg.data[i] = 0;
                maskImg.data[i + 1] = 0;
                maskImg.data[i + 2] = 0;
                maskImg.data[i + 3] = v; // grayscale alpha
            }
        }
        maskCtx.putImageData(maskImg, 0, 0);
        tf.dispose([tensor, pred, mask]);
    };

    return (
        <CanvasContext.Provider
            value={{
                containerRef,
                bgCanvasRef,
                canvasRef,
                maskCanvasRef,
                moveSelected,
                pos,
                startPos,
                lastPos,
                brushSelected,
                color,
                brushSize,
                fillSelected,
                eraserSelected,
                eraserSize,
                isDrawing,
                totalDrawnLength,
                scale,
                origin,
                labels,
                resetBtn,
                handleLoadImage,
                handleMove,
                handleBrush,
                handleBrushSize,
                handleFill,
                handleEraser,
                handleEraserSize,
                startPan,
                pan,
                endPan,
                getMousePosition,
                startDrawing,
                draw,
                endDrawing,
                hexToRGBA,
                fillArea,
                handleZoomChange,
                handleWheelZoom,
                handleCanvasClick,
                handleClearCanvas,
                handleColorChange,
                handleAddLabel,
                handleSegment,
            }}
        >
            {children}
        </CanvasContext.Provider>
    );
};
