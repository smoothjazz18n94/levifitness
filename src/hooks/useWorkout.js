import { useState, useEffect, useRef, useCallback } from 'react';
import { TEMPLATES } from '../data/workouts';

const LS_CUSTOM   = 'levi_custom_workouts';
const LS_STATS    = 'levi_stats';
const LS_SETTINGS = 'levi_settings';

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}

function uid() { return `${Date.now()}_${Math.random().toString(36).slice(2,7)}`; }

export default function useWorkout() {
  // Custom (user-saved) workouts — templates are read-only
  const [customWorkouts, setCustomWorkouts] = useState(() => load(LS_CUSTOM, []));
  const [stats, setStats]       = useState(() => load(LS_STATS, { streak:7, totalCalories:12840, totalMinutes:1840, totalSessions:42 }));
  const [settings, setSettings] = useState(() => load(LS_SETTINGS, { sound: true, vibrate: true }));

  // All workouts = templates + custom
  const allWorkouts = [...TEMPLATES, ...customWorkouts];

  // Timer state
  const [activeWorkout,  setActiveWorkout]  = useState(null);
  const [exerciseIndex,  setExerciseIndex]  = useState(0);
  const [currentSet,     setCurrentSet]     = useState(1);
  const [phase,          setPhase]          = useState('work');
  const [timeLeft,       setTimeLeft]       = useState(0);
  const [isRunning,      setIsRunning]      = useState(false);
  const [isCompleted,    setIsCompleted]    = useState(false);

  // Edit-while-active: if activeWorkout is a custom/template copy, can be edited in-session
  const [editingWorkout, setEditingWorkout] = useState(null); // workout being built/edited

  const intervalRef = useRef(null);
  const audioRef    = useRef(null);

  // Persist
  useEffect(() => { localStorage.setItem(LS_CUSTOM,   JSON.stringify(customWorkouts)); }, [customWorkouts]);
  useEffect(() => { localStorage.setItem(LS_STATS,    JSON.stringify(stats));          }, [stats]);
  useEffect(() => { localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));       }, [settings]);

  // ─── Audio ────────────────────────────────────────────────────────────────
  const getCtx = () => {
    if (!audioRef.current) audioRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioRef.current;
  };
  const beep = useCallback((freq=880, dur=0.12, type='sine') => {
    if (!settings.sound) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = type;
      g.gain.setValueAtTime(0.35, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
    } catch {}
  }, [settings.sound]);

  const playSuccess = useCallback(() => {
    [523,659,784,1047].forEach((f,i) => setTimeout(()=>beep(f,0.18,'triangle'), i*130));
  }, [beep]);

  const vibrate = useCallback((pattern=[40]) => {
    if (settings.vibrate && navigator.vibrate) navigator.vibrate(pattern);
  }, [settings.vibrate]);

  // ─── Timer tick ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning || !activeWorkout) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const exs = activeWorkout.exercises;
          const goNext = (nextIdx) => {
            if (nextIdx < exs.length) {
              setExerciseIndex(nextIdx); setCurrentSet(1); setPhase('work');
              beep(880, 0.12); vibrate([30]);
              return exs[nextIdx].duration;
            } else {
              clearInterval(intervalRef.current);
              setIsRunning(false); setIsCompleted(true);
              playSuccess(); vibrate([80,40,80,40,120]);
              return 0;
            }
          };
          if (phase === 'work') {
            const ex = exs[exerciseIndex];
            const totalSets = ex.sets || 1;
            if (ex.rest > 0) { beep(440, 0.2); vibrate([50]); setPhase('rest'); return ex.rest; }
            else return goNext(exerciseIndex + 1);
          } else {
            // rest done — check if more sets remain
            const ex = exs[exerciseIndex];
            const totalSets = ex.sets || 1;
            if (currentSet < totalSets) {
              // next set of same exercise
              beep(660, 0.12); vibrate([30]);
              setCurrentSet(s => s + 1); setPhase('work');
              return ex.duration;
            }
            return goNext(exerciseIndex + 1);
          }
        }
        if (prev <= 4) { beep(440, 0.07); }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [isRunning, activeWorkout, exerciseIndex, phase, beep, vibrate, playSuccess]);

  // ─── Controls ─────────────────────────────────────────────────────────────
  const startWorkout = useCallback((workout) => {
    // Deep copy so in-session edits don't mutate the library
    const copy = { ...workout, exercises: workout.exercises.map(e=>({...e})) };
    setActiveWorkout(copy);
    setExerciseIndex(0); setCurrentSet(1); setPhase('work');
    setTimeLeft(copy.exercises[0].duration);
    setIsRunning(false); setIsCompleted(false);
  }, []);

  const toggleTimer = useCallback(() => {
    setIsRunning(r => { beep(r ? 330 : 660, 0.12); return !r; });
  }, [beep]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current); setIsRunning(false);
    if (activeWorkout) {
      setExerciseIndex(0); setPhase('work');
      setTimeLeft(activeWorkout.exercises[0].duration);
    }
    setIsCompleted(false);
  }, [activeWorkout]);

  const skipExercise = useCallback(() => {
    if (!activeWorkout) return;
    const next = exerciseIndex + 1;
    if (next < activeWorkout.exercises.length) {
      setExerciseIndex(next); setCurrentSet(1); setPhase('work');
      setTimeLeft(activeWorkout.exercises[next].duration); beep(660,0.1);
    } else { setIsRunning(false); setIsCompleted(true); playSuccess(); }
  }, [activeWorkout, exerciseIndex, beep, playSuccess]);

  const prevExercise = useCallback(() => {
    if (exerciseIndex > 0) {
      const p = exerciseIndex - 1;
      setExerciseIndex(p); setCurrentSet(1); setPhase('work');
      setTimeLeft(activeWorkout.exercises[p].duration); beep(440,0.1);
    }
  }, [exerciseIndex, activeWorkout, beep]);

  const exitWorkout = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false); setActiveWorkout(null); setIsCompleted(false);
  }, []);

  // Live edit while in active session
  const updateActiveExercise = useCallback((idx, field, val) => {
    setActiveWorkout(prev => {
      if (!prev) return prev;
      const exs = prev.exercises.map((e,i) => i===idx ? {...e,[field]:val} : e);
      // If editing current exercise's duration while in work phase, update timer too
      if (idx === exerciseIndex && field === 'duration' && phase === 'work') {
        setTimeLeft(val);
      }
      if (idx === exerciseIndex && field === 'rest' && phase === 'rest') {
        setTimeLeft(val);
      }
      return { ...prev, exercises: exs };
    });
  }, [exerciseIndex, phase]);

  // ─── Workout CRUD ─────────────────────────────────────────────────────────
  const saveWorkout = useCallback((workout) => {
    const w = { ...workout, id: workout.id || `cust_${uid()}` };
    setCustomWorkouts(prev => {
      const exists = prev.find(x => x.id === w.id);
      return exists ? prev.map(x => x.id===w.id ? w : x) : [w, ...prev];
    });
    return w;
  }, []);

  const deleteWorkout = useCallback((id) => {
    setCustomWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  // Share routine as URL-encoded JSON
  const shareWorkout = useCallback(async (workout) => {
    const data = { n: workout.name, m: workout.mode, e: workout.exercises.map(e=>({ n:e.name, d:e.duration, r:e.rest })) };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}?routine=${encoded}`;
    if (navigator.share) {
      try { await navigator.share({ title: `LEVI: ${workout.name}`, text: `Check out my workout: ${workout.name}`, url }); return { ok: true }; }
      catch {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      return { ok: true, copied: true };
    }
    return { ok: false, url };
  }, []);

  // On load: parse shared routine from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routineParam = params.get('routine');
    if (routineParam) {
      try {
        const data = JSON.parse(atob(routineParam));
        const shared = {
          id: `shared_${uid()}`, name: data.n, mode: data.m,
          exercises: data.e.map((e,i) => ({ id:`se${i}`, name:e.n, duration:e.d, rest:e.r })),
          calories: 0, totalTime: data.e.reduce((a,e)=>a+e.d+e.r, 0),
        };
        setCustomWorkouts(prev => prev.find(w=>w.name===shared.name) ? prev : [shared, ...prev]);
        window.history.replaceState({}, '', window.location.pathname);
      } catch {}
    }
  }, []);

  // Computed
  const currentExercise  = activeWorkout?.exercises[exerciseIndex] || null;
  const nextExercise     = activeWorkout?.exercises[exerciseIndex+1] || null;
  const totalPhaseTime   = phase==='work' ? currentExercise?.duration : currentExercise?.rest;
  const progress         = totalPhaseTime > 0 ? (totalPhaseTime - timeLeft) / totalPhaseTime : 0;
  // overallProgress accounts for sets within each exercise
  const overallProgress = (() => {
    if (!activeWorkout) return 0;
    const exs = activeWorkout.exercises;
    let total = 0; let done = 0;
    exs.forEach((ex, i) => {
      const s = ex.sets || 1;
      total += s;
      if (i < exerciseIndex) done += s;
      else if (i === exerciseIndex) done += (currentSet - 1) + (phase === 'rest' ? 0.5 : 0);
    });
    return total > 0 ? done / total : 0;
  })();

  return {
    allWorkouts, customWorkouts, templates: TEMPLATES, stats, settings,
    activeWorkout, exerciseIndex, currentSet, phase, timeLeft,
    isRunning, isCompleted,
    currentExercise, nextExercise, progress, overallProgress,
    startWorkout, toggleTimer, resetTimer, skipExercise, prevExercise, exitWorkout,
    updateActiveExercise,
    saveWorkout, deleteWorkout, shareWorkout,
    setSoundEnabled: (v) => setSettings(s=>({...s, sound:v})),
    setVibrateEnabled: (v) => setSettings(s=>({...s, vibrate:v})),
    beep,
  };
}