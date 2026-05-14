import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader } from 'lucide-react';

// Since we're using SVG "videos", we render them as <img> with animation
// Real MP4s would use <video autoPlay muted loop playsInline>
export default function ExerciseVideo({ src, poster, color = '#39FF14', className = '', style = {}, animate = true }) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);
  const isVideo = src && src.endsWith('.mp4');

  useEffect(() => { setLoaded(false); setError(false); }, [src]);

  const fallbackEmoji = '💪';

  if (!src) return (
    <div className={`flex items-center justify-center ${className}`}
      style={{ background: `${color}10`, ...style }}>
      <span className="text-6xl">{fallbackEmoji}</span>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Loading skeleton */}
      <AnimatePresence>
        {!loaded && !error && (
          <motion.div className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: '#0d0d0d' }}
            initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <Loader size={28} style={{ color }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated glow border */}
      {animate && (
        <motion.div className="absolute inset-0 rounded-inherit pointer-events-none z-20"
          style={{ boxShadow: `inset 0 0 0 1.5px ${color}40` }}
          animate={{ boxShadow: [`inset 0 0 0 1.5px ${color}30`, `inset 0 0 0 1.5px ${color}80`, `inset 0 0 0 1.5px ${color}30`] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {isVideo ? (
        <video
          src={src} poster={poster}
          autoPlay muted loop playsInline preload="metadata"
          className="w-full h-full object-cover"
          onLoadedData={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        /* SVG / image — treated as looping visual */
        <img
          src={src} alt="exercise demo"
          className="w-full h-full object-cover"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
        />
      )}

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(8,8,8,0.85) 100%)' }} />

      {/* Corner neon accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.7 }} />
    </div>
  );
}
