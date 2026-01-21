'use client';

import { useEffect, useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  const colors = {
    success: 'border-green-400/30 bg-green-500/20',
    error: 'border-red-400/30 bg-red-500/20',
    info: 'border-blue-400/30 bg-blue-500/20'
  };

  return (
    <div className={`backdrop-blur-lg rounded-xl p-4 border ${colors[toast.type]} animate-in slide-in-from-right duration-300`}>
      <div className="flex items-center gap-3">
        <span className="text-lg">{icons[toast.type]}</span>
        <p className="text-white text-sm font-medium flex-1">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    (window as any).showToast = addToast;
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}