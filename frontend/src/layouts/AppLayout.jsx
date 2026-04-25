import { Outlet } from 'react-router-dom';
import MobileTabbar from '../components/layout/MobileTabbar';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

function AppLayout() {
  return (
    <div className="page-shell min-h-screen">
      <Sidebar />
      <div className="min-h-screen lg:pl-[176px]">
        <Topbar />
        <main className="min-h-screen px-4 pb-[96px] pt-[72px] sm:px-6 lg:px-7 lg:pb-12 lg:pt-[74px]">
          <div className="mx-auto w-full max-w-[1480px]">
            <Outlet />
          </div>
        </main>
        <MobileTabbar />
      </div>
    </div>
  );
}

export default AppLayout;
