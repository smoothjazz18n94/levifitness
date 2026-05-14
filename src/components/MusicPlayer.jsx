import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

// Built-in lo-fi / pump-up beats using Web Audio API synthesis
function createTrack(audioCtx, type) {
  const tracks = {
    pump: { bpm: 140, label: 'Pump Up', emoji: '⚡' },
    hiit:  { bpm: 155, label: 'HIIT Mode', emoji: '🔥' },
    focus: { bpm: 120, label: 'Deep Focus', emoji: '🎯' },
    chill: { bpm: 90,  label: 'Chill Flow', emoji: '🌊' },
  };
  return tracks[type] || tracks.pump;
}

const PLAYLISTS = [
  { id:'pump',  label:'Pump Up',    emoji:'⚡', bpm:140, color:'#39FF14', desc:'High energy drops' },
  { id:'hiit',  label:'HIIT Mode',  emoji:'🔥', bpm:155, color:'#EF4444', desc:'Maximum intensity' },
  { id:'focus', label:'Deep Focus', emoji:'🎯', bpm:120, color:'#A855F7', desc:'Zone in, tune out' },
  { id:'chill', label:'Chill Flow', emoji:'🌊', bpm:90,  color:'#3B82F6', desc:'Easy recovery pace' },
  { id:'power', label:'Power Hour', emoji:'💪', bpm:145, color:'#F59E0B', desc:'Strength sessions' },
];

const STREAMING = [
  { name:'Spotify', color:'#1DB954', url:'https://open.spotify.com/genre/workout-page', icon:'🎵' },
  { name:'Apple Music', color:'#FA2D48', url:'https://music.apple.com/us/playlist/workout-hits/pl.ef5540571a9240c6b16f3f5f7ea6cd21', icon:'🎶' },
  { name:'YouTube Music', color:'#FF0000', url:'https://music.youtube.com/library', icon:'▶️' },
];

// Simple synth beat engine
class BeatEngine {
  constructor() {
    this.ctx = null;
    this.nodes = [];
    this.playing = false;
    this.bpm = 140;
    this.interval = null;
    this.beat = 0;
  }
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)();
  }
  playKick() {
    const ctx = this.ctx;
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.connect(g); g.connect(ctx.destination);
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime+0.3);
    g.gain.setValueAtTime(0.6, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.3);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.3);
  }
  playSnare() {
    const ctx = this.ctx;
    const bufSize = ctx.sampleRate*0.1;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0;i<bufSize;i++) data[i]=(Math.random()*2-1)*0.4;
    const src = ctx.createBufferSource(); src.buffer=buf;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.5,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.1);
    src.connect(g); g.connect(ctx.destination);
    src.start(ctx.currentTime); src.stop(ctx.currentTime+0.1);
  }
  playHihat(accent=false) {
    const ctx = this.ctx;
    const bufSize = ctx.sampleRate*0.05;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i=0;i<bufSize;i++) data[i]=(Math.random()*2-1)*(accent?0.3:0.15);
    const src = ctx.createBufferSource(); src.buffer=buf;
    const filter = ctx.createBiquadFilter(); filter.type='highpass'; filter.frequency.value=8000;
    const g = ctx.createGain(); g.gain.setValueAtTime(accent?0.3:0.15,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.05);
    src.connect(filter); filter.connect(g); g.connect(ctx.destination);
    src.start(ctx.currentTime);
  }
  playBass(freq) {
    const ctx = this.ctx;
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type='sine'; osc.frequency.value=freq;
    osc.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.25,ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+0.25);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime+0.25);
  }
  start(bpm, pattern='pump') {
    this.init();
    if (this.ctx.state==='suspended') this.ctx.resume();
    this.bpm = bpm; this.beat = 0;
    const patterns = {
      pump:  { kick:[0,2,4,6], snare:[2,6], hh:[0,1,2,3,4,5,6,7], bass:[55,55,0,0,55,55,0,0] },
      hiit:  { kick:[0,1,2,3,4,5,6,7], snare:[2,6], hh:[0,2,4,6], bass:[65,0,65,0,55,0,55,0] },
      focus: { kick:[0,4], snare:[4], hh:[0,2,4,6], bass:[41,0,0,0,41,0,0,0] },
      chill: { kick:[0,3], snare:[3], hh:[0,1,2,3,4,5,6,7], bass:[37,0,0,37,0,0,37,0] },
      power: { kick:[0,2,4,5,6], snare:[2,6], hh:[0,1,2,3,4,5,6,7], bass:[55,0,55,55,0,55,0,0] },
    };
    const pat = patterns[pattern] || patterns.pump;
    const interval = (60/bpm)*500;
    this.interval = setInterval(()=>{
      const b = this.beat % 8;
      if (pat.kick.includes(b)) this.playKick();
      if (pat.snare.includes(b)) this.playSnare();
      if (pat.hh.includes(b)) this.playHihat(b%2===0);
      if (pat.bass[b]) this.playBass(pat.bass[b]);
      this.beat++;
    }, interval);
    this.playing = true;
  }
  stop() {
    if (this.interval) { clearInterval(this.interval); this.interval=null; }
    this.playing = false;
  }
}

const engine = new BeatEngine();

