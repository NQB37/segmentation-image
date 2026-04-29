import { useEffect } from "react";
import { useCanvasContext } from "../../../hooks/useCanvasContext";
import { Badge } from "../../ui/badge";

const CanvasContainer = () => {
  const {
    containerRef, bgCanvasRef, canvasRef, maskCanvasRef,
    scale, pos, totalDrawnLength,
    startPan, pan, endPan, handleWheelZoom, handleCanvasClick,
    startDrawing, draw, endDrawing, annotationToggle, maskToggle,
  } = useCanvasContext();

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
