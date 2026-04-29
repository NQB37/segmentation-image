import { useState } from 'react';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLabelContext } from '../../../../hooks/useLabelContext';
import apiClient from '../../../../api/client';
import { Plus, Tag } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const PRESET_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const AddLabelModal = () => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('#3b82f6'); // Default color

    const clearForm = () => {
        setTitle('');
        setColor('#3b82f6');
    };

    const { id } = useParams();
    const { labelsDispatch } = useLabelContext();
    const { user } = useAuthContext();

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title) {
            toast.error('Please fill title.');
            return;
        }
        if (!color) {
            toast.error('Please select color.');
            return;
        }
        try {
            const res = await apiClient.post(
                `/api/boardRoute/${id}/label`,
                { title, color },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            labelsDispatch({ type: 'CREATE_LABEL', payload: res.data });
            toast.success('Label created successfully');
            clearForm();
            setOpen(false);
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button 
                    className="flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
                    title="Add Label"
                >
                    <Plus className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Tag className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle className="text-xl">Add New Label</DialogTitle>
                    </div>
                    <DialogDescription>
                        Create a new label to organize your board. Labels help categorize items and make them easier to find.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAdd} className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="text-sm font-semibold">
                            Label Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="e.g., Critical, Feature, Bug"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-10"
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label className="text-sm font-semibold">Color Selection</Label>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                                        color === preset ? 'border-primary scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: preset }}
                                    onClick={() => setColor(preset)}
                                    title={preset}
                                    aria-label={`Select color ${preset}`}
                                />
                            ))}
                            <div className="relative h-8 w-8">
                                <Input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                    title="Custom color"
                                />
                                <div 
                                    className={`h-full w-full rounded-full border-2 flex items-center justify-center bg-muted transition-all ${
                                        !PRESET_COLORS.includes(color) ? 'border-primary scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: !PRESET_COLORS.includes(color) ? color : undefined }}
                                >
                                    {!PRESET_COLORS.includes(color) ? null : <Plus className="h-4 w-4 text-muted-foreground" />}
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Create Label
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLabelModal;
