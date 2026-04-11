import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Bell, CheckCheck, ChevronDown, LogOut, Menu, Search, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { getDatabase } from '../../services/storage';
import { formatRelativeTime } from '../../utils/formatters';
import { WORKSPACE_ROUTES } from '../../utils/workspace';

const LANGUAGE_OPTIONS = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' },
];

function LanguageFlag() {
  return (
    <svg aria-hidden="true" className="h-7 w-10 rounded-[4px] border border-slate-200" viewBox="0 0 60 40">
      <rect fill="#1E3A8A" height="40" width="60" />
      <path d="M0 0 L25 16.5 L21 20 L0 6 Z M60 0 L35 16.5 L39 20 L60 6 Z M0 40 L25 23.5 L21 20 L0 34 Z M60 40 L35 23.5 L39 20 L60 34 Z" fill="#fff" />
      <path d="M0 0 L23 15 L19 15 L0 3 Z M60 0 L37 15 L41 15 L60 3 Z M0 40 L23 25 L19 25 L0 37 Z M60 40 L37 25 L41 25 L60 37 Z" fill="#DC2626" />
      <rect fill="#fff" height="8" width="60" y="16" />
      <rect fill="#fff" height="40" width="10" x="25" />
      <rect fill="#DC2626" height="4" width="60" y="18" />
      <rect fill="#DC2626" height="40" width="6" x="27" />
    </svg>
  );
}

function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const { setSidebarOpen, showToast } = useContext(UIContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [notifications, setNotifications] = useState(() => getDatabase().notifications || []);

  const searchRef = useRef(null);
  const notificationRef = useRef(null);
  const languageRef = useRef(null);
  const menuRef = useRef(null);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return WORKSPACE_ROUTES.filter((route) => `${route.label} ${route.key}`.toLowerCase().includes(query)).slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    setNotificationOpen(false);
    setMenuOpen(false);
    setLanguageOpen(false);
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

      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
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

  async function handleLogout() {
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
      showToast({
        title: 'No matches found',
        description: `Nothing in the workspace matched "${searchQuery}".`,
        type: 'info',
      });
      return;
    }

    const [result] = searchResults;
    navigate(result.path);
    showToast({
      title: result.label,
      description: 'Opened from the global search.',
      type: 'info',
    });
  }

  function openSearchResult(result) {
    navigate(result.path);
    showToast({
      title: result.label,
      description: 'Opened from the global search.',
      type: 'info',
    });
  }

  function markNotificationsRead() {
    setNotifications([]);
    setNotificationOpen(false);
    showToast({
      title: 'Notifications cleared',
      description: 'All recent alerts were marked as reviewed.',
      type: 'info',
    });
  }

  function selectLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    setLanguageOpen(false);
    showToast({
      title: `${nextLanguage.label} selected`,
      description: 'This demo keeps the interface copy in English.',
      type: 'info',
    });
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-[82px] border-b border-[rgba(238,241,247,0.95)] bg-[rgba(255,255,255,0.94)] backdrop-blur-xl lg:left-[228px]">
      <div className="mx-auto flex h-full max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-[color:var(--border)] bg-white text-[#20253a] lg:hidden" onClick={() => setSidebarOpen(true)} type="button">
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden md:block" ref={searchRef}>
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aab4c8]" />
            <form onSubmit={handleSearchSubmit}>
              <input
                className="h-12 w-[280px] rounded-full border border-[color:var(--border)] bg-[#f7f8fc] py-2 pl-12 pr-4 text-sm font-semibold text-[#20253a] outline-none placeholder:text-[#b5bdcd] lg:w-[420px]"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search pages"
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
                    No matching workspace pages.
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
                      <div className="rounded-[18px] bg-[#f8fafe] p-3.5" key={item.id}>
                        <p className="text-sm font-extrabold text-[#20253a]">{item.title}</p>
                        <p className="mt-1 text-sm text-[#7d88a3]">{item.message}</p>
                        <p className="mt-2 text-xs text-[#9aa4bb]">{formatRelativeTime(item.createdAt)}</p>
                      </div>
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

          <div className="relative hidden md:block" ref={languageRef}>
            <button className="flex items-center gap-3 rounded-full border border-[color:var(--border)] bg-white px-3.5 py-2.5" onClick={() => setLanguageOpen((value) => !value)} type="button">
              <LanguageFlag />
              <div className="flex items-center gap-2 text-[15px] font-bold text-[#5f6a85]">
                <span>{language.label}</span>
                <ChevronDown className="h-4 w-4 text-[#c0c8d8]" />
              </div>
            </button>

            {languageOpen ? (
              <div className="absolute right-0 mt-4 w-52 rounded-[24px] border border-[color:var(--border)] bg-white p-2 shadow-[0_24px_60px_-38px_rgba(17,24,39,0.24)]">
                {LANGUAGE_OPTIONS.map((option) => (
                  <button
                    className={`flex w-full items-center justify-between rounded-[16px] px-3 py-3 text-left text-sm font-bold transition ${
                      option.code === language.code ? 'bg-[#f5f8ff] text-[#20253a]' : 'text-[#5f6a85] hover:bg-[#f8fafe]'
                    }`}
                    key={option.code}
                    onClick={() => selectLanguage(option)}
                    type="button"
                  >
                    <span>{option.label}</span>
                    {option.code === language.code ? <span className="text-xs font-extrabold text-[#4f80ff]">Active</span> : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative" ref={menuRef}>
            <button className="flex items-center gap-3 rounded-full border border-transparent bg-white px-2.5 py-1.5 sm:px-3.5 sm:py-2" onClick={() => setMenuOpen((value) => !value)} type="button">
              <Avatar name={user?.fullName} size="sm" />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-extrabold text-[#20253a]">{user?.fullName}</p>
                <p className="text-xs font-semibold text-[#8b93a8]">{user?.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#c0c8d8]" />
            </button>

            {menuOpen ? (
              <div className="absolute right-0 mt-4 w-64 rounded-[24px] border border-[color:var(--border)] bg-white p-3 shadow-[0_24px_60px_-38px_rgba(17,24,39,0.24)]">
                <div className="rounded-[18px] bg-[#f8fafe] p-3">
                  <p className="text-sm font-extrabold text-[#20253a]">{user?.fullName}</p>
                  <p className="text-sm text-[#7d88a3]">{user?.email}</p>
                </div>
                <div className="mt-3 space-y-1">
                  <Link className="flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-bold text-[#20253a] transition hover:bg-[#f8fafe]" onClick={() => setMenuOpen(false)} to="/settings">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
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
    </header>
  );
}

export default Topbar;
