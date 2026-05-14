import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Trash2, Clock, Flame, Zap, Edit2, Share2, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import { WORKOUT_MODES } from '../data/workouts';
import { enrichExercise } from '../data/workoutHelpers';
import WorkoutBuilder from '../components/WorkoutBuilder';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import DifficultyBadge from '../components/ui/DifficultyBadge';

const COLORS = Object.fromEntries(WORKOUT_MODES.map(m => [m.id, m.color]));
const ICONS  = Object.fromEntries(WORKOUT_MODES.map(m => [m.id, m.icon]));

const card = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { show: { transition: { staggerChildren: 0.05 } } };

function ShareToast({ msg, onClose }) {
  return (
    <motion.div
      className="fixed bottom-28 left-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-bold text-black"
      style={{ background: '#39FF14', x: '-50%', boxShadow: '0 0 20px rgba(57,255,20,0.5)', translateX: '-50%' }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
      onClick={onClose}>
      {msg}
    </motion.div>
  );
}

export default function WorkoutsPage({ allWorkouts, customWorkouts, onStart, onSave, onDelete, onShare }) {
  const [filter,     setFilter]     = useState('all');
  const [builder,    setBuilder]    = useState(null);
  const [shareToast, setShareToast] = useState('');
  const [lockedIds,  setLockedIds]  = useState(new Set());
  const [detailEx,   setDetailEx]   = useState(null);
  const [detailMode, setDetailMode] = useState(null);

  const isCustom = w => !w.id?.startsWith('tmpl_');
  const filtered = filter === 'all' ? allWorkouts : allWorkouts.filter(w => w.mode === filter);
  const allModes = ['all', ...new Set(allWorkouts.map(w => w.mode))];

  const toggleLock = id => setLockedIds(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const handleShare = async w => {
    const res = await onShare(w);
    setShareToast(res?.copied ? '🔗 Link copied!' : res?.ok ? '✅ Shared!' : '📋 Copy not available');
    setTimeout(() => setShareToast(''), 3000);
  };

  return (
    <>
      <motion.div className="px-4 pt-4 pb-28" variants={container} initial="hidden" animate="show">
        {/* Header */}
        <motion.div variants={card} className="flex items-center justify-between mb-5 pt-2">
          <div>
            <h1 className="font-display text-4xl">WORKOUTS</h1>
            <p className="text-gray-500 text-xs mt-0.5">
              {allWorkouts.filter(w => w.id?.startsWith('tmpl_')).length} templates · {customWorkouts.length} custom
            </p>
          </div>
          <motion.button
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold text-black"
            style={{ background: '#39FF14', boxShadow: '0 0 16px rgba(57,255,20,0.35)' }}
            onClick={() => setBuilder({ workout: null, isTemplate: false })}
            whileTap={{ scale: 0.93 }}>
            <Plus size={15} /> NEW
          </motion.button>
        </motion.div>

        {/* Filter chips */}
        <motion.div variants={card} className="flex gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar">
          {allModes.map(m => {
            const info = WORKOUT_MODES.find(x => x.id === m);
            return (
              <motion.button key={m}
                className="shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: filter === m ? (info?.color || '#39FF14') : 'rgba(255,255,255,0.06)',
                  color: filter === m ? '#000' : '#777',
                  border: `1px solid ${filter === m ? (info?.color || '#39FF14') : 'transparent'}`,
                }}
                onClick={() => setFilter(m)} whileTap={{ scale: 0.94 }}>
                {m === 'all' ? 'All' : info?.label || m}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map(w => {
              const color  = COLORS[w.mode] || '#39FF14';
              const locked = lockedIds.has(w.id);
              const custom = isCustom(w);
              const firstEx = w.exercises[0] ? enrichExercise(w.exercises[0]) : null;

              return (
                <motion.div key={w.id} variants={card} layout
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  className="rounded-3xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

                  {/* Hero thumbnail strip */}
                  {firstEx?.image && (
                    <div className="relative h-28 overflow-hidden">
                      <img src={firstEx.image} alt={firstEx.name}
                        className="w-full h-full object-cover"
                        onError={e => e.target.parentElement.style.display = 'none'} />
                      <div className="absolute inset-0"
                        style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,8,0.95) 100%)' }} />
                      <div className="absolute top-0 left-0 right-0 h-0.5"
                        style={{ background: color, opacity: 0.7 }} />
                      {/* Mode badge */}
                      <div className="absolute top-3 left-3">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: `${color}cc`, color: '#000' }}>
                          {ICONS[w.mode]} {w.mode.toUpperCase()}
                        </span>
                      </div>
                      {custom && (
                        <div className="absolute top-3 right-3">
                          <span className="text-xs font-bold px-2 py-1 rounded-full"
                            style={{ background: 'rgba(0,0,0,0.7)', color: '#888', border: '1px solid rgba(255,255,255,0.15)' }}>
                            CUSTOM
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4">
                    {/* Title + lock */}
                    <div className="flex items-start gap-2 mb-2">
                      {!firstEx?.image && (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                          {ICONS[w.mode] || '⚡'}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base leading-tight truncate">{w.name}</h3>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><Clock size={11} />{Math.round(w.totalTime / 60)}m</span>
                          <span className="flex items-center gap-1"><Flame size={11} />{w.calories} cal</span>
                          <span className="flex items-center gap-1"><Zap size={11} />{w.exercises.length} ex</span>
                        </div>
                      </div>
                      <motion.button className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: locked ? `${color}20` : 'rgba(255,255,255,0.05)' }}
                        onClick={() => toggleLock(w.id)} whileTap={{ scale: 0.9 }}>
                        {locked ? <Lock size={13} style={{ color }} /> : <Unlock size={13} className="text-gray-600" />}
                      </motion.button>
                    </div>

                    {/* Exercise thumbnail strip */}
                    <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar">
                      {w.exercises.slice(0, 6).map((ex, i) => {
                        const rich = enrichExercise(ex);
                        return (
                          <motion.button key={i}
                            className="shrink-0 w-10 h-10 rounded-xl overflow-hidden relative"
                            style={{ border: `1px solid ${color}25` }}
                            onClick={() => { setDetailEx(rich); setDetailMode(w.mode); }}
                            whileTap={{ scale: 0.95 }}>
                            {rich.thumbnail ? (
                              <img src={rich.thumbnail} alt={rich.name}
                                className="w-full h-full object-cover"
                                onError={e => { e.target.style.display = 'none'; }} />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-sm"
                                style={{ background: `${color}10` }}>💪</div>
                            )}
                          </motion.button>
                        );
                      })}
                      {w.exercises.length > 6 && (
                        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs text-gray-600"
                          style={{ background: 'rgba(255,255,255,0.04)' }}>
                          +{w.exercises.length - 6}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {!locked ? (
                      <div className="flex gap-2">
                        <motion.button className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1"
                          style={{ background: 'rgba(255,255,255,0.06)', color: '#aaa' }}
                          onClick={() => setBuilder({ workout: w, isTemplate: !custom })}
                          whileTap={{ scale: 0.97 }}>
                          <Edit2 size={12} /> EDIT
                        </motion.button>
                        <motion.button className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1"
                          style={{ background: 'rgba(168,85,247,0.1)', color: '#A855F7' }}
                          onClick={() => handleShare(w)} whileTap={{ scale: 0.97 }}>
                          <Share2 size={12} /> SHARE
                        </motion.button>
                        {custom && (
                          <motion.button className="w-11 py-3 rounded-2xl flex items-center justify-center"
                            style={{ background: 'rgba(239,68,68,0.08)' }}
                            onClick={() => onDelete(w.id)} whileTap={{ scale: 0.9 }}>
                            <Trash2 size={13} className="text-red-400/60" />
                          </motion.button>
                        )}
                        <motion.button className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1"
                          style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}
                          onClick={() => onStart(w)} whileTap={{ scale: 0.97 }}>
                          <Play size={12} fill={color} /> START
                        </motion.button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <div className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 text-gray-700"
                          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <Lock size={11} /> Locked
                        </div>
                        <motion.button className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1"
                          style={{ background: `${color}18`, border: `1px solid ${color}35`, color }}
                          onClick={() => onStart(w)} whileTap={{ scale: 0.97 }}>
                          <Play size={12} fill={color} /> START
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div className="text-center py-16 text-gray-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="text-5xl mb-3">🏋️</div>
              <p className="font-medium">No workouts found</p>
              <p className="text-sm mt-1">Try a different filter or tap NEW</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {builder && (
          <WorkoutBuilder
            initial={builder.isTemplate ? { ...builder.workout, id: undefined } : builder.workout}
            isTemplate={builder.isTemplate}
            onClose={() => setBuilder(null)}
            onSave={w => { onSave(w); setBuilder(null); }}
            onShare={handleShare}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailEx && (
          <ExerciseDetailModal
            exercise={detailEx}
            workoutMode={detailMode}
            onClose={() => setDetailEx(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {shareToast && <ShareToast msg={shareToast} onClose={() => setShareToast('')} />}
      </AnimatePresence>
    </>
  );
}
