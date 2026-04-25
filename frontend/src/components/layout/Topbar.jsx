import { useContext, useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, Grid2x2, Search, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import {
  NOTIFICATIONS_UPDATED_EVENT,
  getNotifications,
  getUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/storage';
import { APP_BRAND } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';

const topLinks = [
  { label: 'Reports', to: '/analytics' },
  { label: 'Pipeline', to: '/customers' },
  { label: 'Team', to: '/admin', roles: ['Admin'] },
];

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setSidebarOpen, showToast } = useContext(UIContext);
  const [query, setQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getNotifications());

  const unreadCount = useMemo(() => notifications.filter((item) => !item.read).length, [notifications]);
  const visibleTopLinks = useMemo(
    () => topLinks.filter((item) => !item.roles?.length || item.roles.includes(user?.role)),
    [user?.role],
  );

  useEffect(() => {
    if (location.pathname === '/search') {
      setQuery(new URLSearchParams(location.search).get('q') || '');
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    function refreshNotifications() {
      setNotifications(getNotifications());
    }

    function closeOnOutsideClick(event) {
      if (event.target.closest?.('.notifications-panel, .notifications-trigger')) {
        return;
      }
      setNotificationsOpen(false);
    }

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshNotifications);
    window.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, refreshNotifications);
      window.removeEventListener('mousedown', closeOnOutsideClick);
    };
  }, []);

  function openNotifications() {
    setNotifications(getNotifications());
    setNotificationsOpen((current) => !current);
  }

  function markAllRead() {
    const unread = getUnreadNotifications();
    const nextNotifications = markAllNotificationsRead();
    setNotifications(nextNotifications);
    showToast({
      title: unread.length ? 'Notifications marked read' : 'No unread notifications',
      description: unread.length ? `${unread.length} notification${unread.length === 1 ? '' : 's'} updated.` : 'You are fully caught up.',
      type: 'info',
    });
  }

  function openNotification(notification) {
    setNotifications(markNotificationRead(notification.id));
    setNotificationsOpen(false);
    if (notification.path) {
      navigate(notification.path);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const trimmedQuery = query.trim();
    navigate(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search');
  }

  return (
    <header className="app-topbar fixed left-0 right-0 top-0 z-20 h-[52px] lg:left-[176px]">
      <div className="mx-auto hidden h-full max-w-[1480px] items-center justify-between gap-5 px-5 lg:flex">
        <form className="relative w-full max-w-[410px]" onSubmit={handleSearchSubmit}>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9aa8bf]" />
          <input
            className="h-8 w-full rounded-[6px] border border-transparent bg-[#f3f7ff] pl-9 pr-3 text-[12px] font-medium text-[#17223b] outline-none placeholder:text-[#9aa8bf] focus:border-[#d9e4fa] focus:bg-white"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search accounts, leads..."
            type="text"
            value={query}
          />
        </form>

        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-7">
            {visibleTopLinks.map((item) => (
              <Link
                className={`text-[12px] font-semibold transition ${
                  location.pathname === item.to ? 'text-[#4c42e8]' : 'text-[#52627b] hover:text-[#17223b]'
                }`}
                key={item.to}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative flex items-center gap-3 text-[#52627b]">
            <button className="notifications-trigger relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f3f7ff]" onClick={openNotifications} type="button">
              <Bell className="h-4 w-4" />
              {unreadCount ? (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-[#ec6a60] ring-2 ring-white" />
              ) : null}
            </button>
            {notificationsOpen ? (
              <div className="notifications-panel absolute right-0 top-11 z-50 w-[360px] overflow-hidden rounded-[12px] border border-[#dfe7f4] bg-white shadow-[0_28px_70px_-36px_rgba(15,23,42,0.35)]">
                <div className="flex items-center justify-between border-b border-[#edf2fb] px-4 py-3">
                  <div>
                    <h2 className="text-[13px] font-black text-[#14213d]">Notifications</h2>
                    <p className="text-[10px] font-semibold text-[#70809a]">
                      {unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'All updates are read'}
                    </p>
                  </div>
                  <button
                    className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#eef2ff] px-2.5 py-1.5 text-[10px] font-bold text-[#4c42e8]"
                    onClick={markAllRead}
                    type="button"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[360px] overflow-y-auto py-2">
                  {notifications.length ? (
                    notifications.map((notification) => (
                      <button
                        className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-[#f7f9ff]"
                        key={notification.id}
                        onClick={() => openNotification(notification)}
                        type="button"
                      >
                        <span
                          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                            notification.read ? 'bg-[#d7dfef]' : 'bg-[#4c42e8]'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-black text-[#14213d]">{notification.title}</span>
                          <span className="mt-1 block text-[11px] leading-5 text-[#52627b]">{notification.message}</span>
                          <span className="mt-1 block text-[10px] font-semibold text-[#9aa8bf]">
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-[12px] font-bold text-[#14213d]">No notifications yet</p>
                      <p className="mt-1 text-[11px] text-[#70809a]">Workspace updates will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f3f7ff]" onClick={() => navigate('/settings')} type="button">
              <Settings className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f3f7ff]" onClick={() => navigate('/search')} type="button">
              <Grid2x2 className="h-4 w-4" />
            </button>
            <Link to="/profile">
              <Avatar name={user?.fullName || 'Alex Mercer'} size="sm" src={user?.avatarUrl} />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex h-full max-w-[680px] items-center justify-between px-4 lg:hidden">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef2ff] text-[#4c42e8]"
          onClick={() => setSidebarOpen(true)}
          type="button"
        >
          <Grid2x2 className="h-4 w-4" />
        </button>

        <p className="text-sm font-black tracking-[-0.03em] text-[#17223b]">{APP_BRAND.name}</p>

        <button
          className="notifications-trigger relative flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef2ff] text-[#4c42e8]"
          onClick={openNotifications}
          type="button"
        >
          <Bell className="h-4 w-4" />
          {unreadCount ? <span className="absolute right-3 top-2.5 h-2 w-2 rounded-full bg-[#ec6a60]" /> : null}
        </button>
        {notificationsOpen ? (
          <div className="notifications-panel absolute left-4 right-4 top-[56px] z-50 overflow-hidden rounded-[12px] border border-[#dfe7f4] bg-white shadow-[0_28px_70px_-36px_rgba(15,23,42,0.35)]">
            <div className="flex items-center justify-between border-b border-[#edf2fb] px-4 py-3">
              <div>
                <h2 className="text-[13px] font-black text-[#14213d]">Notifications</h2>
                <p className="text-[10px] font-semibold text-[#70809a]">
                  {unreadCount ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'All updates are read'}
                </p>
              </div>
              <button className="rounded-[6px] bg-[#eef2ff] px-2.5 py-1.5 text-[10px] font-bold text-[#4c42e8]" onClick={markAllRead} type="button">
                Mark all read
              </button>
            </div>
            <div className="max-h-[320px] overflow-y-auto py-2">
              {notifications.map((notification) => (
                <button className="flex w-full gap-3 px-4 py-3 text-left hover:bg-[#f7f9ff]" key={notification.id} onClick={() => openNotification(notification)} type="button">
                  <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${notification.read ? 'bg-[#d7dfef]' : 'bg-[#4c42e8]'}`} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-black text-[#14213d]">{notification.title}</span>
                    <span className="mt-1 block text-[11px] leading-5 text-[#52627b]">{notification.message}</span>
                    <span className="mt-1 block text-[10px] font-semibold text-[#9aa8bf]">{formatRelativeTime(notification.createdAt)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Topbar;
