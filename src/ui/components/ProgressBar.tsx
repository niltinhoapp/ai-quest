import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  color?: 'sky' | 'emerald' | 'amber';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, color = 'sky' }) => {
  const clamped = Math.max(0, Math.min(100, value));
  const colorMap = {
    sky: 'bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.6)]',
    emerald: 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.6)]',
    amber: 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className="h-2 w-full bg-slate-900/80 rounded-full overflow-hidden border border-slate-700/50 p-0.5">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorMap[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
