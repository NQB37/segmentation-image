import { useEffect, useState } from 'react';
import { useLogout } from '../../hooks/useLogout';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, UserRound } from 'lucide-react';

const getInitials = (name, email) => {
    const source = name || email || 'User';
    return source
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('');
};

const DropdownProfile = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const [profile, setProfile] = useState({
        avatar: '',
        email: user?.email || '',
        name: '',
    });

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
                setProfile({
                    avatar: res.data.avatar || '',
                    email: res.data.email || user.email || '',
                    name: res.data.name || '',
                });
            } catch (error) {
                toast.error(error.response?.data?.error || 'An error occurred');
            }
        };

        fetchUserData();
    }, [user]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-lg"
                    className="rounded-full"
                    aria-label="Open profile menu"
                >
                    <Avatar size="lg">
                        {profile.avatar ? (
                            <AvatarImage
                                src={profile.avatar}
                                alt={profile.name || profile.email || 'User'}
                            />
                        ) : null}
                        <AvatarFallback>
                            {getInitials(profile.name, profile.email)}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="px-2 py-2">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            {profile.avatar ? (
                                <AvatarImage
                                    src={profile.avatar}
                                    alt={
                                        profile.name || profile.email || 'User'
                                    }
                                />
                            ) : null}
                            <AvatarFallback>
                                {getInitials(profile.name, profile.email)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                                {profile.name || 'CellSeg user'}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                                {profile.email || user?.email}
                            </p>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to="/profile">
                        <UserRound className="size-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={logout}>
                    <LogOut className="size-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DropdownProfile;
