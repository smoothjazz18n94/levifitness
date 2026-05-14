import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const SIZE = 280;
const STROKE = 12;
const R = (SIZE - STROKE * 2) / 2;
const CIRC = 2 * Math.PI * R;

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : String(sec);
}

export default function CircularTimer({ timeLeft, progress, phase, isRunning, totalTime }) {
  const dashOffset = CIRC * (1 - Math.max(0, Math.min(1, progress)));
  const isRest = phase === 'rest';
  const color = isRest ? '#A855F7' : '#39FF14';
  const glowColor = isRest ? 'rgba(168,85,247,0.6)' : 'rgba(57,255,20,0.6)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
      {/* Pulse rings */}
      {isRunning && (
        <>
          <motion.div
            className="absolute rounded-full"
            style={{
              width: SIZE - 20, height: SIZE - 20,
              border: `2px solid ${color}`,
              opacity: 0
            }}
            animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute rounded-full"
            style={{
              width: SIZE - 20, height: SIZE - 20,
              border: `1px solid ${color}`,
              opacity: 0
            }}
            animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
        </>
      )}

      {/* SVG circle */}
      <svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={STROKE}
        />
        {/* Progress arc */}
        <motion.circle
          cx={SIZE / 2} cy={SIZE / 2} r={R}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          filter="url(#glow)"
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 0.3, ease: 'linear' }}
        />
        {/* Secondary thin track */}
        <circle
          cx={SIZE / 2} cy={SIZE / 2} r={R - STROKE - 6}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth={1}
        />
      </svg>

      {/* Inner content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Phase label */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-xs font-bold tracking-widest mb-2 uppercase"
          style={{ color }}
        >
          {phase === 'rest' ? '● REST' : '● WORK'}
        </motion.div>

        {/* Timer digits */}
        <motion.div
          key={timeLeft > 60 ? Math.floor(timeLeft / 60) : 'sub'}
          className="font-display leading-none"
          style={{
            fontSize: timeLeft >= 100 ? '5rem' : '6rem',
            color: '#fff',
            textShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
          }}
        >
          {formatTime(timeLeft)}
        </motion.div>

        {/* Seconds sub if > 60 */}
        {timeLeft >= 60 && (
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
            seconds remaining
          </div>
        )}
      </div>
    </div>
  );
}
