import { useEffect } from "react";
import { useCanvasContext } from "../../../hooks/useCanvasContext";
import { Badge } from "../../ui/badge";

const CanvasContainer = () => {
  const {
    containerRef, bgCanvasRef, canvasRef, maskCanvasRef,
    scale, pos, totalDrawnLength, canvasSize,
    startPan, pan, endPan, handleWheelZoom, handleCanvasClick,
    startDrawing, draw, endDrawing, annotationToggle, maskToggle,
  } = useCanvasContext();

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(() => {
      // Logic to keep scale/pan consistent on resize can go here
      // We explicitly do NOT change the internal canvas resolution here
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, [containerRef]);

  // Ensure canvas resolution matches image size even if loaded before mount
  useEffect(() => {
    if (canvasSize.width > 0) {
      if (bgCanvasRef.current) {
        bgCanvasRef.current.width = canvasSize.width;
        bgCanvasRef.current.height = canvasSize.height;
      }
      if (canvasRef.current) {
        canvasRef.current.width = canvasSize.width;
        canvasRef.current.height = canvasSize.height;
      }
      if (maskCanvasRef.current) {
        maskCanvasRef.current.width = canvasSize.width;
        maskCanvasRef.current.height = canvasSize.height;
      }
    }
  }, [canvasSize, bgCanvasRef, canvasRef, maskCanvasRef]);

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-crosshair"
      onMouseDown={startPan}
      onMouseMove={pan}
      onMouseUp={endPan}
      onMouseLeave={endPan}
    >
      <div
        ref={containerRef}
        onWheel={handleWheelZoom}
        className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out"
        style={{
          transform: `scale(${scale}) translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        <canvas ref={bgCanvasRef} className="z-0 absolute top-0 left-0 size-full shadow-lg" />
        <canvas ref={maskCanvasRef} className={`z-10 absolute top-0 left-0 size-full opacity-25 ${maskToggle ? '' : 'hidden'}`} />
        <canvas
          ref={canvasRef}
          className={`z-20 absolute top-0 left-0 size-full ${annotationToggle ? "" : "hidden"}`}
          onClick={handleCanvasClick}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
      </div>
      
      <div className="absolute right-4 bottom-4 z-30">
        <Badge variant="secondary" className="px-3 py-1 font-mono shadow-sm border bg-background/80 backdrop-blur-sm">
          Total: {totalDrawnLength.toLocaleString()} pixels
        </Badge>
      </div>
    </div>
  );
};

export default CanvasContainer;
