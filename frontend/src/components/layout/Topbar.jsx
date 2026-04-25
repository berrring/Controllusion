import { useContext, useEffect, useState } from 'react';
import { Bell, CircleHelp, Grid2x2, Search, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { getUnreadNotifications, markAllNotificationsRead } from '../../services/storage';
import { APP_BRAND } from '../../utils/constants';

const topLinks = [
  { label: 'Reports', to: '/analytics' },
  { label: 'Pipeline', to: '/customers' },
  { label: 'Team', to: '/admin' },
];

function Topbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { setSidebarOpen, showToast } = useContext(UIContext);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (location.pathname === '/search') {
      setQuery(new URLSearchParams(location.search).get('q') || '');
    }
  }, [location.pathname, location.search]);

  function openNotifications() {
    const unread = getUnreadNotifications();
    if (unread.length) {
      markAllNotificationsRead();
    }
    showToast({
      title: unread.length ? 'Notifications cleared' : 'No new notifications',
      description: unread.length ? `${unread.length} updates marked as read.` : 'You are fully caught up.',
      type: 'info',
    });
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
            {topLinks.map((item) => (
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

          <div className="flex items-center gap-3 text-[#52627b]">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f3f7ff]" onClick={openNotifications} type="button">
              <Bell className="h-4 w-4" />
            </button>
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

      <div className="mx-auto flex h-full max-w-[680px] items-center justify-between px-4 lg:hidden">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef2ff] text-[#4c42e8]"
          onClick={() => setSidebarOpen(true)}
          type="button"
        >
          <Grid2x2 className="h-4 w-4" />
        </button>

        <p className="text-sm font-black tracking-[-0.03em] text-[#17223b]">{APP_BRAND.name}</p>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef2ff] text-[#4c42e8]"
          onClick={openNotifications}
          type="button"
        >
          <CircleHelp className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
