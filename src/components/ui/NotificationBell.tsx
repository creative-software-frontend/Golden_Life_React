


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Bell, Package, CheckCheck, Wallet, Users, Info, BellOff } from 'lucide-react';

// interface NotificationBellProps {
//   baseURL: string;
//   token: string;
// }

// interface NotificationData {
//   title: string;
//   message: string;
//   [key: string]: any;
// }

// interface NotificationItem {
//   id: string;
//   read_at: string | null; 
//   created_at: string;
//   data: NotificationData;
//   type?: string;
// }

// interface NotificationsResponse {
//   status: boolean;
//   unread_count: number;
//   notifications: NotificationItem[];
// }

// const NotificationBell = ({ baseURL, token }: NotificationBellProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fetchNotifications = useCallback(async () => {
//     if (!token) return;
//     try {
//       const response = await fetch(`${baseURL}/api/notifications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) return;
//       const data: NotificationsResponse = await response.json();
//       if (data.status) {
//         // Sort newest first
//         const sorted = [...(data.notifications || [])].sort((a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         );
//         setNotifications(sorted);
//         setUnreadCount(data.unread_count ?? sorted.filter(n => !n.read_at).length);
//       }
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//     }
//   }, [baseURL, token]);

//   const pollUnreadCount = useCallback(async () => {
//     if (!token || isOpen) return;
//     try {
//       const response = await fetch(`${baseURL}/api/notifications/unread`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) return;
//       const data = await response.json();
//       if (data.status && typeof data.unread_count === 'number') {
//         setUnreadCount(data.unread_count);
//         const currentUnread = notifications.filter(n => !n.read_at).length;
//         if (data.unread_count !== currentUnread) {
//           fetchNotifications();
//         }
//       }
//     } catch (error) {
//       console.error('Failed to poll unread count:', error);
//     }
//   }, [baseURL, token, isOpen, notifications, fetchNotifications]);

//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   useEffect(() => {
//     const interval = setInterval(pollUnreadCount, 10000);
//     return () => clearInterval(interval);
//   }, [pollUnreadCount]);

//   const markAsRead = async (id: string) => {
//     // Optimistic update
//     setNotifications(prev =>
//       prev.map(notif =>
//         notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
//       )
//     );
//     setUnreadCount(prev => Math.max(0, prev - 1));

//     try {
//       const response = await fetch(`${baseURL}/api/notifications/read?id=${encodeURIComponent(id)}`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Mark as read failed with status: ${response.status}`);
//       }

//       // Optional: you can check response json if backend returns status
//       const result = await response.json();
//       if (!result.status) {
//         throw new Error('Backend did not confirm mark as read');
//       }
//     } catch (error) {
//       console.error('Failed to mark as read:', error);
//       fetchNotifications(); // rollback on error
//     }
//   };

//   const markAllAsRead = async () => {
//     if (unreadCount === 0) return;

//     // Optimistic update
//     const now = new Date().toISOString();
//     setNotifications(prev => prev.map(notif => ({ ...notif, read_at: now })));
//     setUnreadCount(0);

//     try {
//       const response = await fetch(`${baseURL}/api/notifications/read-all`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error('Mark all as read failed');
//     } catch (error) {
//       console.error('Failed to mark all as read:', error);
//       fetchNotifications(); // rollback on error
//     }
//   };

//   const getIcon = (notif: NotificationItem) => {
//     const baseClasses = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110';
//     const title = notif.data.title?.toLowerCase() || '';
//     const type = notif.type?.toLowerCase() || '';

//     if (title.includes('order') || type.includes('orderstatus')) {
//       return <Package className={`${baseClasses} text-blue-500`} />;
//     }
//     if (title.includes('transaction') || type.includes('transactionstatus')) {
//       return <Wallet className={`${baseClasses} text-emerald-500`} />;
//     }
//     if (title.includes('referral') || type.includes('referralbonus')) {
//       return <Users className={`${baseClasses} text-purple-500`} />;
//     }
//     return <Info className={`${baseClasses} text-slate-500`} />;
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const isUnread = (notif: NotificationItem) => !notif.read_at;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       {/* Bell button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
//           isOpen
//             ? 'bg-emerald-100 text-emerald-600 shadow-inner'
//             : 'bg-white text-slate-500 hover:text-emerald-600 hover:bg-slate-50 shadow-sm border border-slate-200'
//         }`}
//       >
//         <Bell className="h-5 w-5" strokeWidth={2.5} />

//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
//             <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm">
//               {unreadCount > 9 ? '9+' : unreadCount}
//             </span>
//           </span>
//         )}
//       </button>

//       {/* Dropdown */}
//       {isOpen && (
//         <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] sm:w-[22rem] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
//           {/* Header */}
//           <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
//             <div className="flex items-center gap-3">
//               <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Notifications</h3>
//               {unreadCount > 0 && (
//                 <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
//                   {unreadCount} new
//                 </span>
//               )}
//             </div>

