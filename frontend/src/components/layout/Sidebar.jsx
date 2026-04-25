import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { CircleHelp, LogOut, Plus, X } from 'lucide-react';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { addActivityEntry } from '../../services/storage';
import { ADMIN_NAV_ITEM, APP_BRAND, APP_NAV_ITEMS } from '../../utils/constants';

function SidebarNavGroup({ items, onNavigate }) {
  return (
    <div className="space-y-1.5 px-4">
      {items.map((item) => (
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-[7px] px-3 py-2 text-[12px] font-semibold transition ${
              isActive
                ? 'bg-white text-[#4c42e8] shadow-[0_8px_18px_-16px_rgba(31,42,68,0.35)]'
                : 'text-[#61708a] hover:bg-white/70 hover:text-[#17223b]'
            }`
          }
          key={item.to}
          onClick={onNavigate}
          to={item.to}
        >
          <item.icon className="h-3.5 w-3.5" />
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
  const navigationItems = user?.role === 'Admin' ? [...APP_NAV_ITEMS, ADMIN_NAV_ITEM] : APP_NAV_ITEMS;

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
    navigate('/support');
  }

  return (
    <div className="flex h-full flex-col bg-[#eef4ff]">
      <div className="px-4 pb-5 pt-5">
        <Link className="flex items-center gap-3" onClick={onNavigate} to="/dashboard">
          <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#4c42e8] text-[13px] font-black text-white shadow-[0_12px_24px_-16px_rgba(76,66,232,0.9)]">
            C
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-black leading-4 tracking-[-0.02em] text-[#14213d]">
              {APP_BRAND.name}
            </span>
            <span className="block text-[10px] font-semibold text-[#70809a]">{APP_BRAND.subtitle}</span>
          </span>
        </Link>
      </div>

      <div className="px-4 pb-5">
        <Link
          className="flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#4c42e8] text-[12px] font-bold text-white shadow-[0_14px_24px_-18px_rgba(76,66,232,0.9)] transition hover:bg-[#4339d6]"
          onClick={onNavigate}
          to="/customers/create"
        >
          <Plus className="h-3.5 w-3.5" />
          New Entry
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        <SidebarNavGroup items={navigationItems} onNavigate={onNavigate} />
      </div>

      <div className="mx-4 mb-4 border-t border-[#dde7f8] pt-4">
        <button
          className="flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-[12px] font-semibold text-[#61708a] transition hover:bg-white/70 hover:text-[#17223b]"
          onClick={openHelpCenter}
          type="button"
        >
          <CircleHelp className="h-3.5 w-3.5" />
          <span>Support</span>
        </button>
        <button
          className="mt-1 flex w-full items-center gap-3 rounded-[7px] px-3 py-2 text-left text-[12px] font-semibold text-[#61708a] transition hover:bg-white/70 hover:text-[#17223b]"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-3.5 w-3.5" />
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
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[176px] border-r border-[#dbe6f7] bg-[#eef4ff] lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-40 bg-[rgba(15,23,42,0.32)] backdrop-blur-sm transition lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button aria-label="Close sidebar" className="absolute inset-0" onClick={() => setSidebarOpen(false)} type="button" />
        <aside
          className={`absolute inset-y-0 left-0 w-[280px] overflow-hidden bg-[#eef4ff] shadow-[0_30px_60px_-30px_rgba(15,23,42,0.45)] transition-transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <button
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-[#61708a]"
            onClick={() => setSidebarOpen(false)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </aside>
      </div>
    </>
  );
}

export default Sidebar;
