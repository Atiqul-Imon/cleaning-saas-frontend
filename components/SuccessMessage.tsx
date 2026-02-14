'use client';

import { useEffect, useState } from 'react';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
  duration?: number;
}

export default function SuccessMessage({ 
  message, 
  onClose,
  duration = 5000 
}: SuccessMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-green-100 border-2 border-green-400 text-green-900 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 max-w-md">
        <svg className="w-6 h-6 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-bold flex-1">{message}</p>
        {onClose && (
          <button
            onClick={() => {
              setVisible(false);
              onClose();
            }}
            className="text-green-700 hover:text-green-900 font-bold"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}





