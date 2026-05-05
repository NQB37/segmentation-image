import { Camera, CameraOff } from 'lucide-react';
import { Button } from '../../ui/button';
import { useCanvasContext } from '../../../hooks/useCanvasContext';
import { useHandGestureController } from '../../../hooks/useHandGestureController';

const CameraGesturePanel = () => {
    const {
        startGestureStroke,
        moveGestureStroke,
        endGestureStroke,
        panByGestureDelta,
        zoomByGestureRatio,
        handleBrush,
        handleEraser,
        brushSelected,
        color,
        setGestureCursorPoint,
    } = useCanvasContext();

    const controller = useHandGestureController({
        onDrawStart: startGestureStroke,
        onDrawMove: moveGestureStroke,
        onDrawEnd: endGestureStroke,
        onPan: panByGestureDelta,
        onZoom: zoomByGestureRatio,
        onToolToggle: () => {
            if (!color) return;

            if (brushSelected) {
                handleEraser();
            } else {
                handleBrush();
            }
        },
        onCursor: setGestureCursorPoint,
    });

    return (
        <div className="absolute left-4 bottom-4 z-30 w-56 rounded-md border bg-background/90 p-2 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-xs font-medium text-muted-foreground">
                    {controller.status}
                </span>
                <Button
                    type="button"
                    variant={controller.enabled ? 'secondary' : 'default'}
                    size="icon"
                    className="h-8 w-8"
                    disabled={controller.isLoading}
                    onClick={controller.enabled ? controller.stop : controller.start}
                    aria-label={controller.enabled ? 'Stop camera gestures' : 'Start camera gestures'}
                >
                    {controller.enabled ? (
                        <CameraOff className="h-4 w-4" />
                    ) : (
                        <Camera className="h-4 w-4" />
                    )}
                </Button>
            </div>
            <video
                ref={controller.videoRef}
                className="mt-2 aspect-video w-full rounded bg-muted object-cover"
                playsInline
                muted
            />
            {controller.error && (
                <p className="mt-2 text-xs text-destructive">{controller.error}</p>
            )}
        </div>
    );
};

export default CameraGesturePanel;
