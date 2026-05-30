import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, Users, FolderKanban, BarChart3,
  Settings, Plus, FileText, Bot, Calendar, Shield, Zap,
  ArrowRight, Command, CornerDownLeft
} from 'lucide-react';

const ACTIONS = [
  { id: 'dash', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation', path: '/dashboard/admin' },
  { id: 'emp', label: 'Manage Employees', icon: Users, category: 'Navigation', path: '/dashboard/admin/employees' },
  { id: 'proj', label: 'View Projects', icon: FolderKanban, category: 'Navigation', path: '/dashboard/admin/projects' },
  { id: 'analytics', label: 'Open Analytics', icon: BarChart3, category: 'Navigation', path: '/dashboard/admin/analytics' },
  { id: 'settings', label: 'Platform Settings', icon: Settings, category: 'Navigation', path: '/dashboard/admin/settings' },
  { id: 'add-emp', label: 'Add New Employee', icon: Plus, category: 'Quick Actions', path: '/dashboard/admin/employees/create' },
  { id: 'new-proj', label: 'Create Project', icon: Plus, category: 'Quick Actions' },
  { id: 'report', label: 'Generate AI Report', icon: FileText, category: 'AI Features' },
  { id: 'ai-summary', label: 'AI Daily Summary', icon: Bot, category: 'AI Features' },
  { id: 'schedule', label: 'Schedule Meeting', icon: Calendar, category: 'Quick Actions' },
  { id: 'security', label: 'Security Audit', icon: Shield, category: 'System' },
  { id: 'deploy', label: 'Deploy Update', icon: Zap, category: 'System' },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const filtered = ACTIONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const grouped = filtered.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {});

  const flatFiltered = filtered;

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeAction = useCallback((action) => {
    onClose();
    if (action.path) {
      navigate(action.path);
    }
  }, [navigate, onClose]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatFiltered[selectedIndex]) {
      e.preventDefault();
      executeAction(flatFiltered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [flatFiltered, selectedIndex, executeAction, onClose]);

  // scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Palette */}
          <motion.div
            className="relative z-10 w-full max-w-[560px] mx-4"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white dark:bg-[#0d1526] border border-gray-200 dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/[0.06]">
                <Search size={18} className="text-gray-400 dark:text-gray-500 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search commands..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-[15px] font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 dark:bg-white/[0.06] text-[11px] font-bold text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-white/[0.08]">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[340px] overflow-y-auto py-2 custom-scrollbar">
                {flatFiltered.length === 0 ? (
                  <div className="px-5 py-10 text-center">
                    <p className="text-gray-400 dark:text-gray-600 text-sm font-medium">No results found for "{query}"</p>
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, actions]) => (
                    <div key={category}>
                      <div className="px-5 pt-3 pb-1">
                        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-gray-400 dark:text-gray-600">
                          {category}
                        </span>
                      </div>
                      {actions.map((action) => {
                        const globalIndex = flatFiltered.findIndex(a => a.id === action.id);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            data-index={globalIndex}
                            onClick={() => executeAction(action)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors duration-100 ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-100 dark:bg-white/[0.06] text-gray-500 dark:text-gray-400'
                            }`}>
                              <Icon size={15} />
                            </div>
                            <span className="flex-1 text-[14px] font-semibold">{action.label}</span>
                            {isSelected && (
                              <CornerDownLeft size={14} className="text-gray-400 dark:text-gray-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.02]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-600 font-medium">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/[0.06] text-[10px] font-bold border border-gray-200 dark:border-white/[0.08]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-600 font-medium">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/[0.06] text-[10px] font-bold border border-gray-200 dark:border-white/[0.08]">↵</kbd>
                    Select
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">{flatFiltered.length} commands</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
