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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,39,0.24)] px-4 py-6 backdrop-blur-[6px]">
      <button aria-label="Close modal" className="absolute inset-0" onClick={onClose} type="button" />
      <div className={`relative w-full ${maxWidth} rounded-[24px] border border-[var(--border)] bg-white p-6 shadow-[0_30px_60px_-34px_rgba(17,24,39,0.38)] sm:p-7`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black tracking-[-0.03em] text-[#1f2a44]">{title}</h3>
            {description ? <p className="mt-1 text-sm leading-6 text-[#6d7890]">{description}</p> : null}
          </div>
          <button className="rounded-[14px] p-2 text-[#8d97ad] transition hover:bg-[#f5f7ff]" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
