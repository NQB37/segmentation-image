import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../../stores/useAuthStore';
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
import { Mail, Plus, UserPlus } from 'lucide-react';

const AddMemberModal = () => {
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clearForm = () => {
        setEmail('');
    };
    const handleOpenChange = (open) => {
        setIsModalOpened(open);
        if (!open) {
            clearForm();
        }
    };

    // get board id
    const { id } = useParams();
    const user = useAuthStore((state) => state.user);

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error('Please fill email.');
            return;
        }
        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);
        try {
            await apiClient.post(
                '/api/inviteRoute/invite',
                { toEmail: email.trim(), boardId: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            handleOpenChange(false);
            toast.success('Send invite successfully.');
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
                    aria-label="Invite member"
                    title="Invite member"
                >
                    <Plus className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleInvite}>
                    <DialogHeader className="pr-8">
                        <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <UserPlus className="size-4" />
                        </div>
                        <DialogTitle>Invite member</DialogTitle>
                        <DialogDescription>
                            Send an email invitation to collaborate on this
                            project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="member-email">
                                Email address
                                <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="member-email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-8"
                                    placeholder="teammate@example.com"
                                />
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
                            {isSubmitting ? 'Sending...' : 'Send invite'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemberModal;
