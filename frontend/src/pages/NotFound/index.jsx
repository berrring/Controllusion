import { Image, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9ff] px-4 py-10 font-ui">
      <div className="w-full max-w-[360px] text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[18px] bg-[#f1f3ff] text-[#ded9ff]">
          <Image className="h-10 w-10" />
        </div>
        <h1 className="mt-9 text-[28px] font-black tracking-[-0.05em] text-[#14213d]">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-[300px] text-[12px] leading-6 text-[#52627b]">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable in the CRM.
        </p>
        <Link className="mt-7 inline-flex h-10 items-center justify-center gap-2 rounded-[7px] bg-[#4c42e8] px-5 text-[12px] font-bold text-white" to="/dashboard">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Return to Dashboard
        </Link>
        <Link className="mt-5 block text-[11px] font-bold text-[#4c42e8]" to="/settings">
          Contact System Administrator
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
