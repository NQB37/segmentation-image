import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import useFetch from '../../hooks/useFetch';
import Loading from './Loading';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Inbox, X } from 'lucide-react';

const Notification = () => {
    const user = useAuthStore((state) => state.user);
    const [pendingInviteId, setPendingInviteId] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const { data, isLoading, error } = useFetch('/api/inviteRoute', {
        headers: { Authorization: `Bearer ${user?.token}` },
    });

    useEffect(() => {
        if (data) {
            setNotifications(data);
        }
    }, [data]);

    const fetchErrorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load notifications.';

    const handleRespond = async (_id, status) => {
        if (pendingInviteId) {
            return;
        }
        setPendingInviteId(_id);
        try {
            await apiClient.post(
                `/api/inviteRoute/invite/${_id}`,
                { inviteId: _id, status },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );
            setNotifications((prev) => prev.filter((n) => n._id !== _id));
        } catch (error) {
            toast.error(
                error.response?.data?.error || 'An error occurred (FE).',
            );
        } finally {
            setPendingInviteId(null);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon-lg"
                    className="relative rounded-full"
                    aria-label="Open notifications"
                >
                    <Bell className="size-5" />
                    {notifications.length > 0 ? (
                        <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[0.7rem]">
                            {notifications.length}
                        </Badge>
                    ) : null}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(22rem,92vw)] p-0">
                <div className="flex items-center justify-between px-4 py-3">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold text-foreground">
                        Notifications
                    </DropdownMenuLabel>
                    {notifications.length > 0 ? (
                        <Badge variant="secondary">
                            {notifications.length} pending
                        </Badge>
                    ) : null}
                </div>
                <DropdownMenuSeparator className="m-0" />

                {isLoading ? (
                    <div className="flex h-36 items-center justify-center">
                        <Loading />
                    </div>
                ) : error ? (
                    <div className="px-4 py-6 text-sm text-destructive">
                        {fetchErrorMessage}
                    </div>
                ) : notifications.length > 0 ? (
                    <ScrollArea className="max-h-96">
                        <div className="grid gap-1 p-2">
                            {notifications.map((notification) => {
                                const isPending =
                                    pendingInviteId === notification._id;
                                const title =
                                    notification.boardId?.title || 'Untitled';
                                const image = notification.boardId?.image;

                                return (
                                    <div
                                        key={notification._id}
                                        className="rounded-lg border bg-card p-3 text-card-foreground"
                                    >
                                        <div className="flex gap-3">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={title}
                                                    className="size-14 rounded-md object-cover ring-1 ring-border"
                                                />
                                            ) : (
                                                <div className="flex size-14 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                                    <Inbox className="size-5" />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium">
                                                    Project invite
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    You were invited to join{' '}
                                                    <span className="font-medium text-foreground">
                                                        {title}
                                                    </span>
                                                    .
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={!!pendingInviteId}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRespond(
                                                        notification._id,
                                                        'Cancel',
                                                    );
                                                }}
                                            >
                                                <X className="size-3.5" />
                                                Decline
                                            </Button>
                                            <Button
                                                size="sm"
                                                disabled={!!pendingInviteId}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRespond(
                                                        notification._id,
                                                        'Accept',
                                                    );
                                                }}
                                            >
                                                <Check className="size-3.5" />
                                                {isPending
                                                    ? 'Saving...'
                                                    : 'Accept'}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                            <Inbox className="size-5" />
                        </div>
                        <p className="mt-3 text-sm font-medium">
                            No notifications
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Board invites will appear here.
                        </p>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Notification;
