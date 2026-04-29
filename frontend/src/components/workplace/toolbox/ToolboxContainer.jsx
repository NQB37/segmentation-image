import { useCanvasContext } from '../../../hooks/useCanvasContext';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { MousePointer2, Paintbrush, Eraser, PaintBucket, Trash2, Download, Save } from 'lucide-react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import apiClient from '../../../api/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const ToolboxContainer = () => {
  const {
    canvasRef,
    bgCanvasRef,
    moveSelected,
    brushSelected,
    fillSelected,
    eraserSelected,
    handleMove,
    handleBrush,
    handleEraser,
    handleFill,
    handleClearCanvas,
  } = useCanvasContext();

  const { user } = useAuthContext();
  const { id } = useParams();

  const handleSaveAnnotation = async () => {
    const dataURL = canvasRef.current.toDataURL('image/png', 1.0);
    try {
      await apiClient.patch(`/api/boardRoute/${id}`, { annotationImage: dataURL }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Save successfully.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred.');
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const imageCanvas = bgCanvasRef.current;
    const canvasCanvas = canvasRef.current;
    
    zip.file('image.png', imageCanvas.toDataURL('image/png').split(',')[1], { base64: true });
    zip.file('label.png', canvasCanvas.toDataURL('image/png').split(',')[1], { base64: true });
    
    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = imageCanvas.width;
    combinedCanvas.height = imageCanvas.height;
    const ctx = combinedCanvas.getContext('2d');
    ctx.drawImage(imageCanvas, 0, 0);
    ctx.drawImage(canvasCanvas, 0, 0);
    zip.file('combined.png', combinedCanvas.toDataURL('image/png').split(',')[1], { base64: true });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'canvas.zip');
  };

  const ToolButton = ({ icon: Icon, title, active, onClick }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? "default" : "ghost"}
          size="icon"
          className="h-10 w-10"
          onClick={onClick}
        >
          <Icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="w-14 border-r bg-background flex flex-col items-center py-4 gap-4">
      <ToolButton icon={MousePointer2} title="Move (M)" active={moveSelected} onClick={handleMove} />
      <ToolButton icon={Paintbrush} title="Brush (B)" active={brushSelected} onClick={handleBrush} />
      <ToolButton icon={PaintBucket} title="Fill (F)" active={fillSelected} onClick={handleFill} />
      <ToolButton icon={Eraser} title="Eraser (E)" active={eraserSelected} onClick={handleEraser} />
      
      <div className="flex-grow" />

      <ToolButton icon={Trash2} title="Clear All" onClick={handleClearCanvas} />
      <ToolButton icon={Download} title="Download" onClick={handleDownload} />
      <ToolButton icon={Save} title="Save" onClick={handleSaveAnnotation} />
    </div>
  );
};

export default ToolboxContainer;
