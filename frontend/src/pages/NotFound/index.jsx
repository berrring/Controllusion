import { Grid2x2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f6f8ff] px-4 py-10">
      <div className="pointer-events-none absolute left-[-10%] top-[4%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0)_72%)]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-8%] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0)_72%)]" />

      <div className="relative w-full max-w-[800px] rounded-[28px] border border-[var(--border)] bg-white px-8 py-10 text-center shadow-[0_30px_70px_-42px_rgba(17,24,39,0.24)] sm:px-12 sm:py-12">
        <div className="relative mx-auto h-[260px] w-full max-w-[360px]">
          <p className="absolute left-1/2 top-0 -translate-x-1/2 text-[112px] font-black tracking-[-0.08em] text-[#4c42e8] opacity-95">
            404
          </p>
          <div className="absolute bottom-0 left-1/2 h-[200px] w-[320px] -translate-x-1/2 overflow-hidden rounded-[18px] bg-[linear-gradient(180deg,#2c2d30_0%,#141416_26%,#1d1f24_100%)] shadow-[0_24px_50px_-26px_rgba(15,23,42,0.6)]">
            <div className="absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0)_100%)]" />
            <div className="absolute left-8 top-[72px] h-11 w-11 rounded-full bg-[radial-gradient(circle,#8bb6ff_0%,#4f80ff_100%)] opacity-90" />
            <div className="absolute left-10 top-[114px] h-20 w-24 rotate-[-28deg] bg-[linear-gradient(135deg,#5d8de8_0%,#3b5ea8_100%)] opacity-95 [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />
            <div className="absolute left-20 top-12 h-24 w-20 rotate-[12deg] bg-[linear-gradient(135deg,rgba(156,194,255,0.8)_0%,rgba(76,128,255,0.18)_100%)] [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />
            <div className="absolute left-28 top-8 h-36 w-56 rotate-[6deg] bg-[linear-gradient(135deg,#cfe2ff_0%,#79a9ff_45%,#4f80ff_100%)] [clip-path:polygon(18%_0%,100%_42%,40%_100%,0%_62%)]" />
            <div className="absolute right-10 top-20 h-10 w-10 rounded-full bg-[radial-gradient(circle,#8bb6ff_0%,#4f80ff_100%)] opacity-85" />
            <div className="absolute right-16 top-[120px] h-12 w-16 rotate-[18deg] bg-[linear-gradient(135deg,#274169_0%,#132338_100%)] [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />
          </div>
        </div>

        <h1 className="mx-auto max-w-[520px] text-[36px] font-black tracking-[-0.05em] text-[#1f2a44] sm:text-[44px]">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-4 max-w-[520px] text-sm leading-8 text-[#6d7890] sm:text-base">
          It appears this link is broken or the page has been moved to a new coordinate within the enterprise hub.
          Let&apos;s get you back to a familiar surface.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#4c42e8_0%,#5a49f4_100%)] px-6 text-sm font-bold text-white shadow-[0_18px_30px_-20px_rgba(76,66,232,0.85)]"
            to="/dashboard"
          >
            <Grid2x2 className="h-4 w-4" />
            Return to Dashboard
          </Link>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-[12px] border border-[var(--border)] px-6 text-sm font-semibold text-[#1f2a44]"
            to="/login"
          >
            Open Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
