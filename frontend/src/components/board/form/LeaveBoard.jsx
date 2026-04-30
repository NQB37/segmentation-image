import { useState } from 'react';
import { toast } from 'react-toastify';
import { useBoardStore } from '../../../stores/useBoardStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import apiClient from '../../../api/client';
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
import { DoorOpen } from 'lucide-react';

const LeaveBoard = ({ _id }) => {
    const deleteBoard = useBoardStore((state) => state.deleteBoard);
    const user = useAuthStore((state) => state.user);
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Must be logged in');
            return;
        }
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.delete(`/api/boardRoute/${_id}/leave`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            deleteBoard(res.data);
            toast.success('Left project successfully.');
            setIsModalOpened(false);
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
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
                    aria-label="Leave project"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DoorOpen className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Leave project</DialogTitle>
                        <DialogDescription>
                            You will lose access to this project. The owner can
                            invite you again later.
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
                            {isSubmitting ? 'Leaving...' : 'Leave'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveBoard;
