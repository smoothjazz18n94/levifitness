import { motion } from 'framer-motion';
import { Flame, Clock, Zap, TrendingUp, Award, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { WEEKLY_DATA } from '../data/workouts';

const container = { show:{ transition:{ staggerChildren:0.06 } } };
const card = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0} };

const BADGES = [
  { icon:'🔥', name:'7-Day Streak',    earned:true  },
  { icon:'💪', name:'Strength Master', earned:true  },
  { icon:'⚡', name:'HIIT Hero',       earned:true  },
  { icon:'🏆', name:'50 Workouts',     earned:false },
  { icon:'🌙', name:'Night Owl',       earned:false },
  { icon:'⏱️', name:'Speed Demon',    earned:false },
  { icon:'🦾', name:'Iron Will',       earned:true  },
  { icon:'🎯', name:'Core Crusher',    earned:false },
  { icon:'🚀', name:'Advanced Unlocked',earned:false},
];

function Toggle({ on, onToggle, color='#39FF14' }) {
  return (
    <button className="w-12 h-6 rounded-full relative" style={{background:on?color:'rgba(255,255,255,0.1)'}} onClick={onToggle}>
      <motion.div className="w-5 h-5 rounded-full bg-white absolute top-0.5"
        animate={{left:on?26:2}} transition={{type:'spring',stiffness:400,damping:25}}/>
    </button>
  );
}

export default function ProfilePage({ stats, settings, onSoundToggle, onVibrateToggle, customCount }) {
  const maxCal = Math.max(...WEEKLY_DATA.map(d=>d.calories),1);

  return (
    <motion.div className="px-4 pt-4 pb-28" variants={container} initial="hidden" animate="show">
      <motion.div variants={card} className="mb-6 pt-2">
        <h1 className="font-display text-4xl">PROFILE</h1>
      </motion.div>

      {/* Avatar */}
      <motion.div variants={card} className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center font-display text-3xl"
            style={{background:'linear-gradient(135deg,rgba(57,255,20,0.2),rgba(168,85,247,0.2))',
                    border:'2px solid rgba(57,255,20,0.3)',boxShadow:'0 0 20px rgba(57,255,20,0.12)'}}>
            LV
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
            style={{background:'#39FF14',color:'#000'}}>
            {stats.streak}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-xl">Levi Fitness</h2>
          <p className="text-gray-500 text-sm">Elite Member · Level 12</p>
          <div className="mt-2 h-1.5 w-36 rounded-full bg-white/5">
            <div className="h-1.5 rounded-full w-3/5" style={{background:'linear-gradient(90deg,#39FF14,#A855F7)'}}/>
          </div>
          <p className="text-xs text-gray-600 mt-1">{customCount} custom routines saved</p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={card} className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label:'Total Sessions', val:stats.totalSessions,                         icon:Zap,        color:'#39FF14' },
          { label:'Day Streak',     val:`${stats.streak}🔥`,                          icon:Flame,      color:'#F59E0B' },
          { label:'Hours Trained',  val:`${Math.round(stats.totalMinutes/60)}h`,      icon:Clock,      color:'#A855F7' },
          { label:'Calories Burned',val:`${(stats.totalCalories/1000).toFixed(1)}k`, icon:TrendingUp, color:'#3B82F6' },
        ].map(s=>(
          <div key={s.label} className="glass rounded-2xl p-4">
            <s.icon size={18} style={{color:s.color}} className="mb-2"/>
            <div className="font-display text-3xl leading-none mb-1" style={{color:s.color}}>{s.val}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Weekly calories */}
      <motion.div variants={card} className="glass rounded-3xl p-5 mb-5">
        <h3 className="font-bold text-sm mb-4">Weekly Calories</h3>
        <div className="flex items-end gap-2 h-24">
          {WEEKLY_DATA.map((d,i)=>{
            const h = (d.calories/maxCal)*100; const today=i===5;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg relative overflow-hidden" style={{height:72,background:'rgba(255,255,255,0.04)'}}>
                  <motion.div className="absolute bottom-0 w-full rounded-t-lg"
                    style={{background:today?'linear-gradient(180deg,#F59E0B,#d97706)':d.calories>0?'rgba(168,85,247,0.5)':'transparent'}}
                    initial={{height:0}} animate={{height:`${h}%`}}
                    transition={{delay:i*0.05,duration:0.6,ease:[0.34,1.56,0.64,1]}}/>
                </div>
                <span className="text-xs text-gray-600">{d.day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div variants={card} className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-amber-400"/>
          <h3 className="font-bold text-sm">Achievements</h3>
          <span className="text-xs text-gray-600">{BADGES.filter(b=>b.earned).length}/{BADGES.length} earned</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map(b=>(
            <motion.div key={b.name}
              className="rounded-2xl p-3 text-center"
              style={{background:b.earned?'rgba(245,158,11,0.08)':'rgba(255,255,255,0.02)',
                      border:`1px solid ${b.earned?'rgba(245,158,11,0.22)':'rgba(255,255,255,0.04)'}`,
                      opacity:b.earned?1:0.35}}
              whileTap={{scale:0.95}}>
              <div className="text-2xl mb-1" style={{filter:b.earned?'none':'grayscale(1)'}}>{b.icon}</div>
              <div className="text-xs text-gray-400 leading-tight">{b.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div variants={card} className="glass rounded-3xl overflow-hidden mb-5">
        <div className="px-5 py-3.5 border-b border-white/5">
          <h3 className="font-bold text-xs text-gray-500 uppercase tracking-wider">App Settings</h3>
        </div>
        {[
          { icon:settings.sound?Volume2:VolumeX, label:'Sound Effects', desc:'Audio cues during workout', on:settings.sound, toggle:onSoundToggle, color:'#39FF14' },
          { icon:Smartphone, label:'Vibration', desc:'Haptic feedback on phase change', on:settings.vibrate, toggle:onVibrateToggle, color:'#A855F7' },
        ].map(s=>(
          <div key={s.label} className="flex items-center gap-4 px-5 py-4 border-b border-white/03 last:border-0">
            <s.icon size={18} style={{color:s.on?s.color:'#555'}} className="shrink-0"/>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{s.label}</div>
              <div className="text-xs text-gray-600">{s.desc}</div>
            </div>
            <Toggle on={s.on} onToggle={s.toggle} color={s.color}/>
          </div>
        ))}
      </motion.div>

      <motion.div variants={card} className="text-center text-gray-700 text-xs">
        LEVI v2.0 · Built for Athletes · All templates included
      </motion.div>
    </motion.div>
  );
}
