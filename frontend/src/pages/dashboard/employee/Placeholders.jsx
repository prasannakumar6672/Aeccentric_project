import React from 'react';

const PlaceholderPage = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
    <div className="w-16 h-16 rounded-2xl bg-[#2563EB]/10 flex items-center justify-center mb-6">
      <svg className="w-8 h-8 text-[#2563EB]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>
    <h2 className="text-[24px] font-black text-[#0F172A] mb-3">{title}</h2>
    <p className="text-[#64748b] text-[15px] leading-relaxed">
      {description}
    </p>
  </div>
);

export const EmployeeTasks = () => <PlaceholderPage title="My Tasks" description="A Kanban board or list view of your assigned tasks, subtasks, and deadlines." />;
export const EmployeeProjects = () => <PlaceholderPage title="My Projects" description="Detailed views and milestones for the projects you are currently a part of." />;
export const EmployeeProfile = () => <PlaceholderPage title="Employee Profile" description="Your personal information, HR documents, attendance record, and skills." />;
export const EmployeeSettings = () => <PlaceholderPage title="My Settings" description="Personal preferences, notification settings, and password management." />;