//             {unreadCount > 0 && (
//               <button
//                 onClick={markAllAsRead}
//                 className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
//               >
//                 <CheckCheck className="w-4 h-4 text-slate-400" />
//                 Mark all read
//               </button>
//             )}
//           </div>

//           {/* Notification list */}
//           <div className="max-h-[60vh] sm:max-h-[26rem] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
//             {notifications.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//                 <div className="bg-slate-100 p-3 rounded-full mb-3">
//                   <BellOff className="w-6 h-6 text-slate-400" />
//                 </div>
//                 <p className="text-slate-600 font-medium text-base">No notifications yet</p>
//                 <p className="text-slate-400 text-sm mt-1">We'll notify you when something new arrives.</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {notifications.map((notif) => {
//                   const unread = isUnread(notif);
//                   return (
//                     <div
//                       key={notif.id}
//                       onClick={() => unread && markAsRead(notif.id)}
//                       className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
//                         unread
//                           ? 'bg-emerald-50/70 hover:bg-emerald-100 border-l-4 border-emerald-500'
//                           : 'bg-white hover:bg-slate-50 border-l-4 border-transparent opacity-80'
//                       }`}
//                     >
//                       <div className="p-2 sm:p-2.5 rounded-full shrink-0 bg-white shadow-sm border border-slate-200">
//                         {getIcon(notif)}
//                       </div>

//                       <div className="flex-1 space-y-1">
//                         <p
//                           className={`text-sm ${
//                             unread ? 'font-semibold text-slate-900' : 'font-normal text-slate-700'
//                           }`}
//                         >
//                           {notif.data.title}
//                         </p>
//                         <p
//                           className={`text-[13px] leading-relaxed line-clamp-2 ${
//                             unread ? 'text-slate-700' : 'text-slate-500'
//                           }`}
//                         >
//                           {notif.data.message}
//                         </p>
//                         <p className="text-[11px] text-slate-400 pt-0.5">
//                           {formatDate(notif.created_at)}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Bell, Package, CheckCheck, Wallet, Users, Info, BellOff } from 'lucide-react';

// interface NotificationBellProps {
//   baseURL: string;
//   token: string;
// }

// interface NotificationData {
//   title: string;
//   message: string;
//   [key: string]: any;
// }

// interface NotificationItem {
//   id: string;
//   read_at: string | null;
//   created_at: string;
//   data: NotificationData;
//   type?: string;
// }

// interface NotificationsResponse {
//   status: boolean;
//   unread_count?: number;   // sometimes backend uses this
//   count?: number;          // sometimes backend uses this
//   notifications: NotificationItem[];
// }

// const NotificationBell = ({ baseURL, token }: NotificationBellProps) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationItem[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [syncing, setSyncing] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const fetchNotifications = useCallback(async (silent = false) => {
//     if (!token) return;
//     if (!silent) setSyncing(true);

//     try {
//       const response = await fetch(`${baseURL}/api/notifications`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) return;

//       const data: NotificationsResponse = await response.json();
//       if (data.status) {
//         const sorted = [...(data.notifications || [])].sort((a, b) =>
//           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//         );
//         setNotifications(sorted);

//         // Use whichever key backend returns
//         const realCount = data.unread_count ?? data.count ?? 0;
//         setUnreadCount(realCount);
//       }
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//     } finally {
//       if (!silent) setSyncing(false);
//     }
//   }, [baseURL, token]);

//   const pollUnreadCount = useCallback(async () => {
//     if (!token) return;
//     try {
//       const response = await fetch(`${baseURL}/api/notifications/unread`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) return;

//       const data = await response.json();
//       if (data.status) {
//         const realCount = data.unread_count ?? data.count ?? 0;
//         setUnreadCount(realCount);
//       }
//     } catch (error) {
//       console.error('Poll failed:', error);
//     }
//   }, [baseURL, token]);

//   // Initial load
//   useEffect(() => {
//     fetchNotifications(true);
//   }, [fetchNotifications]);

//   // Polling (very fast when dropdown open)
//   useEffect(() => {
//     const intervalMs = isOpen ? 3000 : 12000;
//     const interval = setInterval(pollUnreadCount, intervalMs);
//     return () => clearInterval(interval);
//   }, [pollUnreadCount, isOpen]);

