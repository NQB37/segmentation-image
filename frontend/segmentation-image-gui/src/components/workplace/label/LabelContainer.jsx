import AddLabelModal from './AddLabelModal';
import { useCanvasContext } from '../../../hooks/useCanvasContext';
import BtnVisible from '../BtnVisible';

const LabelContainer = ({ color, onChange }) => {
    const { labels, handleAddLabel } = useCanvasContext();
    return (
        <div>
            <div className="px-4 py-2 flex justify-between border-b border-black ">
                <div className="font-bold">Label</div>
                <div className="flex gap-3">
                    <BtnVisible onClick={() => {}} />
                    <AddLabelModal handleAddLabel={handleAddLabel} />
                </div>
            </div>

            <div className="p-2 overflow-y-scroll hide-scrollbar space-y-2">
                {labels.map((label) => {
                    return (
                        <label
                            key={label.id}
                            htmlFor={label.text}
                            className={`px-2 flex justify-between items-center ${
                                color === label.color
                                    ? 'bg-blue-200'
                                    : 'bg-transparent'
                            }`}
                        >
                            <input
                                type="checkbox"
                                name={label.text}
                                id={label.text}
                                onChange={onChange}
                                value={label.color}
                                checked={color === label.color}
                                className="hidden"
                            />
                            <p>{label.text}</p>
                            <div
                                className={`size-4 border border-black`}
                                style={{ backgroundColor: label.color }}
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default LabelContainer;
