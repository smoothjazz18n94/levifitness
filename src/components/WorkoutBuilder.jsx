import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Plus, Minus, Trash2, GripVertical, Save, Check, Share2 } from 'lucide-react';
import { useState } from 'react';
import { WORKOUT_MODES } from '../data/workouts';

function uid() { return `e${Date.now()}_${Math.random().toString(36).slice(2, 6)}`; }

function Stepper({ label, value, onChange, min, max, step, unit, color }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-mono font-bold" style={{ color }}>{value}{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          onClick={() => onChange(Math.max(min, value - step))}
          whileTap={{ scale: 0.88 }}>
          <Minus size={14} className="text-gray-300" />
        </motion.button>
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          className="flex-1"
        />
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
          onClick={() => onChange(Math.min(max, value + step))}
          whileTap={{ scale: 0.88 }}>
          <Plus size={14} className="text-gray-300" />
        </motion.button>
      </div>
    </div>
  );
}

function ExerciseRow({ ex, idx, color, onUpdate, onRemove }) {
  const [open, setOpen] = useState(false);

  return (
    <Reorder.Item value={ex} dragListener={!open}>
      <motion.div
        className="rounded-2xl overflow-hidden mb-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${open ? color + '35' : 'rgba(255,255,255,0.07)'}` }}
        layout
      >
        {/* Always-visible header row */}
        <div className="flex items-center gap-2 px-3 py-3">
          <GripVertical size={15} className="text-gray-700 shrink-0 cursor-grab touch-none" />

          {/* Number badge */}
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: `${color}20`, color }}>
            {idx + 1}
          </div>

          {/* Name input */}
          <input
            className="flex-1 min-w-0 bg-transparent text-white font-medium placeholder-gray-600 outline-none text-sm"
            placeholder="Exercise name"
            value={ex.name}
            onChange={e => onUpdate('name', e.target.value)}
          />

          {/* Sets badge — always visible, tappable */}
          <motion.button
            className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-xl"
            style={{ background: open ? '#F59E0B20' : 'rgba(255,255,255,0.06)', border: `1px solid ${open ? '#F59E0B50' : 'rgba(255,255,255,0.08)'}` }}
            onClick={() => setOpen(o => !o)}
            whileTap={{ scale: 0.93 }}
          >
            <span className="text-xs font-bold" style={{ color: open ? '#F59E0B' : '#aaa' }}>
              {ex.sets || 1}×
            </span>
            <span className="text-xs text-gray-600 hidden xs:inline">{ex.duration}s</span>
          </motion.button>

          <motion.button
            className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(239,68,68,0.1)' }}
            onClick={onRemove}
            whileTap={{ scale: 0.88 }}>
            <Trash2 size={12} className="text-red-400/70" />
          </motion.button>
        </div>

        {/* Expanded edit panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 space-y-4 border-t border-white/5">

                {/* SETS — most prominent, at the top */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Sets</span>
                    <span className="text-base font-display" style={{ color: '#F59E0B' }}>
                      {ex.sets || 1} {(ex.sets || 1) === 1 ? 'SET' : 'SETS'}
                    </span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <motion.button
                        key={n}
                        className="py-2.5 rounded-xl text-sm font-bold"
                        style={{
                          background: (ex.sets || 1) === n ? '#F59E0B' : 'rgba(255,255,255,0.06)',
                          color: (ex.sets || 1) === n ? '#000' : '#666',
                          boxShadow: (ex.sets || 1) === n ? '0 0 12px rgba(245,158,11,0.4)' : 'none',
                        }}
                        onClick={() => onUpdate('sets', n)}
                        whileTap={{ scale: 0.9 }}
                      >
                        {n}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Work time */}
                <Stepper
                  label="Work Time" value={ex.duration} unit="s" color={color}
                  min={5} max={300} step={5}
                  onChange={v => onUpdate('duration', v)}
                />

                {/* Rest time */}
                <Stepper
                  label="Rest Between Sets" value={ex.rest} unit="s" color="#A855F7"
                  min={0} max={180} step={5}
                  onChange={v => onUpdate('rest', v)}
                />

                {/* Summary line */}
                <div className="glass rounded-xl px-4 py-2.5 flex justify-between text-xs">
                  <span className="text-gray-500">Total for this exercise</span>
                  <span className="font-mono font-bold text-white">
                    {Math.round(((ex.duration + ex.rest) * (ex.sets || 1)) / 60 * 10) / 10} min
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
}

