import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, RefreshCw, DollarSign, TrendingUp, TrendingDown, CheckCircle, ChevronDown, Cpu, Sparkles, SlidersHorizontal, Terminal } from 'lucide-react';
import api from '../../../services/api';

export default function Finance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [category, setCategory] = useState('Payroll');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard/finance');
      if (res.data && res.data.success) {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch finance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!description.trim() || !amount || creating) return;

    setCreating(true);
    try {
      const res = await api.post('/dashboard/finance', {
        category,
        description,
        amount: parseFloat(amount),
        type,
      });
      if (res.data && res.data.success) {
        setRecords((prev) => [res.data.transaction, ...prev]);
        setDescription('');
        setAmount('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to log transaction.');
    } finally {
      setCreating(false);
    }
  };

  // Computations
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    records.forEach((r) => {
      if (r.type === 'income') income += r.amount;
      else expenses += r.amount;
    });
    return { income, expenses, balance: income - expenses };
  }, [records]);

  const categoryTones = {
    Payroll: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10',
    Software: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10',
    Consulting: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/10',
    Office: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10',
    Equipment: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10',
    Services: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10',
  };

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Cpu size={13} className="animate-pulse" /> Ledger command deck
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2 mt-1">
            Finance & <span className="text-blue-600 dark:text-blue-400">Transactions</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1.5">
            Real-time monthly financial tracking, resource allocation budgets, and billing status logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchRecords}
            className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-500 dark:text-[#EDF0FA] border border-gray-250 dark:border-white/[0.06] rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <Plus size={14} />
            Log Transaction
          </button>
        </div>
      </div>

      {/* Metrics Cards Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          ['Total Cash Inflow', loading ? '...' : `₹${stats.income.toLocaleString('en-IN')}`, TrendingUp, 'emerald', 'rgba(14, 159, 110, 0.08)', 'text-emerald-600 dark:text-emerald-450'],
          ['Total Outflow (Expenses)', loading ? '...' : `₹${stats.expenses.toLocaleString('en-IN')}`, TrendingDown, 'rose', 'rgba(239, 68, 68, 0.08)', 'text-rose-600 dark:text-rose-400'],
          ['Operational Net Balance', loading ? '...' : `₹${stats.balance.toLocaleString('en-IN')}`, DollarSign, 'blue', 'rgba(26, 86, 219, 0.08)', 'text-blue-600 dark:text-blue-400'],
        ].map(([label, value, Icon, tone, bg, textCls]) => (
          <div key={label} className="kpi-card relative">
            <div className="flex items-start justify-between">
              <span className="kpi-label">{label}</span>
              <div className="kpi-icon" style={{ backgroundColor: bg }}>
                <Icon size={16} className={textCls} />
              </div>
            </div>
            <div className="kpi-number mt-4 tabular-nums text-gray-950 dark:text-white leading-none">{value}</div>
          </div>
        ))}
      </div>

      {/* Add Transaction Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-8 border border-gray-200 dark:border-white/[0.06] rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md">
              <div className="pb-4 border-b border-gray-100 dark:border-white/[0.04] mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Log Expense or Revenue Entry</h3>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">Log operational costs, vendor invoices, or internal resource changes.</p>
                </div>
                <SlidersHorizontal size={14} className="text-gray-400" />
              </div>

              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Category</label>
                  <div className="relative group">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-800 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer appearance-none"
                    >
                      <option value="Payroll">Payroll</option>
                      <option value="Software">Software</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Office">Office</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Services">Services</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
                      <ChevronDown size={14} />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Description</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <Terminal size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AWS server cloud bill"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full text-xs pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Amount (₹ INR)</label>
                  <div className="relative group">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <DollarSign size={14} />
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 4800"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-mono font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Flow Type</label>
                  <div className="relative group">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full text-xs py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-800 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer appearance-none"
                    >
                      <option value="expense">Expense (Outflow)</option>
                      <option value="income">Income (Inflow)</option>
                    </select>
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
                      <ChevronDown size={14} />
                    </span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-4 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-slate-350 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-blue-600/10"
                  >
                    {creating ? 'Saving...' : 'Log Entry'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ledger Table */}
      <div className="glass-card border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-white/[0.04]">
          <h2 className="text-sm font-black text-gray-900 dark:text-white">Transaction Balance Ledger</h2>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">List of all historical expenses, invoices, and core logs.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <RefreshCw size={24} className="text-blue-500 animate-spin" />
            <p className="text-xs font-bold text-gray-500">Retrieving operational balance book...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CreditCard className="text-gray-400 w-10 h-10 mb-2 opacity-50 animate-pulse" />
            <p className="text-sm font-bold text-gray-500">No transactions posted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="data-table w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Description</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Category</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Flow Type</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Amount</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none">Status</th>
                  <th className="p-4 font-black uppercase text-[10px] text-gray-400 dark:text-[#5A6282] tracking-wider select-none text-right">Logged Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/50 dark:divide-white/[0.02]">
                {records.map((item, index) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.015] transition-colors">
                    <td className="p-4 font-bold text-gray-900 dark:text-white text-xs">{item.description}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${categoryTones[item.category] || categoryTones.Services}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider ${
                          item.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className={`p-4 font-mono font-black text-[12.5px] ${item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {item.type === 'income' ? '+' : '-'}₹{item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 border border-emerald-500/10 bg-emerald-500/10 px-2.5 py-0.5 rounded-full uppercase">
                        <CheckCircle size={10} />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-[11px] font-bold text-gray-400 dark:text-slate-600">
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
