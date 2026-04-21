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
        <main className="min-h-screen px-4 pb-[96px] pt-[74px] sm:px-6 lg:px-7 lg:pb-10 lg:pt-[96px]">
          <div className="mx-auto w-full max-w-[1320px]">
            <Outlet />
          </div>
        </main>
        <MobileTabbar />
      </div>
    </div>
  );
}

export default AppLayout;
