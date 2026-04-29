import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../../../hooks/useAuthContext';
import apiClient from '../../../api/client';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ImagePlus } from 'lucide-react';

const ChangeAvatar = ({ onAvatarChange }) => {
    const { user } = useAuthContext();
    const [image, setImage] = useState('');
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleOpenChange = (open) => {
        setIsModalOpened(open);
        if (!open) {
            setImage('');
        }
    };

    const convertToBase64 = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        const maxFileSize = 20 * 1024 * 1024;
        if (file.size >= maxFileSize) {
            toast.error(
                'File size exceeds 20 MB. Please upload a smaller file.',
            );
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.onerror = () => {
            toast.error('Failed to read file. Please try again.');
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            toast.error('You have not chosen an image yet.');
            return;
        }
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await apiClient.post(
                '/api/userRoute/change-avatar',
                { image },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            toast.success(
                response.data.message || 'Profile image updated successfully.',
            );
            onAvatarChange?.(image);
            handleOpenChange(false);
        } catch (error) {
            toast.error(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    'Failed to update image. Please try again.',
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
                    size="icon-sm"
                    className="rounded-full shadow-sm"
                    aria-label="Change avatar"
                >
                    <Camera className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Change avatar</DialogTitle>
                        <DialogDescription>
                            Upload a new profile image for your account.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3 py-4">
                        <Label htmlFor="avatar-image">Profile image</Label>
                        <Label
                            htmlFor="avatar-image"
                            className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40 text-center text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
                        >
                            {image ? (
                                <Avatar className="size-28">
                                    <AvatarImage
                                        src={image}
                                        alt="New avatar preview"
                                    />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            ) : (
                                <>
                                    <ImagePlus className="size-7" />
                                    <span className="mt-2 text-sm font-medium">
                                        Choose image
                                    </span>
                                    <span className="mt-1 text-xs">
                                        PNG, JPG, or GIF up to 20 MB
                                    </span>
                                </>
                            )}
                        </Label>
                        <Input
                            id="avatar-image"
                            name="avatar-image"
                            type="file"
                            accept="image/*"
                            onChange={convertToBase64}
                            className="hidden"
                        />
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
                            {isSubmitting ? 'Saving...' : 'Save avatar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeAvatar;
