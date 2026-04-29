import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import useFetch from '../../hooks/useFetch';
import Loading from './Loading';
import BtnGreen from './BtnGreen';
import BtnGray from './BtnGray';
import { toast } from 'react-toastify';
import apiClient from '../../api/client';

const Notification = () => {
    const { user } = useAuthContext();
    const [isOpen, setIsOpen] = useState(false);
    const [pendingInviteId, setPendingInviteId] = useState(null);

    const { data, isLoading, error } = useFetch(
        '/api/inviteRoute',
        {
            headers: { Authorization: `Bearer ${user?.token}` },
        },
    );

    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        if (data) {
            setNotifications(data);
        }
        console.log('Finish loading board');
    }, [data]);

    const fetchErrorMessage =
        error?.response?.data?.error ||
        error?.message ||
        'Failed to load notifications.';

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

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
        <div className="relative">
            {/* dropdown button  */}
            <button onClick={toggleDropdown} className="cursor-pointe">
                <i className="fa-solid fa-bell text-2xl"></i>
                {notifications.length !== 0 && (
                    <>
                        <div className="absolute -right-1 bottom-0 size-4 bg-red-500 rounded-full flex items-center justify-center">
                            <p className="text-sm">{notifications.length}</p>
                        </div>
                    </>
                )}
            </button>
            {/* dropdown menu  */}
            {isOpen && (
                <div
                    className={`min-w-[400px] py-2 px-4 absolute right-0 top-full mt-1 rounded flex flex-col border border-black bg-white`}
                >
                    {isLoading ? (
                        <Loading />
                    ) : error ? (
                        <div className="flex items-center justify-center text-nowrap">
                            <p>{fetchErrorMessage}</p>
                        </div>
                    ) : (
                        <div>
                            {notifications.length !== 0 ? (
                                <div className="flex overflow-y-scroll">
                                    {notifications.map((notification) => {
                                        return (
                                            <div
                                                key={notification._id}
                                                className="py-2 w-full flex justify-between gap-2 border-b border-black"
                                            >
                                                <div className="w-full flex flex-col justify-between">
                                                    <p>
                                                        You was invited to join
                                                        project{' '}
                                                        {
                                                            notification.boardId
                                                                .title
                                                        }
                                                    </p>
                                                    <div className="flex gap-2 justify-end">
                                                        <BtnGreen
                                                            text="Accept"
                                                            width={'w-fit'}
                                                            disabled={
                                                                !!pendingInviteId
                                                            }
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRespond(
                                                                    notification._id,
                                                                    'Accept',
                                                                );
                                                            }}
                                                        />
                                                        <BtnGray
                                                            text="Cancel"
                                                            width={'w-fit'}
                                                            disabled={
                                                                !!pendingInviteId
                                                            }
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRespond(
                                                                    notification._id,
                                                                    'Cancel',
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <img
                                                    src={
                                                        notification.boardId
                                                            .image
                                                    }
                                                    alt={
                                                        notification.boardId
                                                            .title
                                                    }
                                                    className="size-20 object-cover"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center text-nowrap">
                                    <p>There is no notifications.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
