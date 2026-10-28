import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'purple';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue', icon }) => {
  const styles = {
    blue: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
    green: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    amber: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    purple: 'bg-purple-950/80 text-purple-300 border-purple-500/40'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${styles[variant]}`}>
      {icon}
      {children}
    </span>
  );
};
