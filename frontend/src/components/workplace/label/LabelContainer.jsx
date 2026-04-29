import AddLabelModal from './form/AddLabelModal';
import { useCanvasContext } from '../../../hooks/useCanvasContext';
import { useParams } from 'react-router-dom';
import { useLabelContext } from '../../../hooks/useLabelContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import apiClient from '../../../api/client';
import { ScrollArea } from '../../ui/scroll-area';
import { Button } from '../../ui/button';
import { Trash2, Eye, EyeOff } from 'lucide-react';

const LabelContainer = ({ labels }) => {
    const {
        color,
        handleColorChange,
        annotationToggle,
        handleAnnotationToggle,
    } = useCanvasContext();

    const { id } = useParams();
    const { labelsDispatch } = useLabelContext();
    const { user } = useAuthContext();

    const handleDeleteLabel = async (labelId) => {
        try {
            const res = await apiClient.delete(`/api/boardRoute/${id}/label/${labelId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            labelsDispatch({ type: 'DELETE_LABEL', payload: res.data });
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred.');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-3 flex justify-between items-center border-b bg-muted/30">
                <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Project Labels</span>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAnnotationToggle} title={annotationToggle ? "Hide Annotations" : "Show Annotations"}>
                        {annotationToggle ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <AddLabelModal />
                </div>
            </div>

            <ScrollArea className="flex-grow">
                <div className="p-2 space-y-1">
                    {labels.map((label) => (
                        <div
                            key={label._id}
                            tabIndex="0"
                            role="button"
                            onClick={() => handleColorChange({ target: { value: label.color } })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleColorChange({ target: { value: label.color } });
                                }
                            }}
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors group ${
                                color === label.color ? 'bg-accent text-accent-foreground' : 'hover:bg-muted'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: label.color }} />
                                <span className="text-sm font-medium">{label.title}</span>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); handleDeleteLabel(label._id); }}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default LabelContainer;
