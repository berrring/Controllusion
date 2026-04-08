import { useContext, useState } from 'react';
import { Bell, ChevronDown, LogOut, Menu, Search, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';
import Avatar from '../common/Avatar';
import Button from '../ui/Button';
import { formatRelativeTime } from '../../utils/formatters';
import { getDatabase } from '../../services/storage';

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
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const { setSidebarOpen, showToast } = useContext(UIContext);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notifications = getDatabase().notifications || [];

  async function handleLogout() {
    await logoutUser();
    showToast({
      title: 'Signed out',
      description: 'Your session has been cleared.',
      type: 'info',
    });
    navigate('/login');
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-[82px] border-b border-white/70 bg-[rgba(250,251,255,0.9)] backdrop-blur-xl lg:left-[250px]">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="field-shell flex h-11 w-11 items-center justify-center text-slate-700 lg:hidden" onClick={() => setSidebarOpen(true)} type="button">
            <Menu className="h-5 w-5 text-slate-700" />
          </button>

          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-[330px] rounded-full border border-[color:var(--border)] bg-white py-2 pl-12 pr-4 text-sm font-semibold text-[var(--text)] shadow-[0_18px_40px_-36px_rgba(17,24,39,0.2)] placeholder:text-slate-400 lg:w-[390px]"
              placeholder="Search"
              type="text"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <button className="field-shell relative flex h-11 w-11 items-center justify-center text-brand-500 transition hover:bg-brand-50" onClick={() => setNotificationOpen((value) => !value)} type="button">
              <Bell className="h-5 w-5 fill-current" />
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {Math.min(notifications.length, 9)}
              </span>
            </button>

            {notificationOpen ? (
              <div className="surface-panel absolute right-0 mt-4 w-80 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-extrabold text-[var(--text)]">Notifications</p>
                  <span className="text-xs font-semibold text-muted">{notifications.length} recent</span>
                </div>
                <div className="space-y-3">
                  {notifications.slice(0, 4).map((item) => (
                    <div className="rounded-[18px] bg-[color:var(--surface-muted)] p-3.5" key={item.id}>
                      <p className="text-sm font-extrabold text-[var(--text)]">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.message}</p>
                      <p className="mt-2 text-xs text-soft">{formatRelativeTime(item.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <button className="field-shell hidden items-center gap-3 px-3.5 py-2.5 md:flex" type="button">
            <LanguageFlag />
            <div className="flex items-center gap-2 text-[15px] font-bold text-slate-700">
              <span>English</span>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </button>

          <div className="relative">
            <button className="field-shell flex items-center gap-3 px-2.5 py-1.5 sm:px-3.5 sm:py-2" onClick={() => setMenuOpen((value) => !value)} type="button">
              <Avatar name={user?.fullName} size="sm" />
              <div className="hidden text-left sm:block">
                <p className="text-sm font-extrabold text-slate-700">{user?.fullName}</p>
                <p className="text-xs font-semibold text-muted">{user?.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {menuOpen ? (
              <div className="surface-panel absolute right-0 mt-4 w-64 p-3">
                <div className="rounded-[18px] bg-[color:var(--surface-muted)] p-3">
                  <p className="text-sm font-extrabold text-[var(--text)]">{user?.fullName}</p>
                  <p className="text-sm text-muted">{user?.email}</p>
                </div>
                <div className="mt-3 space-y-1">
                  <Link className="flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-slate-50" to="/profile">
                    <Avatar name={user?.fullName} size="sm" />
                    Profile settings
                  </Link>
                  {user?.role === 'Admin' ? (
                    <Link className="flex items-center gap-3 rounded-[16px] px-3 py-3 text-sm font-bold text-[var(--text)] transition hover:bg-slate-50" to="/admin">
                      <Shield className="h-4 w-4" />
                      Admin panel
                    </Link>
                  ) : null}
                  <Button className="w-full justify-start" onClick={handleLogout} variant="ghost">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
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
