import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  ShieldAlert,
  Cpu,
  Compass,
  User,
  Terminal,
  Activity,
  Gauge,
  ShieldCheck,
  Database
} from 'lucide-react';
import api from '../../../services/api';

export default function AICopilot() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard/ai-copilot');
      if (res.data && res.data.success) {
        setPrompts(res.data.prompts);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch AI records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [prompts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userPrompt = input;
    setInput('');
    setSending(true);

    // Optimistically insert temp card
    const tempId = Date.now().toString();
    setPrompts((prev) => [
      { _id: tempId, prompt: userPrompt, response: 'Thinking...', createdAt: new Date() },
      ...prev,
    ]);

    try {
      const res = await api.post('/dashboard/ai-copilot', { prompt: userPrompt });
      if (res.data && res.data.success) {
        setPrompts((prev) =>
          prev.map((p) => (p._id === tempId ? res.data.prompt : p))
        );
      }
    } catch (err) {
      console.error(err);
      setPrompts((prev) => prev.filter((p) => p._id !== tempId));
      setError('Failed to process prompt. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Cpu size={13} className="animate-pulse" /> Neural Core Integration
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2 mt-1">
            AI Workforce <span className="text-blue-600 dark:text-blue-400">Copilot</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1.5">
            Futuristic operations command assistant powered by advanced agentic workflows.
          </p>
        </div>

        <button
          onClick={fetchPrompts}
          className="flex items-center gap-2 px-5 py-3 bg-gray-150 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-700 dark:text-[#EDF0FA] rounded-xl text-xs font-bold transition-all border border-gray-250 dark:border-white/[0.06] cursor-pointer shadow-sm"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Sync Core Logs
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Interactive Chat Widget */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="glass-card p-6 flex flex-col justify-between min-h-[580px] max-h-[660px] relative overflow-visible border border-gray-200 dark:border-white/[0.05] shadow-sm bg-white/60 dark:bg-white/[0.005] backdrop-blur-md rounded-3xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-sm animate-pulse">
                  <Terminal size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Workspace Operations LLM</h3>
                  <p className="text-[10px] text-emerald-500 font-extrabold flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Agent Active
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-[9px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/10 tracking-wide uppercase select-none">
                GPT-4o Enterprise
              </span>
            </div>

            {/* Chat Messages Timeline */}
            <div className="flex-1 overflow-y-auto custom-scrollbar my-4 pr-1 flex flex-col-reverse gap-5">
              <div ref={scrollRef} />
              
              <AnimatePresence>
                {prompts.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="flex flex-col gap-3"
                  >
                    {/* User Prompt */}
                    <div className="flex justify-end">
                      <div className="flex flex-col items-end gap-1 max-w-[85%]">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm px-4.5 py-3 text-xs font-semibold leading-relaxed shadow-md shadow-blue-600/10 border border-blue-500/20">
                          {item.prompt}
                        </div>
                        <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1.5 mr-1 flex items-center gap-1">
                          <User size={9} /> You
                        </span>
                      </div>
                    </div>

                    {/* Agent Response */}
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-slate-50/50 dark:bg-white/[0.015] border border-gray-250/70 dark:border-white/[0.05] text-gray-800 dark:text-[#EDF0FA] rounded-2xl rounded-tl-sm p-5 text-[12px] leading-relaxed shadow-sm relative overflow-hidden flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-gray-150/70 dark:border-white/[0.03] pb-2">
                          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            <div className="w-5.5 h-5.5 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/10">
                              <Bot size={11} />
                            </div>
                            <span>AI Copilot</span>
                          </div>
                          <span className="text-[9px] text-gray-405 dark:text-slate-500 font-bold uppercase">
                            {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                        
                        {item.response === 'Thinking...' ? (
                          <div className="flex items-center gap-2.5 text-gray-400 dark:text-slate-400 font-bold py-2">
                            <RefreshCw size={12} className="animate-spin text-blue-500" />
                            Thinking and analyzing database records...
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-slate-350 font-semibold animate-fadeIn" style={{ wordBreak: 'break-word' }}>
                            {item.response}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {prompts.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4 animate-fadeIn">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 animate-float border border-blue-500/20 shadow-lg shadow-blue-500/5">
                    <Bot size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black dark:text-white">AI Command Copilot Ready</h4>
                    <p className="text-[11px] text-gray-400 dark:text-[#8892B8] max-w-[320px] mx-auto mt-1 leading-relaxed font-bold">
                      Ask me to analyze performance indexes, security diagnostic logs, or generate announcements.
                    </p>
                  </div>
                  
                  {/* Starter Quick Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md w-full mt-4">
                    {[
                      "Analyze last month's engineering performance vs design team.",
                      "What are the main security risks identified this week?",
                    ].map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => setInput(starter)}
                        className="p-3 rounded-2xl border border-gray-255 dark:border-white/[0.04] bg-white/40 dark:bg-white/[0.005] hover:border-blue-500/30 text-[10.5px] font-extrabold text-gray-500 dark:text-slate-450 hover:text-blue-500 dark:hover:text-blue-400 text-center transition-all cursor-pointer truncate shadow-sm"
                      >
                        "{starter}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <RefreshCw className="animate-spin text-blue-500 w-7 h-7" />
                  <p className="text-[11px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Hydrating Neural Engine...</p>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative mt-2 group/form">
              <span className="absolute inset-y-0 left-0 pl-4.5 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none group-focus-within/form:text-blue-500 transition-colors">
                <Terminal size={14} />
              </span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot to analyze team efficiency, check logs, or draft messages..."
                className="w-full text-[13px] pl-12 pr-14 py-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] hover:border-blue-500/30 text-gray-900 dark:text-[#EDF0FA] placeholder-gray-400/50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 shadow-sm font-semibold"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:-translate-y-0.6 active:translate-y-0.1"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Info Panels */}
        <div className="flex flex-col gap-5">
          
          {/* Suggested Scenarios */}
          <div className="glass-card p-6 border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md flex flex-col gap-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2 pb-2.5 border-b border-gray-100 dark:border-white/[0.04]">
              <Sparkles size={14} className="text-blue-500" />
              Suggested Scenarios
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Workforce Audit', query: "Analyze last month's engineering performance vs design team.", icon: Compass, bg: 'rgba(26, 86, 219, 0.08)', text: 'text-blue-600 dark:text-blue-400' },
                { label: 'Security Review', query: 'What are the main security risks identified this week?', icon: ShieldAlert, bg: 'rgba(244, 63, 94, 0.08)', text: 'text-rose-600 dark:text-rose-450' },
                { label: 'Communication Draft', query: 'Draft an email announcing the Q3 strategy review meeting.', icon: Send, bg: 'rgba(245, 158, 11, 0.08)', text: 'text-amber-600 dark:text-amber-400' },
              ].map((rec, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput(rec.query)}
                  className="w-full text-left p-3.5 rounded-2xl bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.04] text-xs hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/[0.01] hover:-translate-y-0.5 transition-all duration-200 text-gray-700 dark:text-slate-350 group flex items-start gap-3 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105" style={{ backgroundColor: rec.bg }}>
                    <rec.icon size={13} className={rec.text} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-extrabold text-gray-900 dark:text-white text-[12px] group-hover:text-blue-500 transition-colors">{rec.label}</div>
                    <div className="truncate text-gray-400 dark:text-slate-500 text-[10.5px] mt-0.5 font-semibold">{rec.query}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Model Statistics / Diagnostics */}
          <div className="glass-card p-6 border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md flex flex-col gap-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2 pb-2.5 border-b border-gray-100 dark:border-white/[0.04]">
              <Activity size={14} className="text-blue-500 animate-pulse" />
              Agent Diagnostics
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-wider block">Neural Link</span>
                <div className="text-xs font-black text-emerald-500 mt-1 flex items-center gap-1.5 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Healthy
                </div>
              </div>
              
              <div>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-wider block">Diagnostics</span>
                <div className="text-xs font-black text-gray-900 dark:text-white mt-1 uppercase flex items-center gap-1.5">
                  <Database size={11} className="text-blue-500" /> Linked
                </div>
              </div>

              <div>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-wider block">Avg Latency</span>
                <div className="text-xs font-black text-gray-900 dark:text-white mt-1 uppercase">820 ms</div>
              </div>

              <div>
                <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-wider block">Safety Rating</span>
                <div className="text-xs font-black text-blue-500 mt-1 uppercase flex items-center gap-1">
                  <ShieldCheck size={11} /> 99.8%
                </div>
              </div>
            </div>

            {/* Sparkline Latency Wave */}
            <div className="mt-2 pt-3 border-t border-gray-100 dark:border-white/[0.04]">
              <span className="text-[9px] text-gray-400 dark:text-slate-500 uppercase font-black tracking-wider block mb-2">Live Response Wave</span>
              <div className="h-8 w-full bg-slate-50/50 dark:bg-white/[0.01] rounded-xl border border-gray-200/50 dark:border-white/[0.04] p-1.5 flex items-center">
                <svg className="w-full h-5" viewBox="0 0 160 20">
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    points="0,15 15,12 30,17 45,6 60,18 75,4 90,14 105,8 120,16 135,5 150,11 160,8"
                    className="stroke-dasharray-[500] stroke-dashoffset-[0] animate-[shimmer_2.5s_infinite_linear]"
                  />
                </svg>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 dark:text-slate-500 leading-relaxed font-semibold">
              The neural copilot dynamically indexes secure backend collections (Finance, Security, Employees) applying real-time context parsers to resolve questions.
            </p>
          </div>

        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

    </div>
  );
}
