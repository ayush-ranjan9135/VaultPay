import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Card } from './Card';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '500px'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <Card className="modal-content" noPadding style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
          
          {(title || onClose) && (
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {title && <h2 className="text-h3" style={{ margin: 0 }}>{title}</h2>}
              {onClose && (
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  <X size={24} />
                </button>
              )}
            </div>
          )}

          <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
            {children}
          </div>

          {footer && (
            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-subtle)' }}>
              {footer}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
