import { useCallback, useEffect, useRef, useState } from 'react';
import {
    FilesetResolver,
    GestureRecognizer,
} from '@mediapipe/tasks-vision';
import {
    HAND_COMMANDS,
    mapHandGestureToCommand,
} from '../lib/handGestureMapping';

const MIN_GESTURE_SCORE = 0.6;

export const useHandGestureController = ({
    onDrawStart,
    onDrawMove,
    onDrawEnd,
    onPan,
    onZoom,
    onToolToggle,
    onCursor = () => {},
}) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recognizerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const previousCommandRef = useRef({ type: HAND_COMMANDS.IDLE });
    const previousPanPointRef = useRef(null);
    const previousZoomDistanceRef = useRef(null);
    const commandHistoryRef = useRef([]);

    const [enabled, setEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Camera off');

    const initializeRecognizer = useCallback(async () => {
        if (recognizerRef.current) return recognizerRef.current;

        const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        );

        recognizerRef.current = await GestureRecognizer.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath:
                    'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task',
            },
            runningMode: 'VIDEO',
            numHands: 2,
        });

        return recognizerRef.current;
    }, []);

    const getStableCommand = useCallback((command) => {
        commandHistoryRef.current = [
            ...commandHistoryRef.current.slice(-2),
            command.type,
        ];

        const matches = commandHistoryRef.current.filter(
            (type) => type === command.type,
        ).length;

        return matches >= 2 ? command : { type: HAND_COMMANDS.IDLE };
    }, []);

    const dispatchPan = useCallback((point) => {
        if (!point) return;

        const previousPoint = previousPanPointRef.current;
        previousPanPointRef.current = point;

        if (!previousPoint) return;

        onPan({
            dx: (point.x - previousPoint.x) * 400,
            dy: (point.y - previousPoint.y) * 400,
        });
    }, [onPan]);

    const dispatchZoom = useCallback((firstPoint, secondPoint) => {
        if (!firstPoint || !secondPoint) return;

        const dx = secondPoint.x - firstPoint.x;
        const dy = secondPoint.y - firstPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const previousDistance = previousZoomDistanceRef.current;
        previousZoomDistanceRef.current = distance;

        if (!previousDistance) return;

        const ratio = distance / previousDistance;
        if (ratio > 0.98 && ratio < 1.02) return;

        onZoom(ratio);
    }, [onZoom]);

    const dispatchCommand = useCallback((command, secondCommand) => {
        const previousCommand = previousCommandRef.current;

        if (
            command.type === HAND_COMMANDS.DRAW &&
            secondCommand?.type === HAND_COMMANDS.DRAW
        ) {
            dispatchZoom(command.point, secondCommand.point);
            onDrawEnd();
            previousCommandRef.current = { type: HAND_COMMANDS.ZOOM };
            return;
        }

        previousZoomDistanceRef.current = null;

        if (command.type === HAND_COMMANDS.DRAW) {
            previousPanPointRef.current = null;
            if (previousCommand.type !== HAND_COMMANDS.DRAW) {
                onDrawStart(command.point);
            } else {
                onDrawMove(command.point);
            }
        } else if (command.type === HAND_COMMANDS.PAN) {
            onDrawEnd();
            dispatchPan(command.point);
        } else if (command.type === HAND_COMMANDS.TOGGLE_TOOL) {
            onDrawEnd();
            onToolToggle();
        } else {
            onDrawEnd();
            previousPanPointRef.current = null;
        }

        previousCommandRef.current = command;
    }, [
        dispatchPan,
        dispatchZoom,
        onDrawEnd,
        onDrawMove,
        onDrawStart,
        onToolToggle,
    ]);

    const stop = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        previousCommandRef.current = { type: HAND_COMMANDS.IDLE };
        previousPanPointRef.current = null;
        previousZoomDistanceRef.current = null;
        commandHistoryRef.current = [];
        onDrawEnd();
        onCursor(null);
        setEnabled(false);
        setStatus('Camera off');
    }, [onCursor, onDrawEnd]);

    const start = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Camera access is not available in this browser.');
            }

            await initializeRecognizer();
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                },
                audio: false,
            });

            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setEnabled(true);
            setStatus('Camera gesture mode on');
        } catch (currentError) {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            setError(currentError.message || 'Camera permission failed.');
            setEnabled(false);
        } finally {
            setIsLoading(false);
        }
    }, [initializeRecognizer]);

    useEffect(() => {
        if (!enabled || !videoRef.current || !recognizerRef.current) return undefined;

        const recognizeFrame = () => {
            const video = videoRef.current;
            const recognizer = recognizerRef.current;

            if (video.readyState >= 2) {
                const result = recognizer.recognizeForVideo(video, performance.now());
                const firstGestureResult = result.gestures?.[0]?.[0];
                const secondGestureResult = result.gestures?.[1]?.[0];
                const firstGesture = firstGestureResult?.score >= MIN_GESTURE_SCORE
                    ? firstGestureResult.categoryName
                    : 'None';
                const secondGesture = secondGestureResult?.score >= MIN_GESTURE_SCORE
                    ? secondGestureResult.categoryName
                    : 'None';
                const firstLandmarks = result.landmarks?.[0];
                const secondLandmarks = result.landmarks?.[1];

                const firstCommand = mapHandGestureToCommand({
                    gestureName: firstGesture,
                    landmarks: firstLandmarks,
                });
                const secondCommand = secondLandmarks
                    ? mapHandGestureToCommand({
                        gestureName: secondGesture,
                        landmarks: secondLandmarks,
                    })
                    : null;
                const stableFirstCommand = getStableCommand(firstCommand);

                onCursor(firstCommand.point || null);
                dispatchCommand(stableFirstCommand, secondCommand);
                setStatus(stableFirstCommand.type);
            }

            animationFrameRef.current = requestAnimationFrame(recognizeFrame);
        };

        animationFrameRef.current = requestAnimationFrame(recognizeFrame);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [dispatchCommand, enabled, getStableCommand, onCursor]);

    useEffect(() => () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        streamRef.current?.getTracks().forEach((track) => track.stop());
        onDrawEnd();
        onCursor(null);
    }, []);

    return {
        videoRef,
        enabled,
        isLoading,
        error,
        status,
        start,
        stop,
    };
};
