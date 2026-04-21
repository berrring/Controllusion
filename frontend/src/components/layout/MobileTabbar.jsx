import { Grid2x2, LayoutDashboard, MoreHorizontal, UserRound, Users } from 'lucide-react';
import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { UIContext } from '../../context/UIContext';

const primaryItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/customers',
    label: 'Customers',
    icon: Users,
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: UserRound,
  },
];

function MobileNavLink({ item }) {
  return (
    <NavLink
      className={({ isActive }) =>
        `flex min-w-[72px] flex-1 flex-col items-center gap-1.5 rounded-[14px] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
          isActive
            ? 'bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] text-white shadow-[0_14px_28px_-20px_rgba(76,66,232,0.85)]'
            : 'text-[#7e89a3]'
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
  const isMoreActive = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[rgba(229,234,246,0.96)] bg-[rgba(255,255,255,0.96)] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 shadow-[0_-16px_36px_-30px_rgba(31,42,68,0.28)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[520px] items-center gap-2">
        {primaryItems.map((item) => (
          <MobileNavLink item={item} key={item.to} />
        ))}
        <button
          className={`flex min-w-[72px] flex-1 flex-col items-center gap-1.5 rounded-[14px] px-2 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition ${
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
