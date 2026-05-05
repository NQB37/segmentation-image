import { useEffect } from "react";
import { useCanvasContext } from "../../../hooks/useCanvasContext";
import {
  getGestureCursorStyle,
  getViewportTransform,
} from "../../../lib/canvasViewport";
import { Badge } from "../../ui/badge";

const CanvasContainer = () => {
  const {
    containerRef, bgCanvasRef, canvasRef, maskCanvasRef,
    scale, pos, origin, totalDrawnLength, canvasSize,
    startPan, pan, endPan, handleWheelZoom, handleCanvasClick,
    startDrawing, draw, endDrawing, annotationToggle, maskToggle,
    gestureCursorPoint,
  } = useCanvasContext();

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(() => {
      // Logic to keep scale/pan consistent on resize can go here
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, [containerRef]);

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-crosshair flex items-center justify-center bg-slate-900/5"
      onPointerDown={startPan}
      onPointerMove={pan}
      onPointerUp={endPan}
      onPointerCancel={endPan}
    >
      <div
        ref={containerRef}
        onWheel={handleWheelZoom}
        className="relative transition-transform duration-75 ease-out shadow-2xl bg-white"
        style={{
          transform: getViewportTransform(pos, scale),
          transformOrigin: `${origin.x}% ${origin.y}%`,
          aspectRatio: canvasSize.width > 0 ? `${canvasSize.width} / ${canvasSize.height}` : 'auto',
          width: canvasSize.width > 0 ? 'auto' : '100%',
          height: canvasSize.height > 0 ? 'auto' : '100%',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      >
        <canvas ref={bgCanvasRef} className="z-0 block w-full h-full" />
        <canvas ref={maskCanvasRef} className={`z-10 absolute inset-0 size-full opacity-25 ${maskToggle ? '' : 'hidden'}`} />
        <canvas
          ref={canvasRef}
          className={`z-20 absolute inset-0 size-full ${annotationToggle ? "" : "hidden"}`}
          onClick={handleCanvasClick}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
        />
        {gestureCursorPoint && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-30 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-lg ring-2 ring-primary/30"
            style={getGestureCursorStyle(gestureCursorPoint)}
          />
        )}
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
