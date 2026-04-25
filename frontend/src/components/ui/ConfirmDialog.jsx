import { AlertTriangle } from 'lucide-react';
import Button from './Button';

function ConfirmDialog({
  open,
  title = 'Delete Customer?',
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  confirmVariant = 'danger',
  isLoading = false,
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(82,92,110,0.52)] px-4 py-6 backdrop-blur-[2px]">
      <button aria-label="Close dialog" className="absolute inset-0" onClick={onClose} type="button" />
      <div className="relative w-full max-w-[280px] rounded-[8px] bg-white px-5 py-6 text-center shadow-[0_28px_80px_-34px_rgba(15,23,42,0.55)]">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#ffe6e5] text-[#d92d2d]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-[16px] font-black tracking-[-0.03em] text-[#17223b]">{title}</h3>
        <p className="mx-auto mt-2 max-w-[220px] text-[12px] leading-5 text-[#67758e]">
          {description ||
            'This action cannot be undone. Are you sure you want to delete this record? All associated deals and history will be permanently removed.'}
        </p>
        <div className="mt-5 space-y-2">
          <Button className="min-h-[34px] rounded-[6px] bg-[#c81e1e] text-xs hover:bg-[#b91c1c]" fullWidth isLoading={isLoading} onClick={onConfirm} variant={confirmVariant}>
            {confirmLabel}
          </Button>
          <button className="h-8 w-full rounded-[6px] text-xs font-semibold text-[#61708a] hover:bg-[#f5f7ff]" onClick={onClose} type="button">
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
