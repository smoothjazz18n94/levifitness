import { motion } from 'framer-motion';
import { Home, Dumbbell, Compass, User } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function BottomNav({ active, onChange }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      style={{
        background: 'rgba(8,8,8,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {TABS.map(tab => {
          const isActive = active === tab.id;
          return (
            <motion.button
              key={tab.id}
              className="flex flex-col items-center gap-1 py-2 px-4 rounded-2xl relative min-w-0 flex-1"
              onClick={() => onChange(tab.id)}
              whileTap={{ scale: 0.9 }}
            >
              {/* Active background blob */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(57,255,20,0.08)' }}
                  layoutId="nav-bg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <tab.icon
                size={22}
                style={{
                  color: isActive ? '#39FF14' : '#555',
                  filter: isActive ? 'drop-shadow(0 0 6px rgba(57,255,20,0.7))' : 'none',
                  transition: 'color 0.2s, filter 0.2s',
                }}
              />
              <span
                className="text-xs font-medium relative z-10"
                style={{ color: isActive ? '#39FF14' : '#555' }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
