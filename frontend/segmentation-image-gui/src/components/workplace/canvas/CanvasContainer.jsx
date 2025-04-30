import { useEffect } from 'react';
import { useCanvasContext } from '../../../hooks/useCanvasContext';

const CanvasContainer = () => {
    const {
        containerRef,
        bgCanvasRef,
        canvasRef,
        maskCanvasRef,
        scale,
        pos,
        totalDrawnLength,
        startPan,
        pan,
        endPan,
        handleWheelZoom,
        handleCanvasClick,
        startDrawing,
        draw,
        endDrawing,
    } = useCanvasContext();

    // init canvas
    useEffect(() => {
        const container = bgCanvasRef.current.parentNode;
        const width = container.offsetWidth;
        const height = container.offsetHeight;

        bgCanvasRef.current.width = width;
        bgCanvasRef.current.height = height;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        maskCanvasRef.current.width = width;
        maskCanvasRef.current.height = height;
    }, []);

    return (
        <div
            className="relative w-5/6 overflow-hidden"
            onMouseDown={startPan}
            onMouseMove={pan}
            onMouseUp={endPan}
            onMouseLeave={endPan}
        >
            <div
                ref={containerRef}
                onWheel={handleWheelZoom}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    transform: `scale(${scale}) translate(${pos.x}px, ${pos.y}px)`,
                    transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
            >
                {/* Background canvas for image */}
                <canvas
                    ref={bgCanvasRef}
                    className="absolute top-0 left-0 size-full"
                />
                {/* Annotation canvas overlay */}
                <canvas
                    ref={canvasRef}
                    className="absolute top-0 left-0 size-full"
                    onClick={handleCanvasClick}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                />
                {/* Mark canvas  */}
                <canvas
                    ref={maskCanvasRef}
                    className="absolute top-0 left-0 size-full"
                />
            </div>
            <div className="absolute right-0 bottom-0 w-fit bg-gray-300">
                <p>Total: {totalDrawnLength} pixels</p>
            </div>
        </div>
    );
};

export default CanvasContainer;
