import LabelContainer from '../components/workplace/label/LabelContainer';
import { useCanvasContext } from '../hooks/useCanvasContext';
import ToolboxContainer from '../components/workplace/toolbox/ToolboxContainer';
import CanvasContainer from '../components/workplace/canvas/CanvasContainer';

const WorkplacePage = () => {
    const { color, handleColorChange } = useCanvasContext();

    return (
        <div>
            <div className="flex flex-col h-screen">
                {/* tool box */}
                <ToolboxContainer />
                <div className="flex grow">
                    {/* canvas field */}
                    <CanvasContainer />
                    {/* label/user field */}
                    <div className="w-1/6 border-l border-black">
                        {/* label */}
                        <div className="h-1/2">
                            <LabelContainer
                                color={color}
                                onChange={handleColorChange}
                            />
                        </div>
                        {/* user */}
                        <div className="h-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkplacePage;
