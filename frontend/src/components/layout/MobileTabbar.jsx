import { Grid2x2, LayoutDashboard, MoreHorizontal, Table2, Users } from 'lucide-react';
import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UIContext } from '../../context/UIContext';

const primaryItems = [
  {
    to: '/dashboard',
    label: 'Dash',
    icon: LayoutDashboard,
  },
  {
    to: '/leads',
    label: 'Leads',
    icon: Users,
  },
  {
    to: '/customers',
    label: 'Accounts',
    icon: Table2,
  },
];

function MobileNavLink({ item }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex min-w-[62px] flex-1 flex-col items-center gap-1.5 rounded-[14px] px-1.5 py-2 text-[9px] font-black uppercase tracking-[0.08em] transition ${
          isActive ? 'bg-[#4c42e8] text-white shadow-[0_14px_28px_-20px_rgba(76,66,232,0.85)]' : 'text-[#7e89a3]'
        }`
      }
      to={item.to}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
    </NavLink>
  );
}

function MobileTabbar() {
  const location = useLocation();
  const { setSidebarOpen } = useContext(UIContext);
  const isMoreActive =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/support') ||
    location.pathname.startsWith('/search') ||
    location.pathname.startsWith('/activity');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e7edf8] bg-[rgba(255,255,255,0.96)] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 shadow-[0_-16px_36px_-30px_rgba(31,42,68,0.28)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[520px] items-center gap-2">
        {primaryItems.map((item) => (
          <MobileNavLink item={item} key={item.to} />
        ))}
        <button
          className={`flex min-w-[62px] flex-1 flex-col items-center gap-1.5 rounded-[14px] px-1.5 py-2 text-[9px] font-black uppercase tracking-[0.08em] transition ${
            isMoreActive ? 'bg-[#eef2ff] text-[#4c42e8]' : 'text-[#7e89a3]'
          }`}
          onClick={() => setSidebarOpen(true)}
          type="button"
        >
          {isMoreActive ? <Grid2x2 className="h-4 w-4" /> : <MoreHorizontal className="h-4 w-4" />}
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}

export default MobileTabbar;
