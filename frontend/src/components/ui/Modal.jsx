import { useEffect } from 'react';
import { X } from 'lucide-react';

function Modal({ children, onClose, open, title, description, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/22 px-4 py-6 backdrop-blur-[4px]">
      <div className={`surface-panel w-full ${maxWidth} rounded-[28px] p-6 sm:p-7`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-[var(--text)]">{title}</h3>
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          <button className="rounded-[14px] p-2 text-muted transition hover:bg-slate-100" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
      <button aria-label="Close modal" className="absolute inset-0 -z-10" onClick={onClose} type="button" />
    </div>
  );
}

export default Modal;
