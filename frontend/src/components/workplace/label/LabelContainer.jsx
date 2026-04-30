import AddLabelModal from './form/AddLabelModal';
import { useCanvasContext } from '../../../hooks/useCanvasContext';
import { useParams } from 'react-router-dom';
import { useLabelStore } from '../../../stores/useLabelStore';
import { useAuthStore } from '../../../stores/useAuthStore';
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
    const deleteLabel = useLabelStore((state) => state.deleteLabel);
    const user = useAuthStore((state) => state.user);

    const handleDeleteLabel = async (labelId) => {
        try {
            const res = await apiClient.delete(`/api/boardRoute/${id}/label/${labelId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            deleteLabel(res.data);
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
                            onClick={() => handleColorChange(label.color)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    handleColorChange(label.color);
                                }
                            }}
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all group border-2 ${
                                color === label.color 
                                ? 'bg-accent border-primary/50 text-accent-foreground shadow-sm scale-[1.02]' 
                                : 'hover:bg-muted border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className={`w-4 h-4 rounded-full border shadow-inner transition-transform ${color === label.color ? 'scale-110' : ''}`} 
                                    style={{ backgroundColor: label.color, borderColor: 'rgba(0,0,0,0.1)' }} 
                                />
                                <span className={`text-sm ${color === label.color ? 'font-bold' : 'font-medium'}`}>
                                    {label.title}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                {color === label.color && (
                                    <span className="text-[10px] font-bold uppercase text-primary px-1.5 py-0.5 bg-primary/10 rounded mr-1">Active</span>
                                )}
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => { e.stopPropagation(); handleDeleteLabel(label._id); }}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default LabelContainer;