//   const markAsRead = async (id: string) => {
//     const wasUnread = notifications.some(n => n.id === id && !n.read_at);
//     if (!wasUnread) return;

//     // Instant visual change only
//     setNotifications(prev =>
//       prev.map(notif =>
//         notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
//       )
//     );

//     try {
//       const response = await fetch(`${baseURL}/api/notifications/read?id=${encodeURIComponent(id)}`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const result = await response.json();
//       if (!result.status) throw new Error('Backend failed');

//       // Super fast refetch (200ms) → count updates almost immediately
//       setTimeout(() => fetchNotifications(true), 200);

//     } catch (error) {
//       console.error('Mark as read failed:', error);
//       fetchNotifications(true);
//     }
//   };

//   const markAllAsRead = async () => {
//     if (unreadCount === 0) return;

//     // Instant visual change only
//     setNotifications(prev =>
//       prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
//     );

//     try {
//       const response = await fetch(`${baseURL}/api/notifications/read-all`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const result = await response.json();
//       if (!result.status) throw new Error('Backend failed');

//       setTimeout(() => fetchNotifications(true), 200);

//     } catch (error) {
//       console.error('Mark all failed:', error);
//       fetchNotifications(true);
//     }
//   };

//   const getIcon = (notif: NotificationItem) => {
//     const base = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110';
//     const title = notif.data.title?.toLowerCase() || '';
//     const type = notif.type?.toLowerCase() || '';

