import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Clock, Zap, ChevronRight } from 'lucide-react';
import ExerciseVideo from './ExerciseVideo';
import DifficultyBadge from './ui/DifficultyBadge';
import MuscleTag from './ui/MuscleTag';
import EquipmentTag from './ui/EquipmentTag';
import { WORKOUT_MODES } from '../data/workouts';

const DIFF_COLOR = { Beginner: '#34D399', Intermediate: '#F59E0B', Advanced: '#EF4444' };

export default function ExerciseDetailModal({ exercise, workoutMode, onClose, onStart }) {
  if (!exercise) return null;
  const color = WORKOUT_MODES.find(m => m.id === workoutMode)?.color || '#39FF14';
  const diffColor = DIFF_COLOR[exercise.difficulty] || '#94A3B8';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex flex-col"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 max-h-[96vh] overflow-y-auto"
          style={{ background: '#0d0d0d', borderRadius: '28px 28px 0 0', paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 320 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/15" />
          </div>

          {/* Video */}
          <div className="relative mx-0 overflow-hidden" style={{ height: 240 }}>
            <ExerciseVideo
              src={exercise.video || exercise.image}
              poster={exercise.thumbnail}
              color={color}
              className="w-full h-full"
              animate={true}
            />
            {/* Close button */}
            <button
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center z-30"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
              onClick={onClose}
            >
              <X size={18} className="text-white" />
            </button>
            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8 z-10"
              style={{ background: 'linear-gradient(0deg, rgba(13,13,13,0.95) 0%, transparent 100%)' }}>
              <h2 className="font-display text-3xl">{exercise.name}</h2>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 pt-4 space-y-5">
            {/* Badges row */}
            <div className="flex flex-wrap gap-2">
              <DifficultyBadge difficulty={exercise.difficulty} />
              <MuscleTag muscle={exercise.muscle?.split(' · ')[0]} color={color} />
              <EquipmentTag equipment={exercise.equipment} />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Flame, label: 'Cal/min', val: exercise.caloriesPerMinute || '—', color: '#F59E0B' },
                { icon: Zap,   label: 'Difficulty', val: exercise.difficultyLevel ? `${exercise.difficultyLevel}/3` : '—', color: diffColor },
                { icon: Clock, label: 'Equipment', val: exercise.equipment === 'None' ? 'Bodyweight' : 'Gear', color: '#A855F7' },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-3 text-center">
                  <s.icon size={16} style={{ color: s.color }} className="mx-auto mb-1" />
                  <div className="font-bold text-sm">{s.val}</div>
                  <div className="text-xs text-gray-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Muscles targeted */}
            {exercise.muscleGroups?.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Muscles Targeted</h4>
                <div className="flex flex-wrap gap-1.5">
                  {exercise.muscleGroups.map(m => (
                    <span key={m} className="text-xs px-2.5 py-1 rounded-full capitalize"
                      style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {exercise.instructions?.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-3">How To Do It</h4>
                <div className="space-y-2.5">
                  {exercise.instructions.map((step, i) => (
                    <motion.div key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                        style={{ background: `${color}20`, color }}>
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed flex-1">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Pro tip */}
            {exercise.tips && (
              <div className="glass rounded-2xl p-4 flex gap-3"
                style={{ border: `1px solid ${color}20` }}>
                <span className="text-xl shrink-0">💡</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color }}>Pro Tip</div>
                  <p className="text-sm text-gray-400 leading-relaxed">{exercise.tips}</p>
                </div>
              </div>
            )}

            {/* CTA */}
            {onStart && (
              <motion.button
                className="w-full py-4 rounded-2xl font-bold text-black flex items-center justify-center gap-2"
                style={{ background: color, boxShadow: `0 0 24px ${color}50` }}
                onClick={onStart}
                whileTap={{ scale: 0.97 }}
              >
                Start Exercise <ChevronRight size={18} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
