import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../../../api/client';
import { useAuthStore } from '../../../../stores/useAuthStore';
import { useMemberStore } from '../../../../stores/useMemberStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const DeleteMemberModal = ({ member }) => {
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { id } = useParams();
    const deleteMember = useMemberStore((state) => state.deleteMember);
    const user = useAuthStore((state) => state.user);
    const memberName = member?.name || 'this member';
    const fallbackInitial = member?.name?.[0]?.toUpperCase() || '?';

    const handleDeleteMember = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isSubmitting || !member?._id) {
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.delete(
                `/api/boardRoute/${id}/member/${member._id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            deleteMember(res.data);
            toast.success('Member removed successfully.');
            setIsModalOpened(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred (FE).');
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
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100"
                    aria-label={`Remove ${memberName}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Trash2 className="size-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleDeleteMember}>
                    <DialogHeader className="pr-8">
                        <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                            <AlertTriangle className="size-4" />
                        </div>
                        <DialogTitle>Remove member</DialogTitle>
                        <DialogDescription>
                            This member will lose access to this board and its
                            project files.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="my-4 flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
                        <Avatar className="size-10">
                            <AvatarImage src={member?.avatar} alt={memberName} />
                            <AvatarFallback>{fallbackInitial}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                                {memberName}
                            </p>
                            {member?.email && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {member.email}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
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
                            {isSubmitting ? 'Removing...' : 'Remove member'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteMemberModal;
