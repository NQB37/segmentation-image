import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../hooks/useAuthContext';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';

const ChangePassword = () => {
    const { user } = useAuthContext();
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const clearForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleOpenChange = (open) => {
        setIsModalOpened(open);
        if (!open) {
            clearForm();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all the required fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Password is not match.');
            return;
        }
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.patch(
                '/api/userRoute/change-password',
                { currentPassword, newPassword, confirmPassword },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            toast.success('Change password successfully.');
            handleOpenChange(false);
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isModalOpened} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <KeyRound className="size-4" />
                    Change password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Change password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new strong
                            password.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="currentPassword">
                                Current password
                            </Label>
                            <Input
                                type="password"
                                name="currentPassword"
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">New password</Label>
                            <Input
                                type="password"
                                name="newPassword"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">
                                Confirm password
                            </Label>
                            <Input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
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
                            {isSubmitting ? 'Saving...' : 'Save password'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangePassword;
