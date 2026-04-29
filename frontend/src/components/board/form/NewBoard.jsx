import { useState } from 'react';
import { toast } from 'react-toastify';
import { useBoardContext } from '../../../hooks/useBoardContext';
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
import { ImagePlus, Plus } from 'lucide-react';

const NewBoard = () => {
    const { dispatch } = useBoardContext();
    const { user } = useAuthContext();
    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');

    const clearForm = () => {
        setTitle('');
        setImage('');
    };

    const handleOpenChange = (open) => {
        setIsModalOpened(open);
        if (!open) {
            clearForm();
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
            toast.error('Failed to read image. Please try again.');
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Must be logged in');
            return;
        }
        if (!title || !image) {
            toast.error('Please fill in all required fields (FE).');
            return;
        }
        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await apiClient.post(
                '/api/boardRoute',
                { title, image },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            dispatch({ type: 'CREATE_BOARD', payload: res.data });
            toast.success('Create new project successfully.');
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
                <Button>
                    <Plus data-icon="inline-start" className="size-4" />
                    New project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>New project</DialogTitle>
                        <DialogDescription>
                            Upload a source image to start annotation.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                Title <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Retina vessel study"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="image">
                                Image <span className="text-destructive">*</span>
                            </Label>
                            <Label
                                htmlFor="image"
                                className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40 text-center text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5"
                            >
                                {image ? (
                                    <img
                                        src={image}
                                        alt="Selected project preview"
                                        className="size-full rounded-lg object-contain p-2"
                                    />
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
                                id="image"
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={convertToBase64}
                                className="hidden"
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
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewBoard;
