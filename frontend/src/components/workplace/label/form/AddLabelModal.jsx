import { useState } from 'react';
import { useAuthStore } from '../../../../stores/useAuthStore';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLabelStore } from '../../../../stores/useLabelStore';
import apiClient from '../../../../api/client';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Palette, Plus, Tag } from 'lucide-react';

const LABEL_COLORS = [
    '#EF4444',
    '#F97316',
    '#F59E0B',
    '#10B981',
    '#14B8A6',
    '#3B82F6',
    '#6366F1',
    '#8B5CF6',
    '#EC4899',
];

const AddLabelModal = () => {
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [color, setColor] = useState(LABEL_COLORS[0]);

    const clearForm = () => {
        setTitle('');
        setColor(LABEL_COLORS[0]);
    };

    const handleOpenChange = (open) => {
        setIsModalOpened(open);
        if (!open) {
            clearForm();
        }
    };

    // board id
    const { id } = useParams();
    const createLabel = useLabelStore((state) => state.createLabel);
    const user = useAuthStore((state) => state.user);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Please fill title.');
            return;
        }
        if (!color.trim()) {
            toast.error('Please select color.');
            return;
        }
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.post(
                `/api/boardRoute/${id}/label`,
                { title: title.trim(), color },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            createLabel(res.data);
            toast.success('Create label successfully.');
            handleOpenChange(false);
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isModalOpened} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Add label"
                    title="Add label"
                >
                    <Plus className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleAdd}>
                    <DialogHeader className="pr-8">
                        <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Tag className="size-4" />
                        </div>
                        <DialogTitle>Add label</DialogTitle>
                        <DialogDescription>
                            Create a reusable annotation class for this project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="label-title">
                                Label name
                                <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="label-title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Tumor boundary"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="label-color">
                                Color
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="label-color"
                                    name="color"
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="h-9 w-12 shrink-0 cursor-pointer p-1"
                                    aria-label="Custom label color"
                                />
                                <Input
                                    value={color.toUpperCase()}
                                    onChange={(e) => setColor(e.target.value)}
                                    aria-label="Label color hex value"
                                />
                                <Palette className="size-4 shrink-0 text-muted-foreground" />
                            </div>
                            <div
                                className="flex flex-wrap gap-2 pt-1"
                                aria-label="Suggested label colors"
                            >
                                {LABEL_COLORS.map((labelColor) => (
                                    <Button
                                        key={labelColor}
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        className="rounded-full p-0"
                                        style={{ backgroundColor: labelColor }}
                                        aria-label={`Use color ${labelColor}`}
                                        onClick={() => setColor(labelColor)}
                                    >
                                        {color.toUpperCase() === labelColor && (
                                            <Check className="size-3 text-white drop-shadow" />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Adding...' : 'Add label'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddLabelModal;
