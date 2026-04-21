import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CircleHelp, LogOut, X } from 'lucide-react';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { addActivityEntry } from '../../services/storage';
import { ADMIN_NAV_ITEM, APP_NAV_ITEMS } from '../../utils/constants';

function SidebarNavGroup({ items, onNavigate }) {
  return (
    <div className="mt-6 space-y-2 px-4">
      {items.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13px] font-medium transition ${
              isActive
                ? 'bg-[linear-gradient(135deg,#4c42e8_0%,#5b49f1_100%)] text-white shadow-[0_14px_28px_-18px_rgba(76,66,232,0.9)]'
                : 'text-[#6e7a92] hover:bg-[#f4f7ff] hover:text-[#1f2a44]'
            }`
          }
          key={item.to}
          onClick={onNavigate}
          to={item.to}
        >
          <item.icon className="h-[17px] w-[17px]" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const { logoutUser, user } = useAuth();
  const { showToast } = useContext(UIContext);
  const navigationItems =
    user?.role === 'Admin' ? [APP_NAV_ITEMS[0], APP_NAV_ITEMS[1], ADMIN_NAV_ITEM, ...APP_NAV_ITEMS.slice(2)] : APP_NAV_ITEMS;

  async function handleLogout() {
    addActivityEntry({
      title: 'Signed out',
      description: 'The current session was ended from the sidebar.',
    });
    await logoutUser();
    showToast({
      title: 'Signed out',
      description: 'Your session has been cleared.',
      type: 'info',
    });
    onNavigate?.();
    navigate('/login');
  }

  function openHelpCenter() {
    onNavigate?.();
    showToast({
      title: 'Help Center',
      description: 'Opening product overview and help resources.',
      type: 'info',
    });
    navigate('/');
    window.setTimeout(() => {
      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }

  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,#f5f7ff_0%,#eef2ff_100%)]">
      <div className="px-4 pb-5 pt-5">
        <Link className="flex items-center gap-3" onClick={onNavigate} to="/dashboard">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#4c42e8_0%,#5b49f1_100%)] text-sm font-bold text-white">
            C
          </span>
          <span>
            <span className="block text-[15px] font-bold text-[#1f2a44]">Controllusion</span>
            <span className="block text-[11px] font-medium text-[#8a95ad]">Enterprise Hub</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto border-t border-[rgba(222,229,246,0.9)] py-4">
        <SidebarNavGroup items={navigationItems} onNavigate={onNavigate} />
      </div>

      <div className="space-y-1 border-t border-[rgba(222,229,246,0.9)] px-4 py-5">
        <button
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13px] font-medium text-[#8a95ad] transition hover:bg-[#f4f7ff] hover:text-[#1f2a44]"
          onClick={openHelpCenter}
          type="button"
        >
          <CircleHelp className="h-4 w-4" />
          <span>Help Center</span>
        </button>
        <button
          className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13px] font-medium text-[#8a95ad] transition hover:bg-[#f4f7ff] hover:text-[#1f2a44]"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[176px] border-r border-[rgba(222,229,246,0.9)] bg-[#f5f7ff] lg:block">
        <SidebarContent />
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-slate-900/28" onClick={() => setSidebarOpen(false)} type="button" />
          <aside className="absolute inset-y-0 left-0 w-[17rem] bg-[#f5f7ff] shadow-[0_24px_60px_-30px_rgba(15,23,42,0.3)]">
            <div className="flex justify-end px-4 pt-4">
              <button className="rounded-[14px] p-2 text-[#7d88a3] transition hover:bg-slate-100" onClick={() => setSidebarOpen(false)} type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
