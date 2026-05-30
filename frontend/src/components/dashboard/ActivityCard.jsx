import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const ActivityCard = ({ title = 'Activity', activities = [] }) => {
  return (
    <div className="dashboard-card h-full">
      <div className="card-header">
        <div>
          <h3 className="card-title">{title}</h3>
          <p className="card-subtitle">Recent workspace updates</p>
        </div>
        <button className="dash-btn-secondary !min-h-9 !w-9 !p-0" aria-label="Activity actions">
          <MoreHorizontal size={15} />
        </button>
      </div>

      <div className="card-body space-y-5">
        {activities.length === 0 ? (
          <div className="py-10 text-center text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            No activity yet.
          </div>
        ) : (
          activities.map((activity, idx) => (
            <div key={`${activity.action}-${idx}`} className="relative flex gap-4">
              {idx < activities.length - 1 && <span className="timeline-connector" />}
              <div className="relative z-10 mt-1 h-7 w-7 rounded-full border flex items-center justify-center" style={{ background: 'var(--surface-L1)', borderColor: 'var(--border-default)' }}>
                <span className="live-dot" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                  {activity.action}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="dash-chip chip-neutral">{activity.target}</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
