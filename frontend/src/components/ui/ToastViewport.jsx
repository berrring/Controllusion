import { useContext } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { UIContext } from '../../context/UIContext';

const toneConfig = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

function ToastViewport() {
  const { toasts, dismissToast } = useContext(UIContext);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-[330px] flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = toneConfig[toast.type] || CheckCircle2;

        return (
          <div
            className="pointer-events-auto rounded-[8px] bg-[#1f2a44] px-4 py-3 text-white shadow-[0_20px_44px_-24px_rgba(15,23,42,0.65)]"
            key={toast.id}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-[#c7d2fe]" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{toast.title}</p>
                {toast.description ? <p className="mt-0.5 truncate text-[11px] text-[#b9c4d8]">{toast.description}</p> : null}
              </div>
              <button className="rounded p-1 text-[#9aa8bf] transition hover:bg-white/10 hover:text-white" onClick={() => dismissToast(toast.id)} type="button">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToastViewport;