export default function WorkoutBuilder({ initial, onClose, onSave, onShare, isTemplate }) {
  const base = initial || {};
  const [name,      setName]      = useState(base.name || '');
  const [mode,      setMode]      = useState(base.mode || 'custom');
  const [exercises, setExercises] = useState(
    base.exercises?.map(e => ({ ...e, id: e.id || uid(), sets: e.sets || 3 })) || [
      { id: uid(), name: 'Push-Ups', duration: 40, rest: 20, sets: 3 },
      { id: uid(), name: 'Squats',   duration: 40, rest: 20, sets: 3 },
    ]
  );
  const [saved, setSaved] = useState(false);

  const modeInfo = WORKOUT_MODES.find(m => m.id === mode) || WORKOUT_MODES[WORKOUT_MODES.length - 1];
  const color = modeInfo.color;

  const addExercise = () => {
    setExercises(p => [...p, { id: uid(), name: '', duration: 40, rest: 20, sets: 3 }]);
  };

  const update = (id, field, val) =>
    setExercises(p => p.map(e => e.id === id ? { ...e, [field]: val } : e));

  const remove = (id) => setExercises(p => p.filter(e => e.id !== id));

  const totalTime = exercises.reduce((a, e) => a + (e.duration + e.rest) * (e.sets || 1), 0);
  const valid     = name.trim() && exercises.some(e => e.name.trim());

  const handleSave = () => {
    if (!valid) return;
    const validEx = exercises.filter(e => e.name.trim());
    const t = validEx.reduce((a, e) => a + (e.duration + e.rest) * (e.sets || 1), 0);
    onSave({ ...base, name: name.trim(), mode, exercises: validEx, totalTime: t, calories: Math.round(t * 0.15) });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleShare = async () => {
    if (!valid) return;
    const validEx = exercises.filter(e => e.name.trim());
    const t = validEx.reduce((a, e) => a + (e.duration + e.rest) * (e.sets || 1), 0);
    await onShare?.({ ...base, name: name.trim(), mode, exercises: validEx, totalTime: t, calories: Math.round(t * 0.15) });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(14px)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col h-full"
        style={{ background: '#0d0d0d', paddingTop: 'max(0px,env(safe-area-inset-top))' }}
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          <div className="text-center">
            <h2 className="font-bold text-base">{isTemplate ? 'Copy & Edit Template' : base.id ? 'Edit Workout' : 'New Workout'}</h2>
            {isTemplate && <p className="text-xs text-gray-600">Saves as your custom routine</p>}
          </div>
          <div className="flex gap-2">
            {onShare && (
              <motion.button className="w-9 h-9 rounded-xl flex items-center justify-center glass"
                onClick={handleShare} whileTap={{ scale: 0.9 }}>
                <Share2 size={15} className="text-gray-400" />
              </motion.button>
            )}
            <motion.button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: valid ? color : `${color}30`, color: valid ? '#000' : color }}
              onClick={handleSave} whileTap={{ scale: 0.95 }}>
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? 'SAVED!' : 'SAVE'}
            </motion.button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-12">

          {/* Name */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Routine Name</label>
            <input
              className="w-full rounded-2xl px-4 py-3.5 text-white font-medium placeholder-gray-600 outline-none text-base"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${name.trim() ? color + '40' : 'rgba(255,255,255,0.08)'}` }}
              placeholder="e.g. Morning Power Blast"
              value={name} onChange={e => setName(e.target.value)}
            />
          </div>

          {/* Mode */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Category</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {WORKOUT_MODES.map(m => (
                <motion.button key={m.id}
                  className="rounded-2xl py-2.5 px-2 text-center"
                  style={{
                    background: mode === m.id ? `${m.color}18` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${mode === m.id ? m.color + '50' : 'transparent'}`,
                  }}
                  onClick={() => setMode(m.id)} whileTap={{ scale: 0.94 }}>
                  <div className="text-lg mb-0.5">{m.icon}</div>
                  <div className="text-xs font-bold leading-tight" style={{ color: mode === m.id ? m.color : '#666' }}>
                    {m.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Summary bar */}
          <div className="glass rounded-2xl px-5 py-3 flex gap-4">
            {[
              { l: 'Exercises', v: exercises.filter(e => e.name.trim()).length, c: color },
              { l: 'Total Sets', v: exercises.reduce((a, e) => a + (e.sets || 1), 0), c: '#F59E0B' },
              { l: 'Duration',   v: `${Math.round(totalTime / 60)}m`, c: '#A855F7' },
            ].map(s => (
              <div key={s.l} className="text-center flex-1">
                <div className="font-display text-2xl" style={{ color: s.c }}>{s.v}</div>
                <div className="text-xs text-gray-600">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Exercise list */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                Exercises — tap <span style={{ color: '#F59E0B' }}>N×</span> to adjust sets &amp; timing
              </label>
            </div>

            <Reorder.Group axis="y" values={exercises} onReorder={setExercises}>
              {exercises.map((ex, i) => (
                <ExerciseRow
                  key={ex.id} ex={ex} idx={i} color={color}
                  onUpdate={(f, v) => update(ex.id, f, v)}
                  onRemove={() => remove(ex.id)}
                />
              ))}
            </Reorder.Group>

            <motion.button
              className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background: `${color}08`, border: `1px dashed ${color}40`, color }}
              onClick={addExercise} whileTap={{ scale: 0.97 }}>
              <Plus size={16} /> ADD EXERCISE
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}