//     if (title.includes('order') || type.includes('orderstatus')) return <Package className={`${base} text-blue-500`} />;
//     if (title.includes('transaction') || type.includes('transactionstatus')) return <Wallet className={`${base} text-emerald-500`} />;
//     if (title.includes('referral') || type.includes('referralbonus')) return <Users className={`${base} text-purple-500`} />;
//     return <Info className={`${base} text-slate-500`} />;
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const isUnread = (notif: NotificationItem) => !notif.read_at;

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${
//           isOpen
//             ? 'bg-emerald-100 text-emerald-600 shadow-inner'
//             : 'bg-white text-slate-500 hover:text-emerald-600 hover:bg-slate-50 shadow-sm border border-slate-200'
//         }`}
//         disabled={syncing}
//       >
//         <Bell className="h-5 w-5" strokeWidth={2.5} />

//         {unreadCount > 0 && (
//           <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
//             <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm">
//               {unreadCount > 9 ? '9+' : unreadCount}
//             </span>
//           </span>
//         )}

//         {syncing && (
//           <span className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-full">
//             <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//           </span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] sm:w-[22rem] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
//           <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
//             <div className="flex items-center gap-3">
//               <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Notifications</h3>
//               {unreadCount > 0 && (
//                 <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
//                   {unreadCount} new
//                 </span>
//               )}
//             </div>

//             {unreadCount > 0 && (
//               <button
//                 onClick={markAllAsRead}
//                 disabled={syncing}
//                 className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
//               >
//                 <CheckCheck className="w-4 h-4 text-slate-400" />
//                 Mark all read
//               </button>
//             )}
//           </div>

//           <div className="max-h-[60vh] sm:max-h-[26rem] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
//             {notifications.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
//                 <div className="bg-slate-100 p-3 rounded-full mb-3">
//                   <BellOff className="w-6 h-6 text-slate-400" />
//                 </div>
//                 <p className="text-slate-600 font-medium text-base">No notifications yet</p>
//                 <p className="text-slate-400 text-sm mt-1">We'll notify you when something new arrives.</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {notifications.map((notif) => {
//                   const unread = isUnread(notif);
//                   return (
//                     <div
//                       key={notif.id}
//                       onClick={() => unread && !syncing && markAsRead(notif.id)}
//                       className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
//                         unread
//                           ? 'bg-emerald-50/70 hover:bg-emerald-100 border-l-4 border-emerald-500'
//                           : 'bg-white hover:bg-slate-50 border-l-4 border-transparent opacity-80'
//                       } ${syncing ? 'opacity-60 pointer-events-none' : ''}`}
//                     >
//                       <div className="p-2 sm:p-2.5 rounded-full shrink-0 bg-white shadow-sm border border-slate-200">
//                         {getIcon(notif)}
//                       </div>

//                       <div className="flex-1 space-y-1">
//                         <p
//                           className={`text-sm ${
//                             unread ? 'font-semibold text-slate-900' : 'font-normal text-slate-700'
//                           }`}
//                         >
//                           {notif.data.title}
//                         </p>
//                         <p
//                           className={`text-[13px] leading-relaxed line-clamp-2 ${
//                             unread ? 'text-slate-700' : 'text-slate-500'
//                           }`}
//                         >
//                           {notif.data.message}
//                         </p>
//                         <p className="text-[11px] text-slate-400 pt-0.5">
//                           {formatDate(notif.created_at)}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;


import React, { useState, useEffect, useRef } from 'react';
import { Bell, Package, CheckCheck, Wallet, Users, Info, BellOff } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface NotificationBellProps {
  token: string;
}

const NotificationBell = ({ token }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Store data
  const notifications = useAppStore(s => s.notifications);
  const unreadCount = useAppStore(s => s.unreadCount);
  const isNotificationLoading = useAppStore(s => s.isNotificationLoading);
  
  // Store actions
  const fetchNotifications = useAppStore(s => s.fetchNotifications);
  const pollUnreadCount = useAppStore(s => s.pollUnreadCount);
  const markAsRead = useAppStore(s => s.markAsRead);
  const markAllAsRead = useAppStore(s => s.markAllAsRead);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync notifications on mount and when opening
  useEffect(() => {
    if (token) {
      fetchNotifications(true);
    }
  }, [token, fetchNotifications]);

  useEffect(() => {
    if (isOpen && token) {
      fetchNotifications(true);
    }
  }, [isOpen, token, fetchNotifications]);

  // Polling logic (Centralized in component but sharing store state)
  useEffect(() => {
    if (!token) return;
    
    // Poll unread count every 12 seconds when closed, 4 seconds when open
    const intervalMs = isOpen ? 4000 : 12000;
    const interval = setInterval(() => {
        if (isOpen) {
            fetchNotifications(true);
        } else {
            pollUnreadCount();
        }
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [token, isOpen, fetchNotifications, pollUnreadCount]);

  const getIcon = (notif: any) => {
    const base = 'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:scale-110';
    const title = notif.data.title?.toLowerCase() || '';
    const type = notif.type?.toLowerCase() || '';

    if (title.includes('order') || type.includes('orderstatus')) return <Package className={`${base} text-blue-500`} />;
    if (title.includes('transaction') || type.includes('transactionstatus')) return <Wallet className={`${base} text-emerald-500`} />;
    if (title.includes('referral') || type.includes('referralbonus')) return <Users className={`${base} text-purple-500`} />;
    return <Info className={`${base} text-slate-500`} />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUnread = (notif: any) => !notif.read_at;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen
            ? 'bg-emerald-100 text-emerald-600 shadow-inner'
            : 'bg-white text-slate-500 hover:text-emerald-600 hover:bg-slate-50 shadow-sm border border-slate-200'
          }`}
        disabled={isNotificationLoading}
      >
        <Bell className="h-5 w-5" strokeWidth={2.5} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white text-[10px] font-bold text-white items-center justify-center shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </span>
        )}

        {isNotificationLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-full">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-[90vw] max-w-[320px] sm:w-[22rem] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 origin-top-right">
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
                disabled={isNotificationLoading}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCheck className="w-4 h-4 text-slate-400" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[60vh] sm:max-h-[26rem] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-slate-100 p-3 rounded-full mb-3">
                  <BellOff className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium text-base">No notifications yet</p>
                <p className="text-slate-400 text-sm mt-1">We'll notify you when something new arrives.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif) => {
                  const unread = isUnread(notif);
                  return (
                    <div
                      key={notif.id}
                      onClick={() => unread && !isNotificationLoading && markAsRead(notif.id)}
                      className={`group relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${unread
                          ? 'bg-emerald-50/70 hover:bg-emerald-100 border-l-4 border-emerald-500'
                          : 'bg-white hover:bg-slate-50 border-l-4 border-transparent opacity-80'
                        } ${isNotificationLoading ? 'opacity-60 pointer-events-none' : ''}`}
                    >
                      <div className="p-2 sm:p-2.5 rounded-full shrink-0 bg-white shadow-sm border border-slate-200">
                        {getIcon(notif)}
                      </div>

                      <div className="flex-1 space-y-1">
                        <p
                          className={`text-sm ${unread ? 'font-semibold text-slate-900' : 'font-normal text-slate-700'
                            }`}
                        >
                          {notif.data.title}
                        </p>
                        <p
                          className={`text-[13px] leading-relaxed line-clamp-2 ${unread ? 'text-slate-700' : 'text-slate-500'
                            }`}
                        >
                          {notif.data.message}
                        </p>
                        <p className="text-[11px] text-slate-400 pt-0.5">
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