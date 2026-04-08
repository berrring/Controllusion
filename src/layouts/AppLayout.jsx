import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

function AppLayout() {
  return (
    <div className="page-shell">
      <Sidebar />
      <div className="min-h-screen lg:pl-[250px]">
        <Topbar />
        <main className="min-h-screen px-4 pb-10 pt-[94px] sm:px-6 lg:px-8 lg:pt-[108px]">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
