import { useContext } from 'react';
import { Bell, Grid2x2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { getUnreadNotifications, markAllNotificationsRead } from '../../services/storage';

function Topbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSidebarOpen, showToast } = useContext(UIContext);

  function openNotifications() {
    const unread = getUnreadNotifications();
    if (unread.length) {
      markAllNotificationsRead();
    }
    showToast({
      title: unread.length ? 'Notifications cleared' : 'No new notifications',
      description: unread.length
        ? `${unread.length} notification${unread.length > 1 ? 's were' : ' was'} marked as read.`
        : 'You are fully caught up.',
      type: 'info',
    });
  }

  function openQuickLauncher() {
    navigate('/dashboard');
    showToast({
      title: 'Quick launcher',
      description: 'Use the sidebar or bottom navigation to jump between CRM sections.',
      type: 'info',
    });
  }

  return (
    <header className="app-topbar fixed left-0 right-0 top-0 z-20 h-[64px] lg:left-[176px]">
      <div className="mx-auto hidden h-full max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:flex lg:px-7">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#eef2ff] text-[#4c42e8]">
            <Grid2x2 className="h-4 w-4" />
          </div>

          <div className="relative w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[420px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a3adc3]" />
            <input
              className="h-[38px] w-full rounded-[10px] border border-transparent bg-[#eef2ff] pl-10 pr-4 text-sm text-[#1f2a44] outline-none placeholder:text-[#a3adc3]"
              placeholder="Search customers, orders..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#707b94] transition hover:bg-[#eef2ff] hover:text-[#1f2a44]"
            onClick={openNotifications}
            type="button"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#707b94] transition hover:bg-[#eef2ff] hover:text-[#1f2a44]"
            onClick={openQuickLauncher}
            type="button"
          >
            <Grid2x2 className="h-4 w-4" />
          </button>
          <Avatar name={user?.fullName} size="sm" src={user?.avatarUrl} />
        </div>
      </div>

      <div className="mx-auto flex h-full max-w-[1320px] items-center justify-between px-4 lg:hidden">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eef2ff] text-[#4c42e8]"
          onClick={() => setSidebarOpen(true)}
          type="button"
        >
          <Grid2x2 className="h-4 w-4" />
        </button>

        <p className="text-sm font-black tracking-[-0.03em] text-[#1f2a44]">Controllusion</p>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#eef2ff] text-[#4c42e8]"
          onClick={openNotifications}
          type="button"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
