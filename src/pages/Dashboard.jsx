import { motion } from 'framer-motion';
import { Flame, Clock, Zap, TrendingUp, Play, ChevronRight, Music } from 'lucide-react';
import { WEEKLY_DATA, RECENT_WORKOUTS, WORKOUT_MODES } from '../data/workouts';
import { enrichExercise } from '../data/workoutHelpers';
import ExerciseVideo from '../components/ExerciseVideo';
import DifficultyBadge from '../components/ui/DifficultyBadge';

const COLORS = Object.fromEntries(WORKOUT_MODES.map(m => [m.id, m.color]));
const ICONS  = Object.fromEntries(WORKOUT_MODES.map(m => [m.id, m.icon]));

const card      = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const container = { show: { transition: { staggerChildren: 0.07 } } };

export default function Dashboard({ stats, allWorkouts, onStartWorkout, showMusic, onToggleMusic }) {
  const maxMin = Math.max(...WEEKLY_DATA.map(d => d.minutes), 1);
  const todayWorkout = allWorkouts[0];
  const heroExercise = todayWorkout?.exercises[0] ? enrichExercise(todayWorkout.exercises[0]) : null;
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  })();

  return (
    <motion.div className="px-4 pt-4 pb-36 space-y-5" variants={container} initial="hidden" animate="show">

      {/* Header */}
      <motion.div variants={card} className="flex items-start justify-between pt-2">
        <div>
          <p className="text-gray-500 text-sm">{greeting},</p>
          <h1 className="font-display text-4xl leading-tight">
            LEVI <span style={{ color: '#39FF14' }}>FITNESS</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            className="glass w-10 h-10 rounded-full flex items-center justify-center"
            style={{ border: showMusic ? '1px solid rgba(57,255,20,0.4)' : undefined }}
            onClick={onToggleMusic} whileTap={{ scale: 0.9 }}>
            <Music size={16} style={{ color: showMusic ? '#39FF14' : '#666' }} />
          </motion.button>
          <div className="glass rounded-2xl px-3 py-2 flex items-center gap-2">
            <Flame size={16} style={{ color: '#F59E0B' }} />
            <span className="font-bold text-sm">{stats.streak}</span>
            <span className="text-gray-500 text-xs">day streak</span>
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={card} className="grid grid-cols-3 gap-3">
        {[
          { label: 'SESSIONS', val: stats.totalSessions,                         icon: Zap,   color: '#39FF14' },
          { label: 'HOURS',    val: `${(stats.totalMinutes / 60).toFixed(0)}h`,  icon: Clock, color: '#A855F7' },
          { label: 'CALORIES', val: `${(stats.totalCalories / 1000).toFixed(1)}k`, icon: Flame, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="glass rounded-2xl p-3 text-center">
            <s.icon size={16} style={{ color: s.color }} className="mx-auto mb-1.5" />
            <div className="font-display text-2xl leading-none">{s.val}</div>
            <div className="text-gray-600 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Today's workout hero with video */}
      {todayWorkout && (
        <motion.div variants={card} className="rounded-3xl overflow-hidden relative"
          style={{ border: '1px solid rgba(57,255,20,0.18)' }}>
          {/* Video background */}
          {heroExercise && (
            <div className="relative h-48">
              <ExerciseVideo
                src={heroExercise.video || heroExercise.image}
                color="#39FF14"
                className="w-full h-full"
                animate={false}
              />
              {/* Overlay */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.97) 100%)' }} />
            </div>
          )}
          {/* Content */}
          <div className="px-5 pb-5" style={{ marginTop: heroExercise ? -60 : 0, paddingTop: heroExercise ? 0 : 20 }}>
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Today's Workout</p>
            <h2 className="font-display text-2xl leading-tight mb-1">{todayWorkout.name}</h2>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ background: `${COLORS[todayWorkout.mode] || '#39FF14'}20`, color: COLORS[todayWorkout.mode] || '#39FF14' }}>
                {ICONS[todayWorkout.mode]} {todayWorkout.mode?.toUpperCase()}
              </span>
              <span className="text-gray-500 text-xs">{todayWorkout.exercises.length} exercises</span>
              <span className="text-gray-500 text-xs">{Math.round(todayWorkout.totalTime / 60)}m</span>
              <span className="text-gray-500 text-xs">{todayWorkout.calories} cal</span>
            </div>
            <motion.button
              className="flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-black text-sm"
              style={{ background: '#39FF14', boxShadow: '0 0 20px rgba(57,255,20,0.4)' }}
              onClick={() => onStartWorkout(todayWorkout)} whileTap={{ scale: 0.96 }}>
              <Play size={16} fill="black" /> START WORKOUT
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Quick start grid with thumbnails */}
      <motion.div variants={card}>
        <h3 className="font-bold text-sm mb-3 text-gray-400 uppercase tracking-wider">Quick Start</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allWorkouts.slice(0, 6).map(w => {
            const color   = COLORS[w.mode] || '#39FF14';
            const firstEx = w.exercises[0] ? enrichExercise(w.exercises[0]) : null;
            return (
              <motion.button key={w.id}
                className="rounded-2xl overflow-hidden text-left relative"
                style={{ border: `1px solid ${color}20` }}
                onClick={() => onStartWorkout(w)} whileTap={{ scale: 0.96 }}>
                <div className="relative h-20">
                  {firstEx?.image ? (
                    <img src={firstEx.image} alt={firstEx.name}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl"
                      style={{ background: `${color}10` }}>
                      {ICONS[w.mode] || '⚡'}
                    </div>
                  )}
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(8,8,8,0.95) 100%)' }} />
                </div>
                <div className="px-3 pb-3 pt-1" style={{ background: '#0d0d0d' }}>
                  <div className="font-bold text-xs leading-tight truncate">{w.name}</div>
                  <div className="text-xs mt-0.5" style={{ color }}>{Math.round(w.totalTime / 60)}m</div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Weekly chart */}
      <motion.div variants={card} className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm">Weekly Activity</h3>
          <TrendingUp size={16} className="text-gray-500" />
        </div>
        <div className="flex items-end gap-2 h-20">
          {WEEKLY_DATA.map((d, i) => {
            const h = (d.minutes / maxMin) * 100;
            const today = i === 5;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg relative overflow-hidden"
                  style={{ height: 60, background: 'rgba(255,255,255,0.04)' }}>
                  <motion.div className="absolute bottom-0 w-full rounded-t-lg"
                    style={{
                      background: today ? 'linear-gradient(180deg,#39FF14,#1a8a07)' : d.minutes > 0 ? 'rgba(168,85,247,0.6)' : 'transparent',
                      boxShadow: today ? '0 0 10px rgba(57,255,20,0.4)' : 'none',
                    }}
                    initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }} />
                </div>
                <span className="text-xs text-gray-600">{d.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent workouts */}
      <motion.div variants={card}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Recent Workouts</h3>
          <button className="text-xs text-gray-500 flex items-center gap-1">See all <ChevronRight size={13} /></button>
        </div>
        <div className="space-y-3">
          {RECENT_WORKOUTS.map(w => (
            <motion.div key={w.id} className="glass rounded-2xl p-4 flex items-center gap-4" whileTap={{ scale: 0.98 }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${COLORS[w.mode] || '#39FF14'}12`, border: `1px solid ${COLORS[w.mode] || '#39FF14'}25` }}>
                {ICONS[w.mode] || '⚡'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{w.name}</div>
                <div className="text-gray-500 text-xs mt-0.5">{w.date} · {w.duration}m · {w.calories} cal</div>
              </div>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[w.mode] || '#39FF14' }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
