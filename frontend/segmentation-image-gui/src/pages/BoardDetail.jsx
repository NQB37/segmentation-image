import LabelContainer from '../components/workplace/label/LabelContainer';
import { useCanvasContext } from '../hooks/useCanvasContext';
import ToolboxContainer from '../components/workplace/toolbox/ToolboxContainer';
import CanvasContainer from '../components/workplace/canvas/CanvasContainer';
import SegmentContainer from '../components/workplace/segmentation/SegmentContainer';
import Header from '../components/Share/Header';

const WorkplacePage = () => {
    const { color, handleColorChange } = useCanvasContext();

    return (
        <div>
            <Header />
            <div className="flex flex-col h-screen">
                {/* tool box */}
                <ToolboxContainer />
                <div className="flex grow">
                    {/* canvas field */}
                    <CanvasContainer />
                    {/* label/user field */}
                    <div className="w-1/6 border-l border-black">
                        {/* label */}
                        <div className="h-1/3">
                            <LabelContainer
                                color={color}
                                onChange={handleColorChange}
                            />
                        </div>
                        {/* segmentation */}
                        <div className="h-1/3">
                            <SegmentContainer />
                        </div>
                        {/* user */}
                        <div className="h-1/3"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkplacePage;
