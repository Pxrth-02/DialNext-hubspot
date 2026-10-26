import React from 'react';
import type { ConnectionStatus, SyncStatus } from '../types';

interface StatusBadgeProps {
  status: ConnectionStatus | SyncStatus;
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  ConnectionStatus | SyncStatus,
  { bg: string; text: string; dot: string; defaultLabel: string }
> = {
  disconnected: {
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-400',
    dot: 'bg-rose-500',
    defaultLabel: 'Disconnected',
  },
  connecting: {
    bg: 'bg-amber-500/10 border-amber-500/20',
    text: 'text-amber-400',
    dot: 'bg-amber-500 animate-pulse',
    defaultLabel: 'Connecting...',
  },
  connected: {
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
    defaultLabel: 'Connected',
  },
  error: {
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-400',
    dot: 'bg-rose-500',
    defaultLabel: 'Connection Error',
  },
  idle: {
    bg: 'bg-slate-500/10 border-slate-500/20',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    defaultLabel: 'Idle',
  },
  in_progress: {
    bg: 'bg-blue-500/10 border-blue-500/20',
    text: 'text-blue-400',
    dot: 'bg-blue-500 animate-ping',
    defaultLabel: 'Syncing',
  },
  completed: {
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
    defaultLabel: 'Synced',
  },
  failed: {
    bg: 'bg-rose-500/10 border-rose-500/20',
    text: 'text-rose-400',
    dot: 'bg-rose-500',
    defaultLabel: 'Sync Failed',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
}) => {
  const config = statusConfig[status] || statusConfig.idle;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${sizeClasses} transition-all`}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
};
