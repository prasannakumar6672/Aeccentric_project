import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Circle,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Send,
  Smile,
  UsersRound,
  Sparkles,
  Mail,
  Activity,
  Terminal,
  User,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import api from '../../../services/api';

const initials = (name = 'U') => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const relativeTime = (date) => {
  if (!date) return 'now';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
};

export default function EmployeeMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState({ recipient: 'Operations', subject: '', content: '' });
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Fetch current user name
  const userStr = localStorage.getItem('ems_user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const userDisplayName = currentUser?.fullName || 'Employee User';

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/dashboard/messages');
      const nextMessages = res.data.messages || [];
      setMessages(nextMessages);
      // Select the first conversation's subject as default
      if (nextMessages.length > 0) {
        setSelectedSubject((current) => current || nextMessages[0]?.subject || '');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Unable to load internal messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Group messages into conversations by subject
  const conversations = useMemo(() => {
    const groups = {};
    messages.forEach((msg) => {
      if (!msg.subject) return;
      const key = msg.subject.trim();
      const lowerKey = key.toLowerCase();
      if (!groups[lowerKey]) {
        groups[lowerKey] = {
          subject: key,
          messages: [],
          latest: msg
        };
      }
      groups[lowerKey].messages.push(msg);
    });

    // Sort conversations by the latest message's createdAt DESC
    return Object.values(groups).sort((a, b) => 
      new Date(b.latest.createdAt).getTime() - new Date(a.latest.createdAt).getTime()
    );
  }, [messages]);

  // Filter conversations based on query
  const filteredConversations = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((c) => (
      c.subject?.toLowerCase().includes(term)
      || c.latest.sender?.toLowerCase().includes(term)
      || c.messages.some(m => m.content?.toLowerCase().includes(term))
    ));
  }, [conversations, query]);

  const selectedConversation = useMemo(() => {
    if (!conversations.length) return null;
    return conversations.find((c) => c.subject === selectedSubject) || filteredConversations[0] || conversations[0];
  }, [conversations, selectedSubject, filteredConversations]);

  const unread = messages.filter((message) => !message.read).length;

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!draft.subject.trim() || !draft.content.trim()) return;
    setSending(true);
    setError('');
    try {
      const payload = {
        ...draft,
        sender: userDisplayName,
        avatar: userDisplayName[0]?.toUpperCase() || 'E'
      };
      const res = await api.post('/dashboard/messages', payload);
      if (res.data.success) {
        setMessages((prev) => [res.data.message, ...prev]);
        setSelectedSubject(res.data.message.subject);
        setDraft({ recipient: 'Operations', subject: '', content: '' });
        setComposerOpen(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send message.');
    } finally {
      setSending(false);
    }
  };

  const sendReply = async (event) => {
    event.preventDefault();
    if (!replyText.trim() || !selectedConversation) return;
    setSending(true);
    setError('');
    try {
      const payload = {
        recipient: selectedConversation.latest.sender === userDisplayName 
          ? selectedConversation.latest.recipient 
          : selectedConversation.latest.sender,
        subject: selectedConversation.subject,
        content: replyText,
        sender: userDisplayName,
        avatar: userDisplayName[0]?.toUpperCase() || 'E'
      };
      const res = await api.post('/dashboard/messages', payload);
      if (res.data.success) {
        setMessages((prev) => [res.data.message, ...prev]);
        setSelectedSubject(res.data.message.subject);
        setReplyText('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send response.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dash-page flex flex-col gap-6 md:gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Sparkles size={13} className="animate-pulse" /> Workspace Messaging
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2 mt-1">
            Team <span className="text-blue-600 dark:text-blue-400">Communication</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1.5">
            Discuss sprint milestones, post direct messages, and coordinate directly with administrators.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-700 dark:text-[#EDF0FA] rounded-xl text-xs font-bold transition-all border border-gray-250 dark:border-white/[0.06] cursor-pointer shadow-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setComposerOpen((value) => !value)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <Plus size={14} />
            Send Broadcast
          </button>
        </div>
      </div>

      {/* QUICK STATS STRIP */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          ['Total Conversations', conversations.length, MessageSquare, 'rgba(26, 86, 219, 0.08)', 'text-blue-600 dark:text-blue-400'],
          ['Unread Updates', unread, Mail, 'rgba(244, 63, 94, 0.08)', 'text-rose-600 dark:text-rose-450'],
          ['Active Colleagues', Math.max(2, Math.min(conversations.length + 1, 8)), Activity, 'rgba(14, 159, 110, 0.08)', 'text-emerald-600 dark:text-emerald-450'],
        ].map(([label, value, Icon, bg, textCls]) => (
          <div key={label} className="glass-card flex min-h-[100px] flex-col justify-between p-5">
            <div className="flex items-start justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-[#8892B8]">{label}</span>
              <div className="grid h-8 w-8 place-items-center rounded-xl" style={{ backgroundColor: bg }}>
                <Icon size={15} className={textCls} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{value}</div>
          </div>
        ))}
      </div>

      {/* COMPOSER BROADCAST FORM */}
      <AnimatePresence>
        {composerOpen && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onSubmit={sendMessage}
            className="glass-card p-8 border border-gray-200 dark:border-white/[0.06] rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md overflow-hidden"
          >
            <div className="pb-4 border-b border-gray-100 dark:border-white/[0.04] mb-6">
              <h2 className="text-sm font-black text-gray-900 dark:text-white">Broadcast New Message</h2>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">Send an internal update announcement to a department team or direct channels.</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-[260px_1fr]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Recipient team</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                    <UsersRound size={14} />
                  </span>
                  <input
                    className="w-full text-xs pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm"
                    placeholder="Recipient team, e.g. Operations"
                    value={draft.recipient}
                    onChange={(e) => setDraft({ ...draft, recipient: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Subject Header</label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                    <Terminal size={14} />
                  </span>
                  <input
                    className="w-full text-xs pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm"
                    required
                    placeholder="Provide a clear, commanding subject headline"
                    value={draft.subject}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1 font-bold">Message Content</label>
                <textarea
                  className="w-full text-xs p-4.5 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm min-h-[120px]"
                  required
                  placeholder="Draft operational content details, instructions, or meeting retro targets..."
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-white/[0.04]">
              <div className="flex items-center gap-2 text-gray-400">
                <button type="button" className="rounded-xl p-2.5 hover:bg-gray-100 dark:hover:bg-white/[0.05] text-gray-400 hover:text-blue-500 transition-colors" title="Attachment placeholder">
                  <Paperclip size={15} />
                </button>
                <button type="button" className="rounded-xl p-2.5 hover:bg-gray-100 dark:hover:bg-white/[0.05] text-gray-400 hover:text-blue-500 transition-colors" title="Emoji placeholder">
                  <Smile size={15} />
                </button>
              </div>
              
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 dark:text-slate-355 hover:bg-gray-100 dark:hover:bg-white/[0.05] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" disabled={sending} className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shadow-md shadow-blue-600/10 disabled:opacity-50">
                  <Send size={13} className="inline mr-1" />
                  {sending ? 'Sending...' : 'Send Broadcast'}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="shrink-0 w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* TWO-COLUMN INBOX WORKSPACE */}
      <div className="grid h-[calc(100vh-280px)] min-h-[680px] gap-6 xl:grid-cols-[380px_1fr] items-stretch w-full">
        
        {/* Left Sidebar Conversations List */}
        <aside className="glass-card border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md flex h-full flex-col p-0 overflow-hidden">
          <div className="border-b border-gray-100 p-4 dark:border-white/[0.04]">
            <div className="relative block group">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                <Search size={14} />
              </span>
              <input 
                className="w-full text-xs pl-10 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-900 dark:text-[#EDF0FA] placeholder-gray-450 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search team inbox..." 
              />
            </div>
          </div>

          <div className="custom-scrollbar min-h-0 flex-1 space-y-2.5 overflow-y-auto p-4">
            {loading ? (
              <div className="space-y-3">
                <div className="w-full h-16 bg-gray-100 dark:bg-white/[0.03] rounded-2xl animate-pulse" />
                <div className="w-full h-16 bg-gray-100 dark:bg-white/[0.03] rounded-2xl animate-pulse" />
                <div className="w-full h-16 bg-gray-100 dark:bg-white/[0.03] rounded-2xl animate-pulse" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-xs font-bold text-gray-400 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.005] my-4">
                No conversations found
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const active = selectedConversation?.subject === conv.subject;
                return (
                  <button
                    key={conv.subject}
                    onClick={() => setSelectedSubject(conv.subject)}
                    className={`w-full rounded-2xl border p-4.5 text-left transition flex items-start gap-3.5 cursor-pointer relative ${
                      active 
                        ? 'border-blue-500/25 bg-blue-500/[0.04] dark:border-blue-500/25 dark:bg-blue-500/[0.02] shadow-sm' 
                        : 'border-transparent hover:border-gray-200/50 hover:bg-slate-50/50 dark:hover:border-white/[0.04] dark:hover:bg-white/[0.005]'
                    }`}
                  >
                    <div className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-black text-white shadow-sm border border-blue-500/10">
                      {conv.latest.avatar || initials(conv.latest.sender)}
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-[#0D1526] animate-pulse" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-xs font-black text-gray-955 dark:text-white leading-none">{conv.latest.sender}</span>
                        <span className="text-[9px] font-extrabold text-gray-400 shrink-0 uppercase">{relativeTime(conv.latest.createdAt)}</span>
                      </div>
                      <p className="mt-1.5 truncate text-[11px] font-black text-gray-600 dark:text-slate-350 leading-none">{conv.subject}</p>
                      <p className="mt-1.5 line-clamp-1 text-[10.5px] text-gray-550 dark:text-slate-500 font-semibold leading-normal">{conv.latest.content}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Main Chat Reading Pane */}
        <main className="glass-card border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md flex h-full flex-col p-0 overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Message Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 p-5.5 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.005] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-black text-white shadow-md shadow-blue-600/10 border border-blue-500/15 shrink-0">
                    {initials(selectedConversation.subject)}
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-gray-955 dark:text-white leading-tight">{selectedConversation.subject}</h2>
                    <p className="text-[10px] text-gray-455 mt-1 font-semibold uppercase tracking-wider leading-none">
                      Thread with {selectedConversation.latest.sender === userDisplayName ? selectedConversation.latest.recipient : selectedConversation.latest.sender}
                    </p>
                  </div>
                </div>
                
                <span className="px-3 py-1 rounded-full text-[9px] font-extrabold bg-blue-500/10 text-blue-500 border border-blue-500/10 tracking-wide uppercase select-none shrink-0">
                  {selectedConversation.messages.length} messages
                </span>
              </div>

              {/* Message Read Area (Scrollable History Thread) */}
              <div className="custom-scrollbar flex-1 overflow-y-auto p-6 flex flex-col gap-4.5 relative">
                {/* Visual Watermark */}
                <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
                
                <div className="flex-1 flex flex-col gap-4.5 justify-end">
                  {[...selectedConversation.messages].reverse().map((msg, index) => {
                    const isMe = msg.sender === userDisplayName;
                    return (
                      <motion.div
                        key={msg._id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 max-w-[80%] ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
                      >
                        {/* Avatar */}
                        <div className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-black text-white shrink-0 shadow-sm border border-blue-500/10 ${
                          isMe ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-blue-600 to-indigo-600'
                        }`}>
                          {msg.avatar || initials(msg.sender)}
                        </div>

                        {/* Bubble */}
                        <div className="flex flex-col gap-1">
                          <div className={`flex items-center gap-2 ${isMe ? 'justify-end' : ''}`}>
                            <span className="text-[10.5px] font-bold text-gray-900 dark:text-white leading-none">
                              {isMe ? 'You' : msg.sender}
                            </span>
                            <span className="text-[8.5px] font-extrabold text-gray-400 uppercase leading-none">
                              {relativeTime(msg.createdAt)}
                            </span>
                          </div>
                          <div className={`rounded-2xl px-4 py-3 text-xs font-semibold leading-relaxed shadow-sm ${
                            isMe 
                              ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white rounded-tr-none' 
                              : 'bg-slate-100 text-slate-800 dark:bg-white/[0.03] dark:text-slate-200 border border-slate-250/20 dark:border-white/[0.03] rounded-tl-none'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Thread Reply Bar */}
              <form onSubmit={sendReply} className="border-t border-gray-100 p-4 dark:border-white/[0.04] bg-slate-50/50 dark:bg-white/[0.005] shrink-0">
                <div className="flex items-center gap-3 rounded-2xl border border-gray-250/70 bg-white p-2.5 dark:border-white/[0.05] dark:bg-white/[0.02] shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center shrink-0 border border-gray-200 dark:border-white/[0.05]">
                    <User size={10} className="text-gray-400" />
                  </div>
                  <input 
                    className="flex-1 bg-transparent px-2 text-xs font-semibold text-gray-850 outline-none placeholder:text-gray-400 dark:text-slate-200" 
                    placeholder={`Reply as ${userDisplayName}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button type="submit" disabled={sending || !replyText.trim()} className="rounded-xl bg-blue-600 p-2.5 text-white transition hover:bg-blue-700 cursor-pointer shadow-md hover:-translate-y-0.5 shadow-blue-600/10 disabled:opacity-40">
                    <Send size={13} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center p-10 text-center text-xs font-bold text-gray-400">
              Select a teammate conversation to view operational correspondence.
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
