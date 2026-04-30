import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
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
import { Bell, Check, Inbox, Trash2, X } from 'lucide-react';
import { useNotificationStore } from '@/stores/useNotificationStore';

const Notification = () => {
  const user = useAuthStore((state) => state.user);
  const [pendingInviteId, setPendingInviteId] = useState(null);
  const deleteNotification = useNotificationStore(
    (state) => state.deleteNotification,
  );
  const error = useNotificationStore((state) => state.error);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const refreshNotifications = useNotificationStore(
    (state) => state.refreshNotifications,
  );
  const connectSocket = useNotificationStore((state) => state.connectSocket);
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount());

  useEffect(() => {
    if (!user?.token) {
      clearNotifications();
      return;
    }

    refreshNotifications(user.token);
    connectSocket(user.token);

    return () => {
      clearNotifications();
    };
  }, [clearNotifications, connectSocket, refreshNotifications, user?.token]);

  const fetchErrorMessage =
    error?.response?.data?.error ||
    error?.message ||
    'Failed to load notifications.';

  const handleRespond = async (notification, status) => {
    const inviteId = notification.inviteId?._id || notification.inviteId;
    if (pendingInviteId || !inviteId) {
      return;
    }

    setPendingInviteId(notification._id);
    try {
      await apiClient.post(
        `/api/inviteRoute/invite/${inviteId}`,
        { inviteId, status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      await markAsRead(notification._id, user.token);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred (FE).');
    } finally {
      setPendingInviteId(null);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId, user.token);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred (FE).');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(user.token);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred (FE).');
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId, user.token);
    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred (FE).');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon-lg'
          className='relative rounded-full'
          aria-label='Open notifications'
        >
          <Bell className='size-5' />
          {unreadCount > 0 ? (
            <Badge className='absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-[0.7rem]'>
              {unreadCount}
            </Badge>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[min(22rem,92vw)] p-0'>
        <div className='flex items-center justify-between px-4 py-3'>
          <DropdownMenuLabel className='p-0 text-sm font-semibold text-foreground'>
            Notifications
          </DropdownMenuLabel>
          {unreadCount > 0 ? (
            <Button size='sm' variant='ghost' onClick={handleMarkAllAsRead}>
              Mark all read
            </Button>
          ) : null}
        </div>
        <DropdownMenuSeparator className='m-0' />

        {isLoading ? (
          <div className='flex h-36 items-center justify-center'>
            <Loading />
          </div>
        ) : error ? (
          <div className='px-4 py-6 text-sm text-destructive'>
            {fetchErrorMessage}
          </div>
        ) : notifications.length > 0 ? (
          <ScrollArea className='max-h-96'>
            <div className='grid gap-1 p-2'>
              {notifications.map((notification) => {
                const isPending = pendingInviteId === notification._id;
                const isUnread = !notification.readAt;
                const isInvite =
                  notification.type === 'invite.created' &&
                  notification.inviteId;
                const title = notification.title || 'Notification';
                const boardTitle = notification.boardId?.title;
                const message =
                  notification.message ||
                  (boardTitle ? `Update for ${boardTitle}.` : '');
                const image = notification.boardId?.image;

                return (
                  <div
                    key={notification._id}
                    className='rounded-lg border bg-card p-3 text-card-foreground'
                  >
                    <div className='flex gap-3'>
                      {image ? (
                        <img
                          src={image}
                          alt={boardTitle || title}
                          className='size-14 rounded-md object-cover ring-1 ring-border'
                        />
                      ) : (
                        <div className='flex size-14 items-center justify-center rounded-md bg-muted text-muted-foreground'>
                          <Inbox className='size-5' />
                        </div>
                      )}
                      <div className='min-w-0 flex-1'>
                        <div className='flex items-start justify-between gap-2'>
                          <p className='text-sm font-medium'>{title}</p>
                          {isUnread ? (
                            <span className='mt-1 size-2 shrink-0 rounded-full bg-primary' />
                          ) : null}
                        </div>
                        <p className='mt-1 text-sm text-muted-foreground'>
                          {message}
                        </p>
                        {boardTitle ? (
                          <p className='mt-1 truncate text-xs text-muted-foreground'>
                            {boardTitle}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    {isInvite ? (
                      <div className='mt-3 flex justify-end gap-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          disabled={!!pendingInviteId}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRespond(notification, 'Cancel');
                          }}
                        >
                          <X className='size-3.5' />
                          Decline
                        </Button>
                        <Button
                          size='sm'
                          disabled={!!pendingInviteId}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRespond(notification, 'Accept');
                          }}
                        >
                          <Check className='size-3.5' />
                          {isPending ? 'Saving...' : 'Accept'}
                        </Button>
                      </div>
                    ) : (
                      <div className='mt-3 flex justify-end gap-1'>
                        {isUnread ? (
                          <Button
                            size='icon-sm'
                            variant='ghost'
                            aria-label='Mark notification read'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification._id);
                            }}
                          >
                            <Check className='size-3.5' />
                          </Button>
                        ) : null}
                        <Button
                          size='icon-sm'
                          variant='ghost'
                          aria-label='Delete notification'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification._id);
                          }}
                        >
                          <Trash2 className='size-3.5' />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className='flex flex-col items-center justify-center px-4 py-8 text-center'>
            <div className='flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground'>
              <Inbox className='size-5' />
            </div>
            <p className='mt-3 text-sm font-medium'>No notifications</p>
            <p className='mt-1 text-xs text-muted-foreground'>
              Board updates and invites will appear here.
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
