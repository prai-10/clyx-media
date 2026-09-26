import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
}

/** Right-hand slide-over panel used for editing a card. Rendered inside `.adm` so it keeps the admin theme. */
export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  footer,
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer: ReactNode;
  children: ReactNode;
}) {
  useEscape(onClose);
  const host = document.querySelector('.adm');
  if (!open || !host) return null;
  return createPortal(
    <div className="adm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="adm-drawer" role="dialog" aria-modal="true" aria-label={title}>
        <header className="adm-drawer-head">
          <div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="adm-drawer-body">{children}</div>
        <footer className="adm-drawer-foot">{footer}</footer>
      </aside>
    </div>,
    host,
  );
}

/** Small centred confirmation dialog for destructive actions. */
export function Confirm({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEscape(onCancel);
  const host = document.querySelector('.adm');
  if (!open || !host) return null;
  return createPortal(
    <div className="adm-overlay is-center" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="adm-confirm" role="alertdialog" aria-modal="true" aria-label={title}>
        <span className="adm-confirm-icon">
          <AlertTriangle size={20} />
        </span>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="adm-confirm-actions">
          <button type="button" className="adm-btn is-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="adm-btn is-danger" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    host,
  );
}

export function Empty({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="adm-empty">
      <span className="adm-empty-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
