import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { useCanvasContext } from '../../../hooks/useCanvasContext';
import { Button } from '../../ui/button';

const SegmentPanel = () => {
    const {
        maskToggle,
        segmentationPreview,
        handleMaskToggle,
        clearSegmentation,
    } = useCanvasContext();

    return (
        <div className="h-full overflow-y-auto p-4 space-y-4">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleMaskToggle}
                    disabled={!segmentationPreview}
                >
                    {maskToggle ? (
                        <Eye className="mr-2 h-4 w-4" />
                    ) : (
                        <EyeOff className="mr-2 h-4 w-4" />
                    )}
                    {maskToggle ? 'Visible' : 'Hidden'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={clearSegmentation}
                    disabled={!segmentationPreview}
                    aria-label="Clear segmentation"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-md border bg-muted">
                {segmentationPreview ? (
                    <img
                        src={segmentationPreview}
                        alt="Segmentation result"
                        className="h-full w-full object-contain"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
                        No segmentation image
                    </div>
                )}
            </div>
        </div>
    );
};

export default SegmentPanel;
