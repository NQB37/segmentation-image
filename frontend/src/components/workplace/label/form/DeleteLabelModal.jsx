import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../../stores/useAuthStore';
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
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteLabelModal = ({ label }) => {
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const deleteLabel = useLabelStore((state) => state.deleteLabel);
    const user = useAuthStore((state) => state.user);

    const handleDeleteLabel = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.delete(
                `/api/boardRoute/${id}/label/${label._id}`,
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                },
            );
            deleteLabel(res.data);
            toast.success('Delete label successfully.');
            setIsModalOpened(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isModalOpened} onOpenChange={setIsModalOpened}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label={`Delete ${label.title}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Trash2 className="size-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleDeleteLabel}>
                    <DialogHeader className="pr-8">
                        <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-4" />
                        </div>
                        <DialogTitle>Delete label</DialogTitle>
                        <DialogDescription>
                            Remove{' '}
                            <span className="font-medium text-foreground">
                                {label.title}
                            </span>{' '}
                            from this project. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsModalOpened(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteLabelModal;
