import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const alertConfig = {
  info: {
    icon: Info,
    container: 'bg-blue-500/10 border-blue-500/20 text-blue-200',
    iconColor: 'text-blue-400',
  },
  success: {
    icon: CheckCircle2,
    container: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
    iconColor: 'text-emerald-400',
  },
  warning: {
    icon: AlertTriangle,
    container: 'bg-amber-500/10 border-amber-500/20 text-amber-200',
    iconColor: 'text-amber-400',
  },
  error: {
    icon: AlertCircle,
    container: 'bg-rose-500/10 border-rose-500/20 text-rose-200',
    iconColor: 'text-rose-400',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-xl border ${config.container} ${className}`}
    >
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${config.iconColor}`} aria-hidden="true" />
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <p className="text-slate-300 leading-relaxed">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
