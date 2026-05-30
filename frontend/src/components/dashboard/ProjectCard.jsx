import React from 'react';
import { ArrowRight } from 'lucide-react';

const statusClass = (status = '') => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'chip-success';
    case 'on hold':
    case 'on_hold':
      return 'chip-warning';
    case 'completed':
    case 'done':
      return 'chip-info';
    default:
      return 'chip-neutral';
  }
};

const ProjectCard = ({ name, status, progress = 0, members = 0 }) => {
  const boundedProgress = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <div className="dashboard-card p-6 group">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-[15px] font-extrabold leading-snug truncate" style={{ color: 'var(--text-primary)' }}>
            {name}
          </h4>
          <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            Delivery window active
          </p>
        </div>
        <span className={`chip ${statusClass(status)}`}>{status}</span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>
          <span>Progress</span>
          <span className="tabular-nums text-blue-600 dark:text-blue-400">{boundedProgress}%</span>
        </div>
        <div className="progress-bar h-2">
          <div className="progress-bar-fill info" style={{ width: `${boundedProgress}%` }} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: 'var(--border-default)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(Number(members) || 0, 3) }).map((_, i) => (
              <div key={i} className="avatar h-7 w-7 border-2" style={{ background: 'var(--surface-L2)', borderColor: 'var(--surface-L1)', color: 'var(--text-secondary)' }}>
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span className="truncate text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            {members} contributors
          </span>
        </div>
        <div className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white" style={{ background: 'var(--surface-L2)', color: 'var(--text-secondary)' }}>
          <ArrowRight size={15} />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
