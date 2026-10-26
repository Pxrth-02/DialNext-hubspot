import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  ...props
}) => {
  return (
    <div
      className={`glass-panel rounded-xl p-5 shadow-sm transition-all duration-200 ${
        glow ? 'border-orange-500/30 glow-orange' : 'hover:border-slate-700/80'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
