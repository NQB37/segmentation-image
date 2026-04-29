import { Slider } from "../../ui/slider";
import { Label } from "../../ui/label";
import { useCanvasContext } from "../../../hooks/useCanvasContext";

const ToolPropertiesBar = () => {
  const { 
    brushSelected, brushSize, handleBrushSize,
    eraserSelected, eraserSize, handleEraserSize
  } = useCanvasContext();

  const showBrush = brushSelected;
  const showEraser = eraserSelected;

  if (!showBrush && !showEraser) return (
    <div className="h-10 border-b flex items-center px-4 text-sm text-muted-foreground italic">
      Select a tool to see settings
    </div>
  );

  return (
    <div className="h-10 border-b flex items-center px-4 gap-6 bg-background">
      {showBrush && (
        <div className="flex items-center gap-4">
          <Label className="text-xs font-medium uppercase tracking-tight text-muted-foreground">Brush Size</Label>
          <div className="w-32">
            <Slider 
              value={[brushSize]} 
              onValueChange={(val) => handleBrushSize(val[0])} 
              max={100} 
              step={1} 
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground w-8 text-right">{brushSize}px</span>
        </div>
      )}

      {showEraser && (
        <div className="flex items-center gap-4">
          <Label className="text-xs font-medium uppercase tracking-tight text-muted-foreground">Eraser Size</Label>
          <div className="w-32">
            <Slider 
              value={[eraserSize]} 
              onValueChange={(val) => handleEraserSize(val[0])} 
              max={100} 
              step={1} 
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground w-8 text-right">{eraserSize}px</span>
        </div>
      )}
    </div>
  );
};

export default ToolPropertiesBar;
