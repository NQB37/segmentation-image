import { useState } from 'react';
import AddLabelModal from './AddLabelModal';

const LabelContainer = ({ color, onChange }) => {
    const [labels, setLabels] = useState([
        { id: '1', text: 'Foreground', color: '#ff0000' },
        { id: '2', text: 'Background', color: '#0000ff' },
    ]);
    const handleAddLabel = (id, title, color) => {
        setLabels((prev) => [...prev, { id: id, text: title, color: color }]);
        console.log(labels);
    };
    return (
        <div>
            <div className="px-4 py-2 flex justify-between">
                <div className="font-bold">Label</div>
                <AddLabelModal handleAddLabel={handleAddLabel} />
            </div>

            <div className="p-2 overflow-y-scroll border-t border-black hide-scrollbar space-y-2">
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
