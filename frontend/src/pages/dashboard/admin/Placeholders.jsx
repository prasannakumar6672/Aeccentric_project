import React from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, ListChecks, Settings } from 'lucide-react';

function PlaceholderPage({ title, icon: Icon, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'rgba(79,142,247,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4F8EF7',
        }}
      >
        <Icon size={28} />
      </div>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: -0.5,
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: 14, opacity: 0.6, maxWidth: 400 }}>
        {description}
      </p>
    </motion.div>
  );
}

export function AdminProjects() {
  return (
    <PlaceholderPage
      title="Projects"
      icon={FolderKanban}
      description="Manage all projects, track progress, and allocate resources."
    />
  );
}

export function AdminTasks() {
  return (
    <PlaceholderPage
      title="Tasks"
      icon={ListChecks}
      description="View and manage tasks across all projects and team members."
    />
  );
}

export function AdminSettings() {
  return (
    <PlaceholderPage
      title="Settings"
      icon={Settings}
      description="Configure your dashboard preferences and system settings."
    />
  );
}
