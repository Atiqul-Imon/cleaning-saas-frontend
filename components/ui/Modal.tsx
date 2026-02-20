'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import FocusTrap from '@/components/accessibility/FocusTrap';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <FocusTrap isActive={isOpen} onEscape={onClose}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 safe-area-top safe-area-bottom"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[var(--gray-900)] bg-opacity-50 backdrop-blur-sm transition-opacity duration-200 ease-out"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          className={cn(
            'relative bg-white rounded-xl shadow-2xl w-full max-h-[90vh] overflow-y-auto',
            sizes[size],
            'animate-scale-in',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-[var(--gray-200)]">
              {title && (
                <h2 id="modal-title" className="text-xl font-bold text-[var(--gray-900)]">
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--gray-400)] hover:text-[var(--gray-600)] hover:bg-[var(--gray-100)] rounded-lg transition-all duration-200 ease-out active:scale-95"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </FocusTrap>
  );
};

export default Modal;
