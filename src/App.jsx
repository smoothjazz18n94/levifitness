import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useWorkout from './hooks/useWorkout';
import BottomNav from './components/BottomNav';
import WorkoutSession from './components/WorkoutSession';
import MusicPlayer from './components/MusicPlayer';
import Dashboard from './pages/Dashboard';
import WorkoutsPage from './pages/WorkoutsPage';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';

const pageVariants = {
  initial: { opacity:0, y:14 },
  animate: { opacity:1, y:0, transition:{ duration:0.28, ease:[0.4,0,0.2,1] } },
  exit:    { opacity:0, y:-6,  transition:{ duration:0.18 } },
};

export default function App() {
  const [tab,       setTab]       = useState('home');
  const [showMusic, setShowMusic] = useState(false);
  const w = useWorkout();

  return (
    <div className="min-h-full max-w-lg mx-auto relative overflow-x-hidden">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none"
        style={{background:'radial-gradient(ellipse 80% 40% at 50% 0%,rgba(57,255,20,0.03) 0%,transparent 70%)'}}/>

      {/* Pages */}
      <div className="relative z-10 min-h-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={tab} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {tab==='home' && (
              <Dashboard
                stats={w.stats}
                allWorkouts={w.allWorkouts}
                onStartWorkout={w.startWorkout}
                showMusic={showMusic}
                onToggleMusic={()=>setShowMusic(s=>!s)}
              />
            )}
            {tab==='workouts' && (
              <WorkoutsPage
                allWorkouts={w.allWorkouts}
                customWorkouts={w.customWorkouts}
                onStart={w.startWorkout}
                onSave={w.saveWorkout}
                onDelete={w.deleteWorkout}
                onShare={w.shareWorkout}
              />
            )}
            {tab==='explore' && (
              <ExplorePage allWorkouts={w.allWorkouts} onStart={w.startWorkout}/>
            )}
            {tab==='profile' && (
              <ProfilePage
                stats={w.stats}
                settings={w.settings}
                customCount={w.customWorkouts.length}
                onSoundToggle={()=>w.setSoundEnabled(!w.settings.sound)}
                onVibrateToggle={()=>w.setVibrateEnabled(!w.settings.vibrate)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Music player */}
      <AnimatePresence>
        {showMusic && !w.activeWorkout && <MusicPlayer visible={true}/>}
      </AnimatePresence>

      {/* Bottom nav */}
      <BottomNav active={tab} onChange={setTab}/>

      {/* Active workout session overlay */}
      <AnimatePresence>
        {w.activeWorkout && (
          <WorkoutSession
            activeWorkout={w.activeWorkout}
            currentExercise={w.currentExercise}
            nextExercise={w.nextExercise}
            timeLeft={w.timeLeft}
            progress={w.progress}
            overallProgress={w.overallProgress}
            phase={w.phase}
            isRunning={w.isRunning}
            isCompleted={w.isCompleted}
            exerciseIndex={w.exerciseIndex}
            onToggle={w.toggleTimer}
            onReset={w.resetTimer}
            onSkip={w.skipExercise}
            onPrev={w.prevExercise}
            onExit={w.exitWorkout}
            soundEnabled={w.settings.sound}
            onSoundToggle={()=>w.setSoundEnabled(!w.settings.sound)}
            onEditExercise={w.updateActiveExercise}
          />
        )}
      </AnimatePresence>
      <footer className="text-center text-gray-600 text-[11px] py-6 pb-24 tracking-wide">
  © 2026 LeviFitness™. All rights reserved.
</footer>
    </div>
  );
}
