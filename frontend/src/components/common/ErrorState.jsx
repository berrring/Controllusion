import { AlertCircle, RotateCw } from 'lucide-react';
import Button from '../ui/Button';

function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="flex min-h-[540px] items-center justify-center rounded-[12px] bg-transparent p-6">
      <div className="w-full max-w-[420px] rounded-[14px] bg-white px-9 py-10 text-center shadow-[0_28px_70px_-44px_rgba(31,42,68,0.35)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff0ee] text-[#ef4e4e] ring-8 ring-[#fff6f4]">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="mt-7 text-[26px] font-black tracking-[-0.04em] text-[#17223b]">{title}</h3>
        <p className="mx-auto mt-4 max-w-[310px] text-[14px] leading-7 text-[#67758e]">
          {description || 'We encountered an unexpected issue while trying to process your request. Please try refreshing the page.'}
        </p>
        {onRetry ? (
          <div className="mt-7">
            <Button onClick={onRetry}>
              <RotateCw className="h-4 w-4" />
              Refresh Page
            </Button>
          </div>
        ) : null}
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#ec6a60]">ERR_500_INT</p>
      </div>
    </div>
  );
}

export default ErrorState;
