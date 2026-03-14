import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Package, CheckCheck, Wallet, Users, Info, BellOff } from 'lucide-react';

interface NotificationBellProps {
    baseURL: string;
    token: string;
}

interface NotificationItem {
    id: number | string;
    read_at: string | null;
    created_at: string;
    data: {
        title: string;
        message: string;
    };
}

const NotificationBell = ({ baseURL, token }: NotificationBellProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 1. Fetch FULL notifications
    const fetchFullNotifications = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${baseURL}/api/notifications`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.status) {
                setNotifications(data.notifications);
                
                // Explicitly calculate unread count on the frontend
                const actualUnread = data.notifications.filter(
                    (notif: NotificationItem) => notif.read_at === null
                ).length;
                setUnreadCount(actualUnread);
            }
        } catch (error) {
            console.error("Failed to fetch full notifications:", error);
        }
    }, [baseURL, token]);

    // 2. Poll ONLY for the unread count every 5 seconds
    const pollUnreadCount = useCallback(async () => {
        if (!token) return;
        try {
            const response = await fetch(`${baseURL}/api/notifications/unread`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            if (data.status) {
                setUnreadCount(prevCount => {
                    if (data.unread_count > prevCount) {
                        fetchFullNotifications();
                    }
                    return data.unread_count; 
                });
            }
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
        }
    }, [baseURL, token, fetchFullNotifications]);

    // Initial Load
    useEffect(() => {
        fetchFullNotifications();
    }, [fetchFullNotifications]);

    // 5-Second Interval Polling
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isOpen) {
                pollUnreadCount();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [pollUnreadCount, isOpen]);

    // --- OPTIMISTIC UPDATES ---

    // Mark single notification as read
    const markAsRead = async (id: number | string, isUnread: boolean) => {
        if (!isUnread) return;

        // 1. Optimistic UI update
        setNotifications(prev => 
            prev.map(notif => notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        // 2. Background API call (FIXED: Now uses POST)
        try {
            await fetch(`${baseURL}/api/notifications/read`, {
                method: 'POST', 
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id }) // Sending ID in the body for POST
            });
        } catch (error) {
            console.error("Failed to mark as read:", error);
            fetchFullNotifications(); // Revert UI if network fails
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        if (unreadCount === 0) return;

        // 1. Optimistic UI update
        setNotifications(prev => prev.map(notif => ({ ...notif, read_at: new Date().toISOString() })));
        setUnreadCount(0);

        // 2. Background API call (FIXED: Now uses POST)
        try {
            await fetch(`${baseURL}/api/notifications/read-all`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Failed to mark all as read:", error);
            fetchFullNotifications(); // Revert UI if network fails
        }
    };

    // --- UI HELPERS ---

    const getIcon = (title: string, isUnread: boolean) => {
        const baseClasses = `w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110 ${isUnread ? 'opacity-100' : 'opacity-70'}`;
        if (title.includes('Order')) return <Package className={`${baseClasses} text-blue-500`} />;
        if (title.includes('Transaction')) return <Wallet className={`${baseClasses} text-emerald-500`} />;
        if (title.includes('Referral')) return <Users className={`${baseClasses} text-purple-500`} />;
        return <Info className={`${baseClasses} text-slate-500`} />;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* The Bell Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isOpen ? 'bg-emerald-100 text-emerald-600 shadow-inner' : 'bg-white text-slate-500 hover:text-emerald-600 hover:bg-slate-50 shadow-sm border border-slate-200'
                }`}
            >
                <Bell className="h-5 w-5" strokeWidth={2.5} />
                
                {/* Modern Notification Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] sm:max-w-none sm:w-[22rem] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Notifications</h3>
                            {unreadCount > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                    {unreadCount} new
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
                            >
                                <CheckCheck className="w-4 h-4 text-slate-400" />
                                <span>Mark all read</span>
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[60vh] sm:max-h-[26rem] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                <div className="bg-slate-100 p-3 rounded-full mb-3">
                                    <BellOff className="w-6 h-6 text-slate-400" />
                                </div>
                                <p className="text-slate-600 font-medium text-base">All caught up!</p>
                                <p className="text-slate-400 text-sm mt-1">Check back later for new updates.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {notifications.map((notif) => {
                                    const isUnread = notif.read_at === null;
                                    return (
                                        <div 
                                            key={notif.id}
                                            onClick={() => markAsRead(notif.id, isUnread)}
                                            className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                                isUnread 
                                                    ? 'bg-[#f0fbf4] hover:bg-[#e6f7ec]' 
                                                    : 'hover:bg-slate-50'
                                            }`}
                                        >
                                            {/* Unread dot indicator (Side Pill) */}
                                            {isUnread && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-[#00a669] rounded-r-full" />
                                            )}

                                            {/* Icon */}
                                            <div className={`p-2 sm:p-2.5 rounded-full shrink-0 transition-colors duration-300 ml-1 ${
                                                isUnread ? 'bg-white shadow-sm border border-[#e2f5ea]' : 'bg-slate-100 group-hover:bg-white group-hover:shadow-sm'
                                            }`}>
                                                {getIcon(notif.data.title, isUnread)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 space-y-0.5 pt-0.5 pr-2">
                                                <p className={`text-sm ${isUnread ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}>
                                                    {notif.data.title}
                                                </p>
                                                <p className={`text-[13px] leading-relaxed line-clamp-2 ${isUnread ? 'text-slate-600' : 'text-slate-500'}`}>
                                                    {notif.data.message}
                                                </p>
                                                <p className="text-[11px] text-slate-400 font-medium pt-1">
                                                    {formatDate(notif.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;