import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { UIContext } from '../../context/UIContext';
import { useAuth } from '../../hooks/useAuth';
import { WORKSPACE_NAVIGATION } from '../../utils/workspace';

function SidebarNavGroup({ items, label, onNavigate }) {
  return (
    <div className="mt-8 first:mt-0">
      {label ? <p className="px-8 text-[11px] font-black uppercase tracking-[0.18em] text-[#b5bdcd]">{label}</p> : null}
      <div className="mt-3 space-y-1.5 px-4">
        {items.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[12px] px-4 py-3 text-[14px] font-extrabold transition ${
                isActive
                  ? 'bg-[#4f80ff] text-white shadow-[0_18px_35px_-24px_rgba(79,128,255,0.7)]'
                  : 'text-[#68748f] hover:bg-[#f5f8ff] hover:text-[#20253a]'
              }`
            }
            key={item.path}
            onClick={onNavigate}
            to={item.path}
          >
            <item.icon className="h-[17px] w-[17px]" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { showToast } = useContext(UIContext);
  const SettingsIcon = WORKSPACE_NAVIGATION.footer[0].icon;
  const LogoutIcon = WORKSPACE_NAVIGATION.footer[1].icon;

  async function handleLogout() {
    await logoutUser();
    showToast({
      title: 'Signed out',
      description: 'Your session has been cleared.',
      type: 'info',
    });
    onNavigate?.();
    navigate('/login');
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-8 pb-6 pt-7">
        <Link className="text-[24px] font-black tracking-[-0.04em] text-[#4f80ff]" onClick={onNavigate} to="/dashboard">
          Controllussion
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto border-t border-[color:var(--border)] py-6">
        <SidebarNavGroup items={WORKSPACE_NAVIGATION.primary} onNavigate={onNavigate} />
        <SidebarNavGroup items={WORKSPACE_NAVIGATION.secondary} label="Pages" onNavigate={onNavigate} />
      </div>

      <div className="border-t border-[color:var(--border)] px-4 py-5">
        <div className="space-y-1.5">
          <NavLink
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-[12px] px-4 py-3 text-[14px] font-extrabold transition ${
                isActive
                  ? 'bg-[#f5f8ff] text-[#20253a]'
                  : 'text-[#68748f] hover:bg-[#f5f8ff] hover:text-[#20253a]'
              }`
            }
            onClick={onNavigate}
            to={WORKSPACE_NAVIGATION.footer[0].path}
          >
            <SettingsIcon className="h-[17px] w-[17px]" />
            <span>{WORKSPACE_NAVIGATION.footer[0].label}</span>
          </NavLink>

          <button
            className="flex w-full items-center gap-3 rounded-[12px] px-4 py-3 text-left text-[14px] font-extrabold text-[#68748f] transition hover:bg-[#f5f8ff] hover:text-[#20253a]"
            onClick={handleLogout}
            type="button"
          >
            <LogoutIcon className="h-[17px] w-[17px]" />
            <span>{WORKSPACE_NAVIGATION.footer[1].label}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[228px] border-r border-[color:var(--border)] bg-white lg:block">
        <SidebarContent />
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-slate-900/28" onClick={() => setSidebarOpen(false)} type="button" />
          <aside className="absolute inset-y-0 left-0 w-[18rem] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.3)]">
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
