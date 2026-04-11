import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

function AppLayout() {
  return (
    <div className="page-shell min-h-screen">
      <Sidebar />
      <div className="min-h-screen lg:pl-[228px]">
        <Topbar />
        <main className="min-h-screen px-4 pb-10 pt-[92px] sm:px-6 lg:px-8 lg:pt-[104px]">
          <div className="mx-auto w-full max-w-[1460px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
