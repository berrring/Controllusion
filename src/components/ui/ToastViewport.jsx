import { useContext } from 'react';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { UIContext } from '../../context/UIContext';

const toneConfig = {
  success: {
    icon: CheckCircle2,
    className: 'border-emerald-200 bg-white text-slate-800',
    iconClassName: 'text-emerald-600',
  },
  error: {
    icon: XCircle,
    className: 'border-rose-200 bg-white text-slate-800',
    iconClassName: 'text-rose-600',
  },
  info: {
    icon: Info,
    className: 'border-brand-200 bg-white text-slate-800',
    iconClassName: 'text-brand-600',
  },
};

function ToastViewport() {
  const { toasts, dismissToast } = useContext(UIContext);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[60] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const tone = toneConfig[toast.type] || toneConfig.success;
        const Icon = tone.icon;

        return (
          <div
            className={`pointer-events-auto rounded-2xl border px-4 py-4 shadow-panel ${tone.className}`}
            key={toast.id}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 ${tone.iconClassName}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-sm text-muted">{toast.description}</p> : null}
              </div>
              <button className="rounded-lg p-1 text-muted transition hover:bg-slate-100" onClick={() => dismissToast(toast.id)} type="button">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToastViewport;
