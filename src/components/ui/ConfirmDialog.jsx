import Button from './Button';
import Modal from './Modal';

function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  confirmVariant = 'danger',
  isLoading = false,
}) {
  return (
    <Modal description={description} onClose={onClose} open={open} title={title}>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button onClick={onClose} variant="secondary">
          {cancelLabel}
        </Button>
        <Button isLoading={isLoading} onClick={onConfirm} variant={confirmVariant}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
