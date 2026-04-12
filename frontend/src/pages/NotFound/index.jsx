import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#5c84f7] px-4 py-10">
      <div className="absolute inset-0">
        <div className="absolute left-[-8%] top-[12%] h-[280px] w-[280px] rounded-[90px] bg-white/6" />
        <div className="absolute right-[-4%] top-[8%] h-[360px] w-[320px] rounded-[110px] bg-[#6d93ff]/45" />
        <div className="absolute bottom-[-10%] left-[36%] h-[420px] w-[220px] rounded-[110px] bg-[#6a91ff]/35" />
      </div>
      <div className="relative w-full max-w-[420px] rounded-[30px] bg-white px-10 py-12 text-center shadow-[0_30px_90px_-45px_rgba(17,24,39,0.55)]">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-[24px] bg-[linear-gradient(180deg,#f4f8ff_0%,#e6eeff_100%)] text-[42px] font-black tracking-[-0.04em] text-[#5c84f7]">
          404
        </div>
        <h1 className="mt-6 text-2xl font-black tracking-[-0.03em] text-[#20253a]">This page does not exist.</h1>
        <p className="mt-3 text-sm font-semibold leading-7 text-[#8b93a8]">The route you requested was not found. Return to login or jump back into the dashboard.</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#5c84f7] text-sm font-extrabold text-white transition hover:bg-[#4f78ef]" to="/login">
            Open Login
          </Link>
          <Link className="inline-flex h-12 items-center justify-center rounded-[10px] border border-[#dfe5f2] bg-white text-sm font-extrabold text-[#20253a] transition hover:bg-[#f8fafe]" to="/dashboard">
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
