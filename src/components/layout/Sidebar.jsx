import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import { APP_NAV_ITEMS, ADMIN_NAV_ITEM } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { UIContext } from '../../context/UIContext';

function SidebarSection({ items, label, onNavigate }) {
  return (
    <div className="mt-8 first:mt-0">
      <p className="section-label px-4">{label}</p>
      <div className="mt-3 space-y-1.5">
        {items.map((item) => (
          <NavLink
            className={({ isActive }) =>
              `mx-3 flex items-center gap-3 rounded-[14px] px-4 py-3 text-sm font-bold transition ${
                isActive
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'text-slate-500 hover:bg-[rgba(79,128,255,0.08)] hover:text-slate-900'
              }`
            }
            key={item.to}
            onClick={onNavigate}
            to={item.to}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function SidebarContent({ onNavigate }) {
  const { user } = useAuth();
  const mainItems = APP_NAV_ITEMS.filter((item) => item.to === '/dashboard');
  const pageItems = APP_NAV_ITEMS.filter((item) => item.to !== '/dashboard');
  const adminItems = user?.role === 'Admin' ? [ADMIN_NAV_ITEM] : [];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-[color:var(--border)] px-7 py-7">
        <Link className="flex items-center gap-3" onClick={onNavigate} to="/">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-brand-50 text-sm font-extrabold text-brand-700">
            C
          </div>
          <div>
            <p className="text-[17px] font-extrabold tracking-tight text-brand-600">Controllusion</p>
            <p className="text-xs font-semibold text-muted">Revenue workspace</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-5">
        <SidebarSection items={mainItems} label="Main" onNavigate={onNavigate} />
        <SidebarSection items={pageItems} label="Pages" onNavigate={onNavigate} />
        {adminItems.length ? <SidebarSection items={adminItems} label="System" onNavigate={onNavigate} /> : null}
      </div>

      <div className="mx-3 mb-4 rounded-[22px] bg-[linear-gradient(180deg,#f8fbff_0%,#eff4ff_100%)] p-4">
        <p className="text-sm font-extrabold text-[var(--text)]">Daily CRM flow</p>
        <p className="mt-2 text-xs leading-6 text-muted">
          Dashboard, customer records, profile settings, and admin access all use the same Figma-inspired shell.
        </p>
      </div>
    </div>
  );
}

function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] border-r border-[color:var(--border)] bg-white/92 backdrop-blur lg:block">
        <SidebarContent />
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-slate-900/24" onClick={() => setSidebarOpen(false)} type="button" />
          <aside className="absolute inset-y-0 left-0 w-[18rem] bg-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.28)]">
            <div className="flex justify-end px-4 pt-4">
              <button
                className="rounded-[14px] p-2 text-muted transition hover:bg-slate-100"
                onClick={() => setSidebarOpen(false)}
                type="button"
              >
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
