import { useEffect, useState } from 'react';
import Header from '../components/Share/Header';
import ChangePassword from '../components/profile/form/ChangePassword';
import ChangeAvatar from '../components/profile/form/ChangeAvatar';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';
import apiClient from '../api/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Save, ShieldCheck, UserRound } from 'lucide-react';

const getInitials = (name, email) => {
    const source = name || email || 'User';
    return source
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
};

const ProfilePage = () => {
    const { user } = useAuthContext();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [isSavingName, setIsSavingName] = useState(false);

    useEffect(() => {
        if (!user?.token) {
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await apiClient.get('/api/userRoute/profile', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                });
                setEmail(res.data.email || '');
                setName(res.data.name || '');
                setAvatar(res.data.avatar || '');
            } catch (error) {
                toast.error(error.response?.data?.error || 'An error occurred');
            }
        };

        fetchUserData();
    }, [user]);

    const handleChangeName = async (e) => {
        e.preventDefault();
        if (!name) {
            toast.error('Please fill in all the required fields.');
            return;
        }
        if (isSavingName) {
            return;
        }

        setIsSavingName(true);
        try {
            await apiClient.patch(
                '/api/userRoute/change-info',
                { name },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            toast.success('Change name successfully.');
        } catch (error) {
            toast.error(error.response?.data?.error || 'An error occurred');
        } finally {
            setIsSavingName(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="container mx-auto flex w-full flex-col gap-6 px-4 py-6 lg:px-8">
                <section>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Profile settings
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your account identity and sign-in security.
                    </p>
                </section>

                <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <div className="relative">
                                <Avatar className="size-28">
                                    {avatar ? (
                                        <AvatarImage
                                            src={avatar}
                                            alt={name || email || 'User'}
                                        />
                                    ) : null}
                                    <AvatarFallback className="text-2xl">
                                        {getInitials(name, email)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-2 -right-2">
                                    <ChangeAvatar onAvatarChange={setAvatar} />
                                </div>
                            </div>
                            <div>
                                <CardTitle>{name || 'CellSeg user'}</CardTitle>
                                <CardDescription>{email}</CardDescription>
                            </div>
                            <Badge variant="secondary" className="gap-1">
                                <ShieldCheck className="size-3" />
                                Active account
                            </Badge>
                        </CardHeader>
                    </Card>

                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <UserRound className="size-5 text-muted-foreground" />
                                    <div>
                                        <CardTitle>Account information</CardTitle>
                                        <CardDescription>
                                            Update your display name and review
                                            your login email.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form
                                    className="grid gap-4"
                                    onSubmit={handleChangeName}
                                >
                                    <div className="grid gap-2">
                                        <Label htmlFor="displayName">
                                            Display name
                                        </Label>
                                        <Input
                                            id="displayName"
                                            name="displayName"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                name="email"
                                                value={email}
                                                readOnly
                                                className="pl-8"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isSavingName}
                                        >
                                            <Save className="size-4" />
                                            {isSavingName
                                                ? 'Saving...'
                                                : 'Save changes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="size-5 text-muted-foreground" />
                                    <div>
                                        <CardTitle>Security</CardTitle>
                                        <CardDescription>
                                            Change your password periodically to
                                            keep your workspace protected.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Password changes apply immediately to your
                                    account.
                                </p>
                                <ChangePassword />
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
