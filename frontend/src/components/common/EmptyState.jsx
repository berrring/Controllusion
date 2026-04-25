import { FileText, Plus, Upload } from 'lucide-react';
import Button from '../ui/Button';

function EmptyState({ title = 'No customers found yet', description, actionLabel, onAction }) {
  return (
    <div className="flex min-h-[520px] items-center justify-center rounded-[12px] bg-transparent p-8 text-center">
      <div className="w-full max-w-[460px]">
        <div className="relative mx-auto h-[132px] w-[132px] rotate-3 rounded-[18px] bg-white shadow-[0_24px_60px_-42px_rgba(31,42,68,0.28)]">
          <div className="absolute left-8 top-7 flex h-16 w-16 items-center justify-center rounded-full bg-[#ece9ff] text-[#b5a9ff]">
            <FileText className="h-8 w-8" />
          </div>
          <div className="absolute -right-5 top-5 flex h-12 w-12 -rotate-12 items-center justify-center rounded-[10px] bg-white text-[#70809a] shadow-[0_18px_40px_-30px_rgba(31,42,68,0.35)]">
            <Upload className="h-5 w-5" />
          </div>
          <div className="absolute bottom-7 left-7 h-5 w-20 rounded-[6px] bg-[#e4eaff]" />
        </div>

        <h3 className="mt-10 text-[26px] font-black tracking-[-0.04em] text-[#17223b]">{title}</h3>
        <p className="mx-auto mt-3 max-w-[360px] text-[14px] leading-7 text-[#67758e]">
          {description ||
            'Your customer list is empty. Add your first customer to start tracking interactions, managing deals, and building relationships.'}
        </p>
        {actionLabel ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button onClick={onAction}>
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#4c42e8]" type="button">
              <Upload className="h-4 w-4" />
              Import from CSV
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default EmptyState;