export default function MusicPlayer({ visible }) {
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [currentTrack,  setCurrentTrack]  = useState(0);
  const [expanded,      setExpanded]      = useState(false);
  const [volume,        setVolume]        = useState(70);
  const [muted,         setMuted]         = useState(false);
  const [beats,         setBeats]         = useState(0);

  const track = PLAYLISTS[currentTrack];

  useEffect(()=>{
    let t;
    if (isPlaying) t = setInterval(()=>setBeats(b=>b+1),500);
    return ()=>clearInterval(t);
  },[isPlaying]);

  const togglePlay = () => {
    if (isPlaying) { engine.stop(); setIsPlaying(false); }
    else { engine.start(track.bpm, track.id); setIsPlaying(true); }
  };

  const changeTrack = (dir) => {
    const next = (currentTrack + dir + PLAYLISTS.length) % PLAYLISTS.length;
    if (isPlaying) { engine.stop(); }
    setCurrentTrack(next);
    setIsPlaying(false);
    setBeats(0);
  };

  const selectTrack = (i) => {
    if (isPlaying) engine.stop();
    setCurrentTrack(i);
    setIsPlaying(false);
    setBeats(0);
  };

  if (!visible) return null;

  return (
    <motion.div
      className="fixed bottom-20 left-0 right-0 z-30 mx-4"
      initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} exit={{y:100,opacity:0}}
    >
      <div className="max-w-lg mx-auto">
        <div className="glass-strong rounded-3xl overflow-hidden"
          style={{border:`1px solid ${track.color}30`, boxShadow:`0 0 30px ${track.color}15`}}>

          {/* Collapsed bar */}
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Animated eq bars */}
            <div className="flex items-end gap-0.5 w-8 h-6 shrink-0">
              {[1,2,3,4].map(i=>(
                <motion.div key={i} className="flex-1 rounded-sm"
                  style={{background: track.color}}
                  animate={isPlaying ? { height:['30%','100%','50%','80%','30%'] } : { height:'30%' }}
                  transition={{ duration: 0.6, repeat:Infinity, delay:i*0.1, repeatType:'reverse' }}/>
              ))}
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate flex items-center gap-1.5">
                <span>{track.emoji}</span>
                <span>{track.label}</span>
                <span className="text-xs font-mono" style={{color:track.color}}>{track.bpm} BPM</span>
              </div>
              <div className="text-xs text-gray-600">
                {isPlaying ? `Synth beat · ${Math.floor(beats/2)}s played` : 'Tap play to start'}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <motion.button className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{background:isPlaying?`${track.color}25`:'rgba(255,255,255,0.06)'}}
                onClick={togglePlay} whileTap={{scale:0.9}}>
                {isPlaying
                  ? <Pause size={16} style={{color:track.color}}/>
                  : <Play  size={16} style={{color:track.color}} className="ml-0.5"/>
                }
              </motion.button>
              <motion.button className="w-8 h-8 rounded-full flex items-center justify-center glass"
                onClick={()=>setExpanded(e=>!e)} whileTap={{scale:0.9}}>
                {expanded ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronUp size={14} className="text-gray-400"/>}
              </motion.button>
            </div>
          </div>

          {/* Expanded panel */}
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
                className="overflow-hidden">
                <div className="px-4 pb-4 space-y-4 border-t border-white/05">

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-5 pt-3">
                    <motion.button className="glass w-11 h-11 rounded-full flex items-center justify-center"
                      onClick={()=>changeTrack(-1)} whileTap={{scale:0.9}}>
                      <SkipBack size={18} className="text-gray-300"/>
                    </motion.button>
                    <motion.button
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{background:track.color, boxShadow:`0 0 24px ${track.color}60`}}
                      onClick={togglePlay} whileTap={{scale:0.93}}>
                      {isPlaying
                        ? <Pause size={26} className="text-black"/>
                        : <Play  size={26} className="text-black ml-1"/>
                      }
                    </motion.button>
                    <motion.button className="glass w-11 h-11 rounded-full flex items-center justify-center"
                      onClick={()=>changeTrack(1)} whileTap={{scale:0.9}}>
                      <SkipForward size={18} className="text-gray-300"/>
                    </motion.button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-3">
                    <button onClick={()=>setMuted(m=>!m)}>
                      {muted ? <VolumeX size={16} className="text-gray-600"/> : <Volume2 size={16} className="text-gray-400"/>}
                    </button>
                    <input type="range" min="0" max="100" value={muted?0:volume}
                      onChange={e=>{ setVolume(+e.target.value); setMuted(false); }}
                      className="flex-1"/>
                    <span className="text-xs text-gray-600 w-8 text-right">{muted?0:volume}%</span>
                  </div>

                  {/* Track list */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Synth Beats</p>
                    {PLAYLISTS.map((t,i)=>(
                      <motion.button key={t.id}
                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left"
                        style={{background: currentTrack===i?`${t.color}15`:'rgba(255,255,255,0.03)',
                                border:`1px solid ${currentTrack===i?t.color+'30':'transparent'}`}}
                        onClick={()=>selectTrack(i)} whileTap={{scale:0.98}}>
                        <span className="text-xl shrink-0">{t.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{t.label}</div>
                          <div className="text-xs text-gray-600">{t.desc} · {t.bpm} BPM</div>
                        </div>
                        {currentTrack===i && isPlaying && (
                          <div className="flex items-end gap-0.5 h-4 shrink-0">
                            {[1,2,3].map(j=>(
                              <motion.div key={j} className="w-1 rounded-sm" style={{background:t.color}}
                                animate={{height:['30%','100%','50%']}}
                                transition={{duration:0.5,repeat:Infinity,delay:j*0.1,repeatType:'reverse'}}/>
                            ))}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Streaming links */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 uppercase tracking-wider">Open External App</p>
                    <div className="flex gap-2">
                      {STREAMING.map(s=>(
                        <motion.a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-center"
                          style={{background:`${s.color}12`,border:`1px solid ${s.color}25`}}
                          whileTap={{scale:0.95}}>
                          <span className="text-lg">{s.icon}</span>
                          <span className="text-xs font-bold" style={{color:s.color}}>{s.name}</span>
                        </motion.a>
                      ))}
                    </div>
                    <p className="text-xs text-gray-700 text-center">Opens in your streaming app</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
