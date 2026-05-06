import { useCanvasContext } from '../../../hooks/useCanvasContext';
import { Button } from '../../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import {
  MousePointer2,
  Paintbrush,
  Eraser,
  PaintBucket,
  Trash2,
  Download,
  Save,
  Play,
} from 'lucide-react';
import { useAuthStore } from '../../../stores/useAuthStore';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import apiClient from '../../../api/client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { loadSegmentationModel, runSegmentation } from '../../../lib/segmentationModel';

const ToolboxContainer = () => {
  const {
    canvasRef,
    bgCanvasRef,
    maskCanvasRef,
    moveSelected,
    brushSelected,
    fillSelected,
    eraserSelected,
    isSegmenting,
    handleMove,
    handleBrush,
    handleEraser,
    handleFill,
    handleClearCanvas,
    setMaskToggle,
    setSegmentationPreview,
    setIsSegmenting,
  } = useCanvasContext();

  const user = useAuthStore((state) => state.user);
  const { id } = useParams();
  const modelRef = useRef(null);

  const handleSaveAnnotation = async () => {
    const dataURL = canvasRef.current.toDataURL('image/png', 1.0);
    try {
      await apiClient.patch(
        `/api/boardRoute/${id}`,
        { annotationImage: dataURL },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      toast.success('Save successfully.');
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred.');
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const imageCanvas = bgCanvasRef.current;
    const canvasCanvas = canvasRef.current;

    zip.file('image.png', imageCanvas.toDataURL('image/png').split(',')[1], {
      base64: true,
    });
    zip.file('label.png', canvasCanvas.toDataURL('image/png').split(',')[1], {
      base64: true,
    });

    const combinedCanvas = document.createElement('canvas');
    combinedCanvas.width = imageCanvas.width;
    combinedCanvas.height = imageCanvas.height;
    const ctx = combinedCanvas.getContext('2d');
    ctx.drawImage(imageCanvas, 0, 0);
    ctx.drawImage(canvasCanvas, 0, 0);
    zip.file(
      'combined.png',
      combinedCanvas.toDataURL('image/png').split(',')[1],
      { base64: true },
    );

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'canvas.zip');
  };

  const handleSegment = async () => {
    const sourceCanvas = bgCanvasRef.current;
    const targetCanvas = maskCanvasRef.current;

    if (
      !sourceCanvas ||
      !targetCanvas ||
      sourceCanvas.width === 0 ||
      sourceCanvas.height === 0
    ) {
      toast.error('No image available for segmentation.');
      return;
    }

    setIsSegmenting(true);

    try {
      if (!modelRef.current) {
        modelRef.current = await loadSegmentationModel(tf, '/unet-model/model.json');
      }

      await runSegmentation({
        tf,
        model: modelRef.current,
        sourceCanvas,
        targetCanvas,
      });

      setSegmentationPreview(targetCanvas.toDataURL('image/png'));
      setMaskToggle(true);
      toast.success('Segmentation complete.');
    } catch (error) {
      console.error('Failed to run segmentation:', error);
      toast.error('Failed to run segmentation.');
    } finally {
      setIsSegmenting(false);
    }
  };

  const ToolButton = ({
    icon: Icon,
    title,
    active,
    disabled = false,
    onClick,
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={active ? 'default' : 'ghost'}
          size='icon'
          className='h-10 w-10'
          onClick={onClick}
          disabled={disabled}
          aria-label={title}
        >
          <Icon className='h-5 w-5' />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right'>
        <p>{title}</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className='w-14 border-r bg-background flex flex-col items-center py-4 gap-4'>
      <ToolButton
        icon={MousePointer2}
        title='Move (M)'
        active={moveSelected}
        onClick={handleMove}
      />
      <ToolButton
        icon={Paintbrush}
        title='Brush (B)'
        active={brushSelected}
        onClick={handleBrush}
      />
      <ToolButton
        icon={PaintBucket}
        title='Fill (F)'
        active={fillSelected}
        onClick={handleFill}
      />
      <ToolButton
        icon={Eraser}
        title='Eraser (E)'
        active={eraserSelected}
        onClick={handleEraser}
      />

      <div className='flex-grow' />

      <ToolButton icon={Trash2} title='Clear All' onClick={handleClearCanvas} />
      <ToolButton
        icon={Play}
        title={isSegmenting ? 'Segmenting...' : 'Play'}
        disabled={isSegmenting}
        onClick={handleSegment}
      />
      <ToolButton icon={Download} title='Download' onClick={handleDownload} />
      <ToolButton icon={Save} title='Save' onClick={handleSaveAnnotation} />
    </div>
  );
};

export default ToolboxContainer;
