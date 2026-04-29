import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Info } from 'lucide-react';
import { useAuthContext } from '../../../../hooks/useAuthContext';
import apiClient from '../../../../api/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";

const AddMemberModal = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clearForm = () => {
        setEmail('');
    };

    // get board id
    const { id } = useParams();
    const { user } = useAuthContext();

    const handleInvite = async () => {
        if (!email) {
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
                { toEmail: email, boardId: id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            clearForm();
            setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="h-6 w-6 rounded-md hover:bg-primary/10 hover:text-primary">
                    <UserPlus className="h-3.5 w-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md border-none shadow-2xl">
                <DialogHeader className="flex flex-row items-center gap-4 space-y-0 pb-4 border-b">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <DialogTitle className="text-xl font-bold tracking-tight">Invite Collaborator</DialogTitle>
                        <DialogDescription className="text-sm">
                            Share this project with your team.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    <div className="grid gap-2.5">
                        <Label htmlFor="email" className="text-sm font-semibold text-foreground/80 ml-1">
                            Email address
                        </Label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary z-10">
                                <Mail className="h-4 w-4" />
                            </div>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@example.com"
                                className="pl-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl bg-blue-50/50 p-4 border border-blue-100 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/30 dark:text-blue-200">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                            <Info className="h-3.5 w-3.5" />
                        </div>
                        <div className="text-sm leading-relaxed">
                            <p className="font-semibold">Member Permissions</p>
                            <p className="mt-1 text-blue-800/80 dark:text-blue-300/80">
                                Invited members will have full access to view and edit this workspace. They'll receive an invitation link via email.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex items-center sm:justify-between gap-3 pt-2">
                    <Button variant="ghost" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleInvite} 
                        disabled={isSubmitting}
                        className="px-6 font-semibold shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98]"
                    >
                        {isSubmitting ? "Sending..." : "Send Invitation"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddMemberModal;
