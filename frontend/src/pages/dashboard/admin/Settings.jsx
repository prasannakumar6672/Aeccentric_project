import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, RefreshCw, Save, Shield, Check, Terminal, Sparkles } from 'lucide-react';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

const fadeUp  = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } };
const stagger = { animate: { transition: { staggerChildren: 0.05 } } };

export default function Settings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { theme } = useTheme();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/settings');
      if (res.data && res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await api.put('/dashboard/settings', { settings });
      if (res.data && res.data.success) {
        setSettings(res.data.settings);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Group settings
  const getSettingValue = (key, defaultVal = '') => {
    const s = settings.find((item) => item.key === key);
    return s ? s.value : defaultVal;
  };

  const selectCls = "w-full text-sm px-4 h-11 rounded-xl bg-[var(--surface-L2)] border border-[var(--border-default)] text-gray-950 dark:text-slate-100 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500/80 transition-all cursor-pointer";

  return (
    <motion.div 
      variants={stagger} 
      initial="initial" 
      animate="animate"
      className="flex flex-col gap-6 md:gap-8 text-gray-900 dark:text-slate-100"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">System Preferences</span>
            <span className="inline-flex items-center gap-0.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/[0.1] border border-blue-150/40 text-[9px] font-bold text-blue-600 dark:text-blue-400">
              <Sparkles size={8} /> Production-grade
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2">
            System & Dashboard <span className="text-blue-600 dark:text-blue-400">Settings</span>
            <SettingsIcon className="w-6 h-6 text-blue-500 shrink-0" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-405 mt-1">
            Configure MFA authorization rules, global workforce templates, and dark theme defaults.
          </p>
        </div>

        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-L1)] hover:bg-[var(--surface-L2)] text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-[var(--border-default)] hover:border-[var(--border-hover)] cursor-pointer shadow-sm"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Sync settings
        </button>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 h-[300px]">
          <RefreshCw size={24} className="text-blue-500 animate-spin" />
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">Scanning settings catalog...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main settings options */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* General Settings */}
            <motion.div variants={fadeUp} className="dashboard-card p-6 md:p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold text-gray-955 dark:text-white leading-tight font-syne">
                  Workspace Preferences
                </h3>
                <p className="text-[11.5px] text-gray-450 dark:text-slate-500 mt-1">Configure baseline variables for workforce administration.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                    Default Onboarded Role
                  </label>
                  <select
                    value={getSettingValue('default_role', 'employee')}
                    onChange={(e) => handleChange('default_role', e.target.value)}
                    className={selectCls}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR Specialist</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                    System Default Theme
                  </label>
                  <select
                    value={getSettingValue('theme', 'dark')}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className={selectCls}
                  >
                    <option value="dark">Enterprise Dark Mode</option>
                    <option value="light">Classic Light Mode</option>
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Security Config */}
            <motion.div variants={fadeUp} className="dashboard-card p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-4 mb-1">
                <Shield size={16} className="text-blue-500" />
                <h3 className="text-base font-bold text-gray-955 dark:text-white font-syne leading-tight">
                  Security & Compliance
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/[0.01] border border-[var(--border-default)] hover:border-blue-500/20 transition-all">
                  <div className="pr-4">
                    <h4 className="text-xs font-bold text-gray-905 dark:text-white">Require Multi-Factor Auth (MFA)</h4>
                    <p className="text-[10px] text-gray-450 dark:text-slate-500 mt-1 leading-normal max-w-md">
                      Forces all administrative workforce accounts to configure secure One-Time Passwords (OTP).
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={getSettingValue('mfa_enabled', 'false') === 'true'}
                    onChange={(e) => handleChange('mfa_enabled', e.target.checked ? 'true' : 'false')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-500/80 cursor-pointer shadow-sm"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/[0.01] border border-[var(--border-default)] hover:border-blue-500/20 transition-all">
                  <div className="pr-4">
                    <h4 className="text-xs font-bold text-gray-905 dark:text-white">Enable Automated DB Backups</h4>
                    <p className="text-[10px] text-gray-450 dark:text-slate-500 mt-1 leading-normal max-w-md">
                      Runs database snapshots every 24 hours storing them in secure encrypted storage buckets.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={getSettingValue('auto_backup', 'false') === 'true'}
                    onChange={(e) => handleChange('auto_backup', e.target.checked ? 'true' : 'false')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-500/80 cursor-pointer shadow-sm"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Action & Info panel */}
          <div className="flex flex-col gap-6 col-span-1">
            <motion.div variants={fadeUp} className="dashboard-card p-6 md:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-2 border-b border-[var(--border-default)] pb-4">
                <Terminal size={15} className="text-blue-500" />
                <h3 className="text-base font-bold text-gray-955 dark:text-white font-syne leading-tight">
                  Control Actions
                </h3>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? 'Saving Preferences...' : 'Apply System Changes'}
              </button>

              {saveSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 leading-relaxed">
                  <Check size={14} className="shrink-0" />
                  Settings committed to MongoDB successfully.
                </div>
              )}
            </motion.div>

            <motion.div variants={fadeUp} className="dashboard-card p-6 text-xs text-gray-450 dark:text-slate-500 leading-relaxed font-medium">
              Applying system settings alters authentication, database backups, and display options globally across the AECCENTRIC workforce portal. Ensure values comply with security guidelines.
            </motion.div>
          </div>
        </form>
      )}
    </motion.div>
  );
}
