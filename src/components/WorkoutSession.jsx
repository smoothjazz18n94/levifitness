import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, X, Volume2, VolumeX, Edit3, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import CircularTimer from './CircularTimer';
import ExerciseVideo from './ExerciseVideo';
import ExerciseDetailModal from './ExerciseDetailModal';
import DifficultyBadge from './ui/DifficultyBadge';
import Confetti from './Confetti';
import { MOTIVATIONAL, WORKOUT_MODES } from '../data/workouts';
import { enrichExercise } from '../data/workoutHelpers';

export default function WorkoutSession({
  activeWorkout, currentExercise: rawCurrent, nextExercise: rawNext,
  timeLeft, progress, overallProgress, phase,
  isRunning, isCompleted, exerciseIndex,
  onToggle, onReset, onSkip, onPrev, onExit,
  soundEnabled, onSoundToggle, onEditExercise,
}) {
  const [motivIdx,    setMotivIdx]    = useState(0);
  const [showEdit,    setShowEdit]    = useState(false);
  const [showDetail,  setShowDetail]  = useState(false);
  const [videoKey,    setVideoKey]    = useState(0);

  const currentExercise = rawCurrent ? enrichExercise(rawCurrent) : null;
  const nextExercise    = rawNext    ? enrichExercise(rawNext)    : null;

  const modeInfo = WORKOUT_MODES.find(m => m.id === activeWorkout?.mode);
  const color    = modeInfo?.color || '#39FF14';
  const pct      = Math.round(overallProgress * 100);

  useEffect(() => {
    const t = setInterval(() => setMotivIdx(i => (i + 1) % MOTIVATIONAL.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Reset video when exercise changes
  useEffect(() => { setVideoKey(k => k + 1); }, [exerciseIndex]);

  /* ── Completion screen ─────────────────────────────────────── */
  if (isCompleted) {
    return (
      <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ background: '#080808' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Confetti />
        <motion.div className="text-center px-6 w-full max-w-sm"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
          <motion.div className="text-8xl mb-5"
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ delay: 0.5, duration: 0.8 }}>🏆</motion.div>
          <h1 className="font-display text-6xl mb-1" style={{ color }}>CRUSHED IT!</h1>
          <p className="text-gray-400 mb-8">{activeWorkout.name}</p>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { l: 'Exercises', v: activeWorkout.exercises.length },
              { l: 'Calories',  v: activeWorkout.calories || '—' },
              { l: 'Duration',  v: `${Math.round(activeWorkout.totalTime / 60)}m` },
            ].map(s => (
              <div key={s.l} className="glass rounded-2xl px-3 py-4 text-center">
                <div className="font-display text-3xl" style={{ color }}>{s.v}</div>
                <div className="text-gray-500 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
          <motion.button className="w-full py-4 rounded-2xl font-bold text-black text-lg"
            style={{ background: color, boxShadow: `0 0 24px ${color}50` }}
            onClick={onExit} whileTap={{ scale: 0.96 }}>
            BACK TO HOME
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  /* ── Active workout ────────────────────────────────────────── */
  return (
    <>
      <motion.div className="fixed inset-0 z-50 flex flex-col overflow-hidden"
        style={{ background: '#080808', paddingTop: 'max(0px,env(safe-area-inset-top))' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        {/* Blurred neon background blob */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute w-80 h-80 rounded-full blur-3xl opacity-10"
            style={{ background: color, top: '-5%', left: '50%', transform: 'translateX(-50%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }} />
          {phase === 'rest' && (
            <motion.div className="absolute w-60 h-60 rounded-full blur-3xl opacity-10"
              style={{ background: '#A855F7', bottom: '20%', right: '-10%' }}
              initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} />
          )}
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-2 shrink-0">
          <motion.button className="glass w-10 h-10 rounded-full flex items-center justify-center"
            onClick={onExit} whileTap={{ scale: 0.9 }}>
            <X size={18} className="text-gray-400" />
          </motion.button>
          <div className="text-center">
            <div className="font-bold text-sm truncate max-w-44">{activeWorkout?.name}</div>
            <div className="text-xs text-gray-500">{exerciseIndex + 1} / {activeWorkout?.exercises.length}</div>
          </div>
          <motion.button className="glass w-10 h-10 rounded-full flex items-center justify-center"
            onClick={onSoundToggle} whileTap={{ scale: 0.9 }}>
            {soundEnabled ? <Volume2 size={16} className="text-gray-400" /> : <VolumeX size={16} className="text-gray-600" />}
          </motion.button>
        </div>

        {/* Overall progress bar */}
        <div className="relative z-10 mx-5 mb-2 shrink-0">
          <div className="h-1 rounded-full bg-white/5">
            <motion.div className="h-1 rounded-full" animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
              style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
          </div>
        </div>

        {/* Main scrollable content */}
        <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center px-4 gap-3 py-1">

          {/* Motivational text */}
          <AnimatePresence mode="wait">
            <motion.div key={motivIdx}
              className="font-display text-lg tracking-widest text-center"
              style={{ color: `${color}55` }}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}>
              {MOTIVATIONAL[motivIdx]}
            </motion.div>
          </AnimatePresence>

          {/* Exercise name + badges */}
          <AnimatePresence mode="wait">
            <motion.div key={currentExercise?.name} className="text-center"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="font-display leading-none mb-2"
                style={{ fontSize: 'clamp(1.8rem,7vw,3rem)' }}>
                {currentExercise?.name}
              </h2>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {currentExercise?.difficulty && (
                  <DifficultyBadge difficulty={currentExercise.difficulty} small />
                )}
                {currentExercise?.muscle && (
                  <span className="text-xs text-gray-500">{currentExercise.muscle.split(' · ')[0]}</span>
                )}
                <button onClick={() => setShowDetail(true)}
                  className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${color}15`, color }}>
                  <Info size={11} /> Info
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Video player */}
          <AnimatePresence mode="wait">
            <motion.div key={`video-${exerciseIndex}`}
              className="w-full max-w-sm rounded-3xl overflow-hidden relative"
              style={{ height: 200 }}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}>
              <ExerciseVideo
                src={currentExercise?.video || currentExercise?.image}
                poster={currentExercise?.thumbnail}
                color={color}
                className="w-full h-full"
                animate={isRunning}
              />
              {/* Phase badge on video */}
              <div className="absolute top-3 left-3 z-20">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full font-mono"
                  style={{ background: phase === 'rest' ? 'rgba(168,85,247,0.85)' : `${color}cc`, color: '#000' }}>
                  {phase === 'rest' ? '● REST' : '● WORK'}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Circular Timer */}
          <CircularTimer timeLeft={timeLeft} progress={progress} phase={phase} isRunning={isRunning} color={color} />

          {/* Instructions snippet */}
          {currentExercise?.instructions?.[0] && (
            <motion.p className="text-center text-xs text-gray-600 max-w-xs px-2"
              key={exerciseIndex}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {currentExercise.instructions[0]}
            </motion.p>
          )}

          {/* Live edit toggle */}
          <div className="w-full max-w-sm">
            <button className="w-full flex items-center justify-center gap-1.5 text-xs text-gray-700 py-1"
              onClick={() => setShowEdit(s => !s)}>
              <Edit3 size={11} /> Adjust timings
              {showEdit ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
            <AnimatePresence>
              {showEdit && currentExercise && (
                <motion.div className="glass rounded-2xl p-4 space-y-3 mt-1"
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-gray-500">Work</span>
                      <span className="text-xs font-mono font-bold" style={{ color }}>{currentExercise.duration}s</span>
                    </div>
                    <input type="range" min="5" max="300" step="5" value={currentExercise.duration}
                      onChange={e => onEditExercise(exerciseIndex, 'duration', +e.target.value)} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-gray-500">Rest</span>
                      <span className="text-xs font-mono font-bold text-purple-400">{currentExercise.rest}s</span>
                    </div>
                    <input type="range" min="0" max="180" step="5" value={currentExercise.rest}
                      onChange={e => onEditExercise(exerciseIndex, 'rest', +e.target.value)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Next exercise preview with thumbnail */}
          {nextExercise && (
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 w-full max-w-sm">
              <div className="text-xs text-gray-500 uppercase tracking-wider shrink-0">Next</div>
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <img src={nextExercise.thumbnail || nextExercise.image}
                  alt={nextExercise.name}
                  className="w-full h-full object-cover"
                  onError={e => e.target.style.display = 'none'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{nextExercise.name}</div>
                <div className="text-xs text-gray-500">{nextExercise.duration}s · {nextExercise.muscle?.split(' · ')[0]}</div>
              </div>
              {nextExercise.difficulty && <DifficultyBadge difficulty={nextExercise.difficulty} small />}
            </div>
          )}
          {!nextExercise && (
            <div className="glass rounded-2xl px-4 py-3 text-center w-full max-w-sm">
              <span className="text-xs text-gray-600">🏁 Final exercise — finish strong!</span>
            </div>
          )}

          <div className="h-2" /> {/* bottom padding */}
        </div>

        {/* Exercise dots */}
        <div className="relative z-10 flex gap-1 justify-center py-3 overflow-x-auto px-4 shrink-0">
          {activeWorkout?.exercises.map((_, i) => (
            <motion.div key={i} className="rounded-full shrink-0"
              style={{
                width: i === exerciseIndex ? 20 : 6, height: 6,
                background: i < exerciseIndex ? color : i === exerciseIndex ? color : 'rgba(255,255,255,0.12)',
              }}
              animate={{ width: i === exerciseIndex ? 20 : 6 }} />
          ))}
        </div>

        {/* Controls */}
        <div className="relative z-10 px-5 shrink-0"
          style={{ paddingBottom: 'max(1.5rem,env(safe-area-inset-bottom))' }}>
          <div className="flex items-center justify-center gap-4">
            <motion.button className="glass w-14 h-14 rounded-full flex items-center justify-center"
              onClick={onPrev} whileTap={{ scale: 0.9 }}
              style={{ opacity: exerciseIndex === 0 ? 0.3 : 1 }} disabled={exerciseIndex === 0}>
              <SkipBack size={22} className="text-white" />
            </motion.button>

            <motion.button
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: color, boxShadow: `0 0 30px ${color}60, 0 0 60px ${color}20` }}
              onClick={onToggle} whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.05 }}>
              {isRunning
                ? <Pause size={30} className="text-black" />
                : <Play  size={30} className="text-black ml-1" />}
            </motion.button>

            <motion.button className="glass w-14 h-14 rounded-full flex items-center justify-center"
              onClick={onSkip} whileTap={{ scale: 0.9 }}>
              <SkipForward size={22} className="text-white" />
            </motion.button>
          </div>
          <div className="flex justify-center mt-3">
            <button className="text-gray-700 text-xs py-2 px-6" onClick={onReset}>Reset</button>
          </div>
        </div>
      </motion.div>

      {/* Exercise detail modal */}
      <AnimatePresence>
        {showDetail && currentExercise && (
          <ExerciseDetailModal
            exercise={currentExercise}
            workoutMode={activeWorkout?.mode}
            onClose={() => setShowDetail(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
