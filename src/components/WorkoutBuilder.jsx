import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, Plus, Trash2, GripVertical, ChevronDown, Copy, Share2, Save, Check } from 'lucide-react';
import { useState } from 'react';
import { WORKOUT_MODES } from '../data/workouts';

function uid() { return `e${Date.now()}_${Math.random().toString(36).slice(2,6)}`; }

function ExerciseRow({ ex, idx, color, onUpdate, onRemove, expanded, onToggle }) {
  return (
    <Reorder.Item value={ex} dragListener={!expanded}>
      <motion.div
        className="rounded-2xl overflow-hidden mb-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
        layout
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <GripVertical size={16} className="text-gray-600 shrink-0 cursor-grab touch-none" />
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background:`${color}20`, color }}>
            {idx+1}
          </div>
          <input
            className="flex-1 min-w-0 bg-transparent text-white font-medium placeholder-gray-600 outline-none text-sm"
            placeholder="Exercise name"
            value={ex.name}
            onChange={e => onUpdate('name', e.target.value)}
          />
          <div className="text-xs text-gray-600 font-mono shrink-0">{ex.duration}s/{ex.rest}s</div>
          <button className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
            style={{ background:'rgba(255,0,0,0.08)' }} onClick={onRemove}>
            <Trash2 size={13} className="text-red-400/60" />
          </button>
          <button className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
            style={{ background:'rgba(255,255,255,0.05)' }} onClick={onToggle}>
            <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
              <ChevronDown size={13} className="text-gray-400" />
            </motion.div>
          </button>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
              <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/5">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Work Time</span>
                    <span className="text-xs font-mono font-bold" style={{color}}>{ex.duration}s</span>
                  </div>
                  <input type="range" min="5" max="300" step="5" value={ex.duration}
                    onChange={e => onUpdate('duration', +e.target.value)} />
                  <div className="flex justify-between text-xs text-gray-700 mt-1"><span>5s</span><span>300s</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Rest Time</span>
                    <span className="text-xs font-mono font-bold text-purple-400">{ex.rest}s</span>
                  </div>
                  <input type="range" min="0" max="180" step="5" value={ex.rest}
                    onChange={e => onUpdate('rest', +e.target.value)} />
                  <div className="flex justify-between text-xs text-gray-700 mt-1"><span>0s</span><span>180s</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Sets</span>
                    <span className="text-xs font-mono font-bold" style={{color:'#F59E0B'}}>{ex.sets || 1} {(ex.sets||1) === 1 ? 'set' : 'sets'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {[1,2,3,4,5,6].map(n => (
                      <button key={n}
                        className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: (ex.sets||1) === n ? '#F59E0B20' : 'rgba(255,255,255,0.04)',
                          color: (ex.sets||1) === n ? '#F59E0B' : '#555',
                          border: `1px solid ${(ex.sets||1) === n ? '#F59E0B50' : 'transparent'}`,
                        }}
                        onClick={() => onUpdate('sets', n)}>
                        {n}
                      </button>
                    ))}
                  </div>
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
    base.exercises?.map(e=>({...e, id: e.id||uid(), sets: e.sets||3})) || [
      { id: uid(), name:'Push-Ups',  duration:40, rest:20, sets:3 },
      { id: uid(), name:'Squats',    duration:40, rest:20, sets:3 },
    ]
  );
  const [expandedId, setExpandedId] = useState(null);
  const [saved,      setSaved]      = useState(false);

  const selectedMode = WORKOUT_MODES.find(m=>m.id===mode) || WORKOUT_MODES[WORKOUT_MODES.length-1];
  const color = selectedMode.color;

  const addExercise = () => {
    const e = { id:uid(), name:'', duration:40, rest:20 };
    setExercises(p=>[...p,e]); setExpandedId(e.id);
  };

  const update = (id, field, val) => setExercises(p=>p.map(e=>e.id===id?{...e,[field]:val}:e));
  const remove = (id) => setExercises(p=>p.filter(e=>e.id!==id));

  const handleSave = () => {
    if (!name.trim()) return;
    const valid = exercises.filter(e=>e.name.trim());
    if (!valid.length) return;
    const totalTime = valid.reduce((a,e)=>a+(e.duration+e.rest)*(e.sets||1),0);
    const w = { ...base, name:name.trim(), mode, exercises:valid, totalTime, calories:Math.round(totalTime*0.15) };
    onSave(w);
    setSaved(true);
    setTimeout(()=>setSaved(false),1500);
  };

  const handleShare = async () => {
    const valid = exercises.filter(e=>e.name.trim());
    if (!valid.length || !name.trim()) return;
    const totalTime = valid.reduce((a,e)=>a+(e.duration+e.rest)*(e.sets||1),0);
    await onShare({ ...base, name:name.trim(), mode, exercises:valid, totalTime, calories:Math.round(totalTime*0.15) });
  };

  const totalTime = exercises.reduce((a,e)=>a+(e.duration+e.rest)*(e.sets||1),0);
  const valid = name.trim() && exercises.some(e=>e.name.trim());

  return (
    <motion.div className="fixed inset-0 z-50 flex flex-col" style={{background:'rgba(0,0,0,0.9)',backdropFilter:'blur(12px)'}}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <motion.div className="flex flex-col h-full bg-[#0d0d0d]"
        style={{paddingTop:'max(0px,env(safe-area-inset-top))'}}
        initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}}
        transition={{type:'spring',damping:28,stiffness:280}}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <button onClick={onClose}><X size={22} className="text-gray-400" /></button>
          <div className="text-center">
            <h2 className="font-bold text-base">{isTemplate ? 'Edit Template Copy' : (base.id ? 'Edit Workout' : 'New Workout')}</h2>
            {isTemplate && <p className="text-xs text-gray-600">Saves as your custom routine</p>}
          </div>
          <div className="flex gap-2">
            {onShare && (
              <motion.button className="w-9 h-9 rounded-xl flex items-center justify-center glass"
                onClick={handleShare} whileTap={{scale:0.9}}>
                <Share2 size={15} className="text-gray-400" />
              </motion.button>
            )}
            <motion.button
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: valid ? color : `${color}30`, color: valid ? '#000' : color }}
              onClick={handleSave} whileTap={{scale:0.95}} disabled={!valid}>
              {saved ? <Check size={14}/> : <Save size={14}/>}
              {saved ? 'SAVED' : 'SAVE'}
            </motion.button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 pb-12">
          {/* Name */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Routine Name</label>
            <input
              className="w-full rounded-2xl px-4 py-3.5 text-white font-medium placeholder-gray-600 outline-none transition-colors text-base"
              style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${name.trim() ? color+'40' : 'rgba(255,255,255,0.08)'}` }}
              placeholder="e.g. Morning Power Blast"
              value={name} onChange={e=>setName(e.target.value)}
            />
          </div>

          {/* Mode */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">Category</label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {WORKOUT_MODES.map(m=>(
                <motion.button key={m.id}
                  className="rounded-2xl py-2.5 px-2 text-center"
                  style={{ background: mode===m.id?`${m.color}18`:'rgba(255,255,255,0.04)', border:`1px solid ${mode===m.id?m.color+'50':'transparent'}` }}
                  onClick={()=>setMode(m.id)} whileTap={{scale:0.94}}>
                  <div className="text-lg mb-0.5">{m.icon}</div>
                  <div className="text-xs font-bold leading-tight" style={{color:mode===m.id?m.color:'#666'}}>{m.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Summary bar */}
          <div className="glass rounded-2xl px-5 py-3 flex gap-4">
            {[
              { l:'Exercises', v:exercises.filter(e=>e.name.trim()).length, c:color },
              { l:'Duration',  v:`${Math.round(totalTime/60)}m`, c:'#A855F7' },
              { l:'Est. Cal',  v:`~${Math.round(totalTime*0.15)}`, c:'#F59E0B' },
            ].map(s=>(
              <div key={s.l} className="text-center flex-1">
                <div className="font-display text-2xl" style={{color:s.c}}>{s.v}</div>
                <div className="text-xs text-gray-600">{s.l}</div>
              </div>
            ))}
          </div>

          {/* Exercises */}
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider mb-3 block">
              Exercises ({exercises.length}) — drag to reorder
            </label>
            <Reorder.Group axis="y" values={exercises} onReorder={setExercises}>
              {exercises.map((ex,i)=>(
                <ExerciseRow key={ex.id} ex={ex} idx={i} color={color}
                  onUpdate={(f,v)=>update(ex.id,f,v)}
                  onRemove={()=>remove(ex.id)}
                  expanded={expandedId===ex.id}
                  onToggle={()=>setExpandedId(expandedId===ex.id?null:ex.id)}
                />
              ))}
            </Reorder.Group>
            <motion.button
              className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
              style={{ background:`${color}08`, border:`1px dashed ${color}40`, color }}
              onClick={addExercise} whileTap={{scale:0.97}}>
              <Plus size={16}/> ADD EXERCISE
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}