import { useState } from 'react';
import BtnSegment from './BtnSegment';
import BtnVisible from '../BtnVisible';

const SegmentContainer = () => {
    return (
        <div>
            <div className="px-4 py-2 flex justify-between border-y border-black">
                <div className="font-bold">Segmentation</div>
                <div className="space-x-4">
                    <BtnVisible onClick={() => {}} />
                    <BtnSegment />
                </div>
            </div>
        </div>
    );
};

export default SegmentContainer;
