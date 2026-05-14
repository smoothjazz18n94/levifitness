import { motion, AnimatePresence } from 'framer-motion';
import { Play, Search, Filter, Zap, Users, Clock, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { WORKOUT_MODES } from '../data/workouts';
import { enrichExercise } from '../data/workoutHelpers';
import { MUSCLE_GROUPS, DIFFICULTY_LEVELS } from '../data/exercises';
import ExerciseDetailModal from '../components/ExerciseDetailModal';
import DifficultyBadge from '../components/ui/DifficultyBadge';
import ExerciseVideo from '../components/ExerciseVideo';

const container = { show: { transition: { staggerChildren: 0.05 } } };
const card      = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const MODE_EXTRA = {
  hiit:        { proto: '40s/20s',  pop: 94 },
  strength:    { proto: '60s/120s', pop: 88 },
  bodyweight:  { proto: '45s/15s',  pop: 91 },
  cardio:      { proto: 'Varies',   pop: 85 },
  calisthenics:{ proto: '45s/60s',  pop: 79 },
  crossfit:    { proto: '60s/30s',  pop: 76 },
  yoga:        { proto: '60s/10s',  pop: 82 },
  stretching:  { proto: '30s/10s',  pop: 87 },
  boxing:      { proto: '60s/30s',  pop: 73 },
  running:     { proto: '60s/90s',  pop: 90 },
  cycling:     { proto: '60s/60s',  pop: 78 },
  abs:         { proto: '40s/20s',  pop: 92 },
  beginner:    { proto: '30s/30s',  pop: 88 },
  advanced:    { proto: '45s/15s',  pop: 71 },
  fatburn:     { proto: '45s/15s',  pop: 95 },
  musclegain:  { proto: '90s/120s', pop: 86 },
  athlete:     { proto: '60s/90s',  pop: 74 },
  tabata:      { proto: '20s/10s',  pop: 89 },
  custom:      { proto: 'Your rules', pop: 99 },
};

export default function ExplorePage({ allWorkouts, onStart }) {
  const [search,       setSearch]       = useState('');
  const [diffFilter,   setDiffFilter]   = useState('all');
  const [muscleFilter, setMuscleFilter] = useState('all');
  const [showFilters,  setShowFilters]  = useState(false);
  const [detailEx,     setDetailEx]     = useState(null);
  const [detailMode,   setDetailMode]   = useState(null);
  const [featured,     setFeatured]     = useState(allWorkouts[4] || allWorkouts[0]);

  // Filter workouts
  const filtered = allWorkouts.filter(w => {
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // All unique exercises enriched for the exercise library section
  const allExercises = [];
  const seen = new Set();
  allWorkouts.forEach(w => {
    w.exercises.forEach(ex => {
      if (!seen.has(ex.name)) {
        seen.add(ex.name);
        const rich = enrichExercise(ex);
        if (diffFilter === 'all'   || rich.difficulty === diffFilter) {
          if (muscleFilter === 'all' || rich.muscleGroups?.includes(muscleFilter)) {
            allExercises.push({ ...rich, workoutMode: w.mode });
          }
        }
      }
    });
  });

  const featuredMode = WORKOUT_MODES.find(m => m.id === featured?.mode);

  return (
    <>
      <motion.div className="px-4 pt-4 pb-28" variants={container} initial="hidden" animate="show">

        {/* Header */}
        <motion.div variants={card} className="mb-4 pt-2">
          <h1 className="font-display text-4xl">EXPLORE</h1>
          <p className="text-gray-500 text-sm mt-0.5">{WORKOUT_MODES.length} categories · {allExercises.length} exercises</p>
        </motion.div>

        {/* Search + filter */}
        <motion.div variants={card} className="flex gap-2 mb-4">
          <div className="flex-1 glass rounded-2xl flex items-center gap-2 px-3">
            <Search size={15} className="text-gray-600 shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none py-3"
              placeholder="Search workouts..."
              value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')}><X size={14} className="text-gray-600" /></button>
            )}
          </div>
          <motion.button
            className="glass w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ border: showFilters ? '1px solid rgba(57,255,20,0.4)' : undefined }}
            onClick={() => setShowFilters(s => !s)} whileTap={{ scale: 0.9 }}>
            <Filter size={16} style={{ color: showFilters ? '#39FF14' : '#666' }} />
          </motion.button>
        </motion.div>

        {/* Filter panels */}
        <AnimatePresence>
          {showFilters && (
            <motion.div className="mb-4 space-y-3"
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}>
              {/* Difficulty */}
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Difficulty</p>
                <div className="flex gap-2 flex-wrap">
                  {DIFFICULTY_LEVELS.map(d => (
                    <button key={d.id}
                      className="px-3 py-1.5 rounded-full text-xs font-bold"
                      style={{
                        background: diffFilter === d.id ? `${d.color}25` : 'rgba(255,255,255,0.05)',
                        color: diffFilter === d.id ? d.color : '#666',
                        border: `1px solid ${diffFilter === d.id ? d.color + '50' : 'transparent'}`,
                      }}
                      onClick={() => setDiffFilter(d.id)}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Muscle group */}
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Muscle Group</p>
                <div className="flex gap-2 flex-wrap">
                  {MUSCLE_GROUPS.slice(0, 9).map(m => (
                    <button key={m}
                      className="px-3 py-1.5 rounded-full text-xs font-bold capitalize"
                      style={{
                        background: muscleFilter === m ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                        color: muscleFilter === m ? '#A855F7' : '#666',
                        border: `1px solid ${muscleFilter === m ? '#A855F7aa' : 'transparent'}`,
                      }}
                      onClick={() => setMuscleFilter(m)}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured hero workout */}
        {!search && featured && (
          <motion.div variants={card} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} style={{ color: '#39FF14' }} />
              <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Featured Workout</p>
            </div>
            <motion.div
              className="rounded-3xl overflow-hidden relative"
              style={{ height: 220 }}
              whileTap={{ scale: 0.98 }}>
              {/* Hero video/image */}
              {(() => {
                const rich = enrichExercise(featured.exercises[0] || {});
                return (
                  <ExerciseVideo
                    src={rich.video || rich.image}
                    color={featuredMode?.color || '#39FF14'}
                    className="w-full h-full"
                    animate={true}
                  />
                );
              })()}
              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5"
                style={{ background: 'linear-gradient(0deg, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.2) 60%, transparent 100%)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${featuredMode?.color || '#39FF14'}cc`, color: '#000' }}>
                    {featuredMode?.icon} {featured.mode?.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-display text-3xl mb-1" style={{ color: featuredMode?.color || '#39FF14' }}>
                  {featured.name}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={11} />{Math.round(featured.totalTime / 60)}m</span>
                    <span className="flex items-center gap-1"><Zap size={11} />{featured.exercises.length} ex</span>
                  </div>
                  <motion.button
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black"
                    style={{ background: featuredMode?.color || '#39FF14', boxShadow: `0 0 16px ${featuredMode?.color || '#39FF14'}50` }}
                    onClick={() => onStart(featured)} whileTap={{ scale: 0.95 }}>
                    <Play size={14} fill="black" /> START
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Categories grid */}
        {!search && (
          <motion.div variants={card} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm">All Categories</h3>
              <span className="text-xs text-gray-600">{WORKOUT_MODES.length} types</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {WORKOUT_MODES.map(mode => {
                const modeWorkouts = allWorkouts.filter(w => w.mode === mode.id);
                const extra = MODE_EXTRA[mode.id] || {};
                return (
                  <motion.div key={mode.id}
                    className="rounded-2xl p-4 relative overflow-hidden"
                    style={{ background: `${mode.color}08`, border: `1px solid ${mode.color}20` }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const w = modeWorkouts[0];
                      if (w) setFeatured(w);
                    }}>
                    <div className="text-2xl mb-2">{mode.icon}</div>
                    <div className="font-bold text-sm" style={{ color: mode.color }}>{mode.label}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{modeWorkouts.length} routines</div>
                    {/* Pop bar */}
                    <div className="mt-2 h-0.5 rounded-full bg-white/5">
                      <motion.div className="h-0.5 rounded-full"
                        style={{ background: mode.color, width: `${extra.pop || 0}%` }}
                        initial={{ width: 0 }} animate={{ width: `${extra.pop || 0}%` }}
                        transition={{ delay: 0.3, duration: 0.8 }} />
                    </div>
                    {modeWorkouts.length > 0 && (
                      <motion.button
                        className="mt-3 w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                        style={{ background: `${mode.color}15`, color: mode.color }}
                        onClick={e => { e.stopPropagation(); onStart(modeWorkouts[0]); }}>
                        <Play size={11} fill={mode.color} /> Quick Start
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Exercise library */}
        <motion.div variants={card}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Exercise Library</h3>
            <span className="text-xs text-gray-600">{allExercises.length} exercises</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {allExercises.slice(0, 18).map((ex, i) => {
              const modeColor = WORKOUT_MODES.find(m => m.id === ex.workoutMode)?.color || '#39FF14';
              return (
                <motion.button key={`${ex.id}-${i}`}
                  className="rounded-2xl overflow-hidden text-left"
                  style={{ border: `1px solid rgba(255,255,255,0.07)` }}
                  onClick={() => { setDetailEx(ex); setDetailMode(ex.workoutMode); }}
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}>
                  {/* Thumbnail */}
                  <div className="relative h-24 overflow-hidden">
                    {ex.image ? (
                      <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl"
                        style={{ background: `${modeColor}10` }}>💪</div>
                    )}
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(8,8,8,0.9) 100%)' }} />
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-xs font-bold truncate">{ex.name}</p>
                    </div>
                  </div>
                  {/* Meta */}
                  <div className="p-2.5 bg-black/30">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs text-gray-500 truncate">{ex.muscle?.split(' · ')[0]}</span>
                      {ex.difficulty && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            background: ex.difficulty === 'Beginner' ? '#34D39920' : ex.difficulty === 'Advanced' ? '#EF444420' : '#F59E0B20',
                            color: ex.difficulty === 'Beginner' ? '#34D399' : ex.difficulty === 'Advanced' ? '#EF4444' : '#F59E0B',
                          }}>
                          {ex.difficulty?.[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Workouts by category (search results) */}
        {search && (
          <div className="space-y-3 mt-2">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                <p className="text-3xl mb-2">🔍</p>
                <p>No results for "{search}"</p>
              </div>
            ) : filtered.map(w => {
              const color = WORKOUT_MODES.find(m => m.id === w.mode)?.color || '#39FF14';
              const icon  = WORKOUT_MODES.find(m => m.id === w.mode)?.icon  || '⚡';
              return (
                <motion.div key={w.id}
                  className="glass rounded-2xl p-4 flex items-center gap-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{w.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {Math.round(w.totalTime / 60)}m · {w.exercises.length} ex · {w.calories} cal
                    </div>
                  </div>
                  <motion.button
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}20`, border: `1px solid ${color}35` }}
                    onClick={() => onStart(w)} whileTap={{ scale: 0.9 }}>
                    <Play size={16} style={{ color }} fill={color} />
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Exercise detail modal */}
      <AnimatePresence>
        {detailEx && (
          <ExerciseDetailModal
            exercise={detailEx}
            workoutMode={detailMode}
            onClose={() => setDetailEx(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
