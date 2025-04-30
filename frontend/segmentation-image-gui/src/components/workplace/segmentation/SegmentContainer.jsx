import { useState } from 'react';
import BtnSegment from './BtnSegment';
import BtnVisible from '../BtnVisible';
import { useCanvasContext } from '../../../hooks/useCanvasContext';

const SegmentContainer = () => {
    const { handleSegment } = useCanvasContext();
    return (
        <div>
            <div className="px-4 py-2 flex justify-between border-y border-black">
                <div className="font-bold">Segmentation</div>
                <div className="flex gap-3">
                    <BtnVisible />
                    <BtnSegment onClick={handleSegment} />
                </div>
            </div>
        </div>
    );
};

export default SegmentContainer;
