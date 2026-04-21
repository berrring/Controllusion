import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import Button from '../ui/Button';

function AccessDenied() {
  return (
    <div className="relative flex min-h-[78vh] items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute left-[-8%] top-[8%] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(76,66,232,0.16)_0%,rgba(76,66,232,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-6%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(111,179,255,0.18)_0%,rgba(111,179,255,0)_72%)]" />

      <div className="relative w-full max-w-xl rounded-[28px] border border-[var(--border)] bg-white px-8 py-10 text-center shadow-[0_30px_60px_-34px_rgba(17,24,39,0.22)]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[linear-gradient(135deg,#eef2ff_0%,#dbe5ff_100%)] text-[#4c42e8]">
          <ShieldX className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-[34px] font-black tracking-[-0.04em] text-[#1f2a44]">Administrator Access Only</h1>
        <p className="mt-3 text-sm leading-7 text-[#6d7890] sm:text-base">
          This route is restricted to admin accounts. Return to the dashboard or switch to an account with elevated permissions.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/dashboard">
            <Button>Return to dashboard</Button>
          </Link>
          <Link to="/">
            <Button variant="secondary">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;
