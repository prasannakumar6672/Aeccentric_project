import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalIcon, Plus, RefreshCw, Clock, MapPin, Tag, Cpu, Sparkles, SlidersHorizontal, Terminal, ChevronDown, Bell } from 'lucide-react';
import api from '../../../services/api';

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [type, setType] = useState('meeting');
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/dashboard/calendar');
      if (res.data && res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch calendar events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !start || !end || creating) return;

    setCreating(true);
    try {
      const res = await api.post('/dashboard/calendar', {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        type,
      });
      if (res.data && res.data.success) {
        setEvents((prev) => [...prev, res.data.event].sort((a, b) => new Date(a.start) - new Date(b.start)));
        setTitle('');
        setDescription('');
        setStart('');
        setEnd('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create calendar event.');
    } finally {
      setCreating(false);
    }
  };

  const borderTones = {
    meeting: 'border-l-4 border-l-purple-500 bg-purple-500/[0.015] dark:bg-purple-500/[0.005]',
    deadline: 'border-l-4 border-l-rose-500 bg-rose-500/[0.015] dark:bg-rose-500/[0.005]',
    holiday: 'border-l-4 border-l-emerald-500 bg-emerald-500/[0.015] dark:bg-emerald-500/[0.005]',
    event: 'border-l-4 border-l-blue-500 bg-blue-500/[0.015] dark:bg-blue-500/[0.005]',
  };

  const tagTones = {
    meeting: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/10',
    deadline: 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/10',
    holiday: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/10',
    event: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10',
  };

  const iconTones = {
    meeting: 'bg-purple-500/10 text-purple-500 border border-purple-500/15',
    deadline: 'bg-rose-500/10 text-rose-500 border border-rose-500/15',
    holiday: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/15',
    event: 'bg-blue-500/10 text-blue-500 border border-blue-500/15',
  };

  return (
    <div className="flex flex-col gap-8 text-gray-900 dark:text-[#EDF0FA]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Cpu size={13} className="animate-pulse" /> Team retrospective schedule
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight font-syne dark:text-white flex items-center gap-2 mt-1">
            Workforce & Meeting <span className="text-blue-600 dark:text-blue-400">Schedule</span>
            <Sparkles className="w-5 h-5 text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-[#8892B8] mt-1.5">
            Plan, organize, and view active developer retrospectives, project deadlines, and release events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchEvents}
            className="flex items-center justify-center p-3 bg-gray-100 hover:bg-gray-200 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-gray-500 dark:text-[#EDF0FA] border border-gray-250 dark:border-white/[0.06] rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            <Plus size={14} />
            Schedule Event
          </button>
        </div>
      </div>

      {/* Add Event Form */}
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
                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Book New Calendar Entry</h3>
                  <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">Coordinate developer alignment review, sprints, or official announcements.</p>
                </div>
                <SlidersHorizontal size={14} className="text-gray-400" />
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Event Title</label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                        <Terminal size={14} />
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Design Review Sync"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-xs pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Event Type</label>
                    <div className="relative group">
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full text-xs py-3.5 pl-4 pr-10 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-800 dark:text-[#EDF0FA] focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer appearance-none"
                      >
                        <option value="meeting">Meeting</option>
                        <option value="deadline">Deadline</option>
                        <option value="holiday">Holiday</option>
                        <option value="event">Company Event</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-slate-500 pointer-events-none">
                        <ChevronDown size={14} />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">Start Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="w-full text-xs py-3.5 px-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1">End Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className="w-full text-xs py-3.5 px-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm cursor-pointer"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 dark:text-slate-500 uppercase tracking-wider pl-1 font-bold">Description</label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                        <MapPin size={14} />
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. Bring resource allocation metrics sheet."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full text-xs pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-250 dark:border-white/[0.06] text-gray-905 dark:text-slate-200 focus:outline-none focus:border-blue-500 transition-all font-semibold shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/[0.04]">
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
                    {creating ? 'Saving...' : 'Book Event'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events Agenda List */}
      <div className="glass-card p-8 border border-gray-200 dark:border-white/[0.05] shadow-sm rounded-3xl bg-white/60 dark:bg-white/[0.005] backdrop-blur-md">
        <div className="pb-4 border-b border-gray-100 dark:border-white/[0.04] mb-6">
          <h2 className="text-sm font-black text-gray-900 dark:text-white">Upcoming Operations Agenda</h2>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-bold">List of scheduled meetings, release targets, and operations calendar items.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <RefreshCw size={24} className="text-blue-500 animate-spin" />
            <p className="text-xs font-bold text-gray-500">Retrieving events from workforce core...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <CalIcon className="w-10 h-10 mb-2 opacity-50 animate-pulse" />
            <p className="text-sm font-semibold">No operational events scheduled</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {events.map((event) => (
              <div
                key={event._id}
                className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-150/70 dark:border-white/[0.04] hover:shadow-md hover:-translate-y-0.5 transition-all ${borderTones[event.type] || borderTones.event}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconTones[event.type] || iconTones.event}`}>
                    <CalIcon size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-gray-900 dark:text-white">{event.title}</h4>
                    {event.description && (
                      <p className="text-[11.5px] font-semibold text-gray-500 dark:text-slate-500 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2.5 flex-wrap">
                      <span className="text-[10.5px] text-gray-450 dark:text-slate-600 flex items-center gap-1.5 font-bold uppercase tracking-wide">
                        <Clock size={11} className="text-blue-500" />
                        {new Date(event.start).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        -{' '}
                        {new Date(event.end).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${tagTones[event.type] || tagTones.event}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right shrink-0 flex items-center gap-2 border-t md:border-t-0 border-gray-100 dark:border-white/[0.04] pt-3.5 md:pt-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <Bell size={12} className="animate-swing" />
                  </div>
                  <div className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {new Date(event.start).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}
