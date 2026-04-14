import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Bell, CheckCheck, ChevronDown, KeyRound, LogOut, Menu, Search, Settings } from 'lucide-react';
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Modal from '../ui/Modal';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import {
  ACTIVITY_UPDATED_EVENT,
  NOTIFICATIONS_UPDATED_EVENT,
  addActivityEntry,
  getActivityLog,
  getUnreadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../services/storage';
import { ADMIN_NAV_ITEM, APP_SEARCH_ITEMS } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';

const ROUTE_META = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Track customer metrics, pipeline value, and recent CRM activity.',
  },
  {
    path: '/customers',
    title: 'Customers',
    description: 'Search, filter, and manage the customer records stored in the CRM.',
  },
  {
    path: '/customers/create',
    title: 'Create customer',
    description: 'Add a new customer record with contact details and pipeline context.',
  },
  {
    path: '/customers/:id/edit',
    title: 'Edit customer',
    description: 'Update account details, deal value, and customer notes.',
  },
  {
    path: '/customers/:id',
    title: 'Customer detail',
    description: 'Review the customer profile, activity history, deals, and notes.',
  },
  {
    path: '/profile',
    title: 'Profile',
    description: 'Manage your account information, password, and CRM preferences.',
  },
  {
    path: '/admin',
    title: 'Admin',
    description: 'Manage team accounts, roles, and workspace access.',
  },
];

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const { setSidebarOpen, showToast } = useContext(UIContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => getUnreadNotifications());
  const [activityEntries, setActivityEntries] = useState(() => getActivityLog());
  const profileName = user?.fullName || 'Moni Roy';
  const profileRole = user?.role || 'Admin';

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const menuRef = useRef(null);

  const pageMeta = useMemo(
    () =>
      ROUTE_META.find((item) => matchPath({ path: item.path, end: true }, location.pathname)) || {
        title: 'Controllusion',
        description: 'CRM workspace',
      },
    [location.pathname],
  );

  const availableSearchItems = useMemo(() => {
    const items = user?.role === 'Admin' ? [...APP_SEARCH_ITEMS, ADMIN_NAV_ITEM] : APP_SEARCH_ITEMS;
    return items.map((item) => ({
      key: item.key || item.label.toLowerCase().replace(/\s+/g, '-'),
      label: item.label,
      path: item.path || item.to,
    }));
  }, [user?.role]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return availableSearchItems.filter((route) => `${route.label} ${route.key}`.toLowerCase().includes(query)).slice(0, 6);
  }, [availableSearchItems, searchQuery]);

  useEffect(() => {
    setNotificationOpen(false);
    setMenuOpen(false);
    setActivityOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchQuery('');
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }

      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  useEffect(() => {
    function syncNotifications() {
      setNotifications(getUnreadNotifications());
    }

    function syncActivity() {
      setActivityEntries(getActivityLog());
    }

    window.addEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
    window.addEventListener(ACTIVITY_UPDATED_EVENT, syncActivity);

    return () => {
      window.removeEventListener(NOTIFICATIONS_UPDATED_EVENT, syncNotifications);
      window.removeEventListener(ACTIVITY_UPDATED_EVENT, syncActivity);
    };
  }, []);

  useEffect(() => {
    setNotifications(getUnreadNotifications());
    setActivityEntries(getActivityLog());
  }, [user?.id]);

  async function handleLogout() {
    addActivityEntry({
      title: 'Signed out',
      description: 'The current session was ended from the CRM profile menu.',
    });
    await logoutUser();
    showToast({
      title: 'Signed out',
      description: 'Your session has been cleared.',
      type: 'info',
    });
    navigate('/login');
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    if (!searchResults.length) {
      return;
    }

    const [result] = searchResults;
    navigate(result.path);
  }

  function openSearchResult(result) {
    navigate(result.path);
  }

  function markNotificationsRead() {
    markAllNotificationsRead();
    setNotificationOpen(false);
    addActivityEntry({
      title: 'Notifications cleared',
      description: 'All unread notifications were marked as reviewed.',
    });
    showToast({
      title: 'Notifications cleared',
      description: 'All recent alerts were marked as reviewed.',
      type: 'info',
    });
  }

  function openActivityLog() {
    setMenuOpen(false);
    setActivityOpen(true);
  }

  function handleNotificationClick(notificationId) {
    const notification = notifications.find((item) => item.id === notificationId);
    markNotificationRead(notificationId);
    if (notification?.path) {
      navigate(notification.path);
    }
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-[82px] border-b border-[rgba(238,241,247,0.95)] bg-[rgba(255,255,255,0.94)] backdrop-blur-xl lg:left-[228px]">
      <div className="mx-auto flex h-full max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[color:var(--border)] bg-white text-[#20253a] lg:hidden" onClick={() => setSidebarOpen(true)} type="button">
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b5bdcd]">Controllusion CRM</p>
            <p className="mt-1 text-xl font-black tracking-tight text-[#20253a]">{pageMeta.title}</p>
            <p className="mt-1 text-sm font-semibold text-[#8b93a8]">{pageMeta.description}</p>
          </div>

          <div className="relative hidden md:block" ref={searchRef}>
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab4c8]" />
            <form onSubmit={handleSearchSubmit}>
              <input
                className="h-12 w-[280px] rounded-full border border-[color:var(--border)] bg-[#f7f8fc] py-2 pl-12 pr-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b5bdcd] lg:w-[420px]"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search CRM pages"
                type="text"
                value={searchQuery}
              />
            </form>

            {searchQuery ? (
              <div className="absolute left-0 right-0 top-[calc(100%+12px)] rounded-[24px] border border-[color:var(--border)] bg-white p-3 shadow-[0_24px_60px_-38px_rgba(17,24,39,0.24)]">
                <p className="px-3 pb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#9aa4bb]">Quick Search</p>
                {searchResults.length ? (
                  <div className="space-y-1">
                    {searchResults.map((result) => (
                      <button
                        className="flex w-full items-center justify-between rounded-[16px] px-3 py-3 text-left text-sm font-bold text-[#20253a] transition hover:bg-[#f8fafe]"
                        key={result.key}
                        onClick={() => openSearchResult(result)}
                        type="button"
                      >
                        <span>{result.label}</span>
                        <span className="text-xs font-semibold text-[#9aa4bb]">{result.path.replace('/', '')}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[18px] bg-[#f8fafe] px-4 py-4 text-sm font-semibold text-[#7d88a3]">
                    No matching CRM pages.
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <div className="relative" ref={notificationRef}>
            <button className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#4f80ff] transition hover:bg-[#f5f8ff]" onClick={() => setNotificationOpen((value) => !value)} type="button">
              <Bell className="h-5 w-5 fill-current" />
              {notifications.length ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ff6b6b] px-1 text-[11px] font-bold text-white">
                  {Math.min(notifications.length, 9)}
                </span>
              ) : null}
            </button>

            {notificationOpen ? (
              <div className="absolute right-0 mt-4 w-80 rounded-[24px] border border-[color:var(--border)] bg-white p-4 shadow-[0_24px_60px_-38px_rgba(17,24,39,0.24)]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-black text-[#20253a]">Notifications</p>
                  <button className="inline-flex items-center gap-2 text-xs font-bold text-[#4f80ff]" onClick={markNotificationsRead} type="button">
                    <CheckCheck className="h-4 w-4" />
                    Mark all read
                  </button>
                </div>
                {notifications.length ? (
                  <div className="space-y-3">
                    {notifications.slice(0, 4).map((item) => (
                      <button
                        className="w-full rounded-[18px] bg-[#f8fafe] p-3.5 text-left transition hover:bg-[#eef4ff]"
                        key={item.id}
                        onClick={() => handleNotificationClick(item.id)}
                        type="button"
                      >
                        <p className="text-sm font-extrabold text-[#20253a]">{item.title}</p>
                        <p className="mt-1 text-sm text-[#7d88a3]">{item.message}</p>
                        <p className="mt-2 text-xs text-[#9aa4bb]">{formatRelativeTime(item.createdAt)}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[18px] bg-[#f8fafe] px-4 py-5 text-sm font-semibold text-[#7d88a3]">
                    You have no unread notifications.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={menuRef}>
            <button className="flex items-center gap-3 rounded-full border border-transparent bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2" onClick={() => setMenuOpen((value) => !value)} type="button">
              <Avatar name={user?.fullName} size="sm" src={user?.avatarUrl} />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-extrabold text-[#20253a]">{profileName}</p>
                <p className="text-xs font-semibold text-[#8b93a8]">{profileRole}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#c0c8d8]" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-4 w-64 rounded-[24px] border border-[color:var(--border)] bg-white p-3 shadow-[0_24px_60px_-38px_rgba(17,24,39,0.24)]">
                <div className="rounded-[18px] bg-[#f8fafe] p-3">
                  <p className="text-sm font-extrabold text-[#20253a]">{profileName}</p>
                  <p className="text-sm text-[#7d88a3]">{user?.email || 'moni@controllusion.com'}</p>
                </div>
                <div className="mt-3 space-y-1">
                  <Link className="flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-bold text-[#20253a] transition hover:bg-[#f8fafe]" onClick={() => setMenuOpen(false)} to="/profile">
                    <Settings className="h-4 w-4" />
                    Manage Account
                  </Link>
                  <button className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-sm font-bold text-[#20253a] transition hover:bg-[#f8fafe]" onClick={() => { setMenuOpen(false); navigate('/profile'); }} type="button">
                    <KeyRound className="h-4 w-4" />
                    Change Password
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-sm font-bold text-[#20253a] transition hover:bg-[#f8fafe]" onClick={openActivityLog} type="button">
                    <Activity className="h-4 w-4" />
                    Activity Log
                  </button>
                  <button className="flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left text-sm font-bold text-[#20253a] transition hover:bg-[#f8fafe]" onClick={handleLogout} type="button">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Modal description="Recent CRM actions captured in this browser session." maxWidth="max-w-xl" onClose={() => setActivityOpen(false)} open={activityOpen} title="Activity Log">
        {activityEntries.length ? (
          <div className="space-y-3">
            {activityEntries.slice(0, 10).map((entry) => (
              <div className="rounded-[18px] bg-[#f8fafe] p-4" key={entry.id}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-extrabold text-[#20253a]">{entry.title}</p>
                    <p className="mt-1 text-sm text-[#7d88a3]">{entry.description}</p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-[#9aa4bb]">{formatRelativeTime(entry.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[18px] bg-[#f8fafe] px-4 py-5 text-sm font-semibold text-[#7d88a3]">
            No account activity has been recorded yet.
          </div>
        )}
      </Modal>
    </header>
  );
}

export default Topbar;
