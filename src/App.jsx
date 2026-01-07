import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowLeft, Users, Globe, HeartPulse, 
  CalendarX, HeartCrack, ThumbsDown, Coffee, Briefcase, 
  Palette, Plane, Home, MapPin, CheckCircle, TrendingUp, 
  ShieldCheck, Zap, Smile, Activity, LineChart,
  MessageCircle, Camera, Infinity, X, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- LIVE POPULATION TICKER COMPONENT ---
const LivePopulationTicker = () => {
  const [population, setPopulation] = useState(8000000000); // Starting at 8 billion
  const basePopulation = 8000000000;
  const growthPerSecond = 2.5; // ~2.5 people per second globally
  
  useEffect(() => {
    let startTime = Date.now();
    
    const updatePopulation = () => {
      const elapsed = (Date.now() - startTime) / 1000; // elapsed seconds
      const newPopulation = basePopulation + (elapsed * growthPerSecond);
      setPopulation(Math.floor(newPopulation));
      
      if (elapsed < 60) { // Run for 60 seconds max per slide view
        requestAnimationFrame(updatePopulation);
      }
    };
    
    updatePopulation();
  }, []);
  
  const formatPopulation = (num) => {
    return num.toLocaleString();
  };
  
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 text-transparent bg-clip-text mb-4 font-mono">
        {formatPopulation(population)}
      </div>
      <p className="text-cyan-400 text-xl font-semibold animate-pulse">People feeling isolated globally</p>
      <motion.div 
        className="mt-4 text-sm text-gray-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ↑ Growing every second
      </motion.div>
    </motion.div>
  );
};

// --- THREAD CONNECTOR COMPONENT ---
const ThreadConnector = ({ points, delay = 0 }) => {
  if (points.length < 2) return null;
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  
  return (
    <motion.svg
      className="absolute w-full h-full pointer-events-none"
      style={{ top: 0, left: 0 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.8 }}
    >
      <defs>
        <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <motion.path
        d={pathD}
        stroke="url(#threadGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay }}
      />
    </motion.svg>
  );
};

// --- INTERACTIVE STAT CARD ---
const StatCard = ({ icon: Icon, number, label, suffix = '', delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
      <div className="relative bg-neutral-950 border border-cyan-400/30 p-8 rounded-2xl backdrop-blur-sm hover:border-pink-500/50 transition-all">
        <Icon className="w-10 h-10 text-cyan-400 mb-4 group-hover:text-pink-500 transition-colors" />
        <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text mb-2">
          <AnimatedNumber value={number} suffix={suffix} />
        </div>
        <p className="text-gray-400 text-sm font-light">{label}</p>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-pink-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
};

// --- ANIMATED GRAPH COMPONENT ---
const AnimatedGraph = ({ data, label }) => {
  const maxValue = Math.max(...data.values);
  
  return (
    <div className="w-full">
      <p className="text-sm text-gray-400 mb-4 font-light tracking-wider uppercase">{label}</p>
      <div className="flex items-end justify-between h-40 gap-3 p-6 bg-neutral-900/40 rounded-2xl border border-white/5 backdrop-blur-sm relative overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none opacity-20">
          <div className="w-full h-px bg-cyan-400/30"></div>
          <div className="w-full h-px bg-cyan-400/30"></div>
          <div className="w-full h-px bg-cyan-400/30"></div>
          <div className="w-full h-px bg-cyan-400/30"></div>
        </div>

        {data.values.map((val, idx) => (
          <motion.div
            key={idx}
            className="flex-1 rounded-t-lg relative group cursor-pointer z-10"
            initial={{ height: 0 }}
            animate={{ height: `${(val / maxValue) * 100}%` }}
            transition={{ duration: 1, delay: idx * 0.1, type: "spring", stiffness: 100 }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-pink-500/80 rounded-t-lg opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
            
            {/* Tooltip */}
            <motion.div 
              className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-neutral-950 border border-pink-500/50 px-3 py-1 rounded-lg shadow-xl shadow-pink-500/20 pointer-events-none"
              whileHover={{ y: -5 }}
            >
              <div className="text-sm font-bold text-white whitespace-nowrap">{val}%</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-neutral-950 border-r border-b border-pink-500/50"></div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- PHONE DEMO COMPONENT ---
const PhoneDemo = () => {
  const [demoStage, setDemoStage] = useState(0);

  useEffect(() => {
    // Stage 1: Wellness Notification (1.5s)
    const t1 = setTimeout(() => setDemoStage(1), 1500);
    // Stage 2: Community Notification (3.5s)
    const t2 = setTimeout(() => setDemoStage(2), 3500);
    // Stage 3: Match/Invite Notification (5.5s)
    const t3 = setTimeout(() => setDemoStage(3), 5500);
    // Stage 4: Open Chat (7.5s)
    const t4 = setTimeout(() => setDemoStage(4), 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="relative w-[320px] h-[640px] bg-neutral-950 rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden mx-auto transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 w-full h-8 bg-black/20 z-50 flex justify-between px-6 items-center text-[10px] font-mono text-white/50">
        <span>9:41</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-white/20"></div>
          <div className="w-3 h-3 rounded-full bg-white/20"></div>
        </div>
      </div>
      
      {/* App Content */}
      <div className="w-full h-full relative flex flex-col pt-12 pb-8 px-6 bg-gradient-to-b from-neutral-900 to-black overflow-hidden">
        
        {/* INTERACTIVE NOTIFICATIONS (Top) */}
        <div className="absolute top-12 left-0 w-full px-4 z-40 space-y-3">
          {/* Wellness Notification */}
          <AnimatePresence>
            {demoStage >= 1 && (
               <motion.div 
                 initial={{ y: -50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 className="bg-neutral-800/90 backdrop-blur-md border border-green-500/30 p-3 rounded-xl flex items-center gap-3 shadow-lg"
               >
                 <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                   <HeartPulse size={14} />
                 </div>
                 <div>
                   <div className="text-[10px] text-green-400 font-bold uppercase">Wellness</div>
                   <div className="text-white text-xs font-medium">Morning Meditation Complete</div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Social Overlap Notification */}
          <AnimatePresence>
            {demoStage >= 2 && (
               <motion.div 
                 initial={{ y: -50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 className="bg-neutral-800/90 backdrop-blur-md border border-purple-500/30 p-3 rounded-xl flex items-center gap-3 shadow-lg"
               >
                 <div className="bg-purple-500/20 p-2 rounded-full text-purple-400">
                   <Users size={14} />
                 </div>
                 <div>
                   <div className="text-[10px] text-purple-400 font-bold uppercase">Community</div>
                   <div className="text-white text-xs font-medium">3 neighbors also meditated</div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 mt-4">
          <div className="text-cyan-400 font-black tracking-widest text-lg">WEAVE</div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-pink-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-black">
               <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" className="w-full h-full rounded-full object-cover opacity-80" alt="Profile" />
            </div>
          </div>
        </div>

        {/* Main Interaction Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center -mt-10">
          {/* Radar Rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute border border-cyan-400/20 rounded-full"
              style={{ width: i * 120, height: i * 120 }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
            />
          ))}

          {/* Central User */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 p-1 relative z-10 shadow-[0_0_40px_rgba(6,182,212,0.4)]">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" className="w-full h-full rounded-full object-cover" alt="User" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-black rounded-full"></div>
          </div>
          <div className="mt-4 text-white font-bold tracking-wide text-sm h-6">
            <AnimatePresence mode='wait'>
               {demoStage < 3 ? (
                 <motion.div key="text1" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>Syncing lifestyle...</motion.div>
               ) : (
                 <motion.div key="text2" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-cyan-400">Connection found!</motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* Connecting Users */}
          {[
            { x: -90, y: -100, img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200", delay: 1.5, name: "Alex" },
            { x: 90, y: -50, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200", delay: 2.5, name: "Sarah" },
            { x: 0, y: 110, img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200", delay: 3.5, name: "Jordan" }
          ].map((user, idx) => (
            <motion.div
              key={idx}
              className="absolute flex flex-col items-center z-10"
              style={{ x: user.x, y: user.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: user.delay, type: "spring" }}
            >
              <div className="w-14 h-14 rounded-full border-2 border-pink-500 p-0.5 mb-2 bg-black">
                 <img src={user.img} className="w-full h-full rounded-full object-cover" alt="Match" />
              </div>
              <div className="bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-mono border border-white/10">{user.name}</div>
              
              {/* Connection Line */}
              <svg className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 pointer-events-none overflow-visible" style={{ zIndex: -1 }}>
                 <motion.line 
                   x1="150" 
                   y1="150" 
                   x2={150 - user.x} 
                   y2={150 - user.y} 
                   stroke="url(#threadGradient)" 
                   strokeWidth="1" 
                   strokeDasharray="4 4"
                   initial={{ pathLength: 0 }}
                   animate={{ pathLength: 1 }}
                   transition={{ duration: 0.5, delay: user.delay }}
                 />
              </svg>
            </motion.div>
          ))}

          {/* Match Notification */}
          <AnimatePresence>
            {demoStage >= 3 && (
              <motion.div
                className="absolute bottom-20 w-full px-6 z-30"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="bg-neutral-800/90 backdrop-blur-xl border border-cyan-400/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 cursor-pointer" onClick={() => setDemoStage(4)}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Common Ground</div>
                    <div className="text-white font-bold text-sm">Suggested: Morning Coffee Group</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <div className="absolute bottom-8 right-6 w-14 h-14 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/30 hover:scale-110 transition-transform cursor-pointer z-30">
          <Users className="text-white w-6 h-6" />
        </div>

        {/* CHAT OVERLAY */}
        <AnimatePresence>
        {demoStage >= 4 && (
          <motion.div
            className="absolute inset-x-0 bottom-0 h-3/4 bg-neutral-900 rounded-t-3xl border-t border-cyan-400/20 shadow-2xl z-50 flex flex-col"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
             {/* Chat Header */}
             <div className="p-4 border-b border-white/5 flex items-center justify-between bg-neutral-800/50 rounded-t-3xl">
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-gray-700 overflow-hidden"><img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" /></div>
                      <div className="w-8 h-8 rounded-full border-2 border-neutral-900 bg-gray-700 overflow-hidden"><img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" /></div>
                   </div>
                   <div>
                      <div className="font-bold text-white text-sm">Morning Coffee ☕️</div>
                      <div className="text-[10px] text-cyan-400">Connected via Meditation</div>
                   </div>
                </div>
                <div className="bg-cyan-500/20 p-2 rounded-full cursor-pointer" onClick={() => setDemoStage(0)}><X size={16} className="text-cyan-400"/></div>
             </div>

             {/* Chat Messages */}
             <div className="flex-1 p-4 space-y-4 overflow-hidden relative">
                <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 0.5}} className="flex gap-3">
                   <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden mt-1 border border-white/10">
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                   </div>
                   <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none text-xs text-gray-300">
                      Great job on the streak! 🧘‍♀️ Anyone around for coffee?
                   </div>
                </motion.div>

                <motion.div initial={{opacity:0, x:-10}} animate={{opacity:1, x:0}} transition={{delay: 1.5}} className="flex gap-3">
                   <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden mt-1 border border-white/10">
                     <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                   </div>
                   <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none text-xs text-gray-300">
                      I'm heading to The Daily Grind in 10 mins.
                   </div>
                </motion.div>

                 <motion.div initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} transition={{delay: 2.5}} className="flex gap-3 flex-row-reverse">
                   <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 p-3 rounded-2xl rounded-tr-none text-xs text-white">
                      Perfect. See you there!
                   </div>
                </motion.div>
                
                {/* Typing Indicator */}
                <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 3.5}} className="flex gap-2 ml-11 items-center">
                   <span className="text-[10px] text-gray-500 italic">Jordan is typing...</span>
                </motion.div>
             </div>

             {/* Input Area */}
             <div className="p-4 border-t border-white/5 bg-neutral-900 pb-8">
                <div className="bg-neutral-800 rounded-full h-10 flex items-center px-4 justify-between border border-white/5">
                   <span className="text-gray-500 text-xs">Message group...</span>
                   <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                      <ArrowRight size={12} className="text-white" />
                   </div>
                </div>
             </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- BRAND ICONS ---
const BrandIcon = ({ brand, className }) => {
  switch (brand) {
    case 'whatsapp':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      );
    case 'reddit':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
        </svg>
      );
    case 'tinder':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M1.977 11.837c.062-4.067 2.666-6.613 2.666-6.613s1.818-1.47 4.44-1.96c0 0-1.23 2.32 0 4.113 0 0 3.265-4.53 2.46-7.377 0 0 7.66 2.798 6.33 9.373 0 0 2.865-.39 4.144 1.668 0 0 1.89 2.587-.25 6.842-2.35 4.67-7.53 6.11-11.73 4.6-4.2-1.51-5.31-5.24-5.31-5.24s-2.81-1.36-2.75-5.406zm7.63 9.15c4.44 1.54 8.16-1.18 8.16-1.18s2.17-2.97.34-6.11c0 0-1.76-2.68-4.69-1.73 0 0 .93 2.46-.8 4.47 0 0-2.83-2.66-.6-6.64 0 0-3.74 1.83-3.21 6.36 0 0-.22 1.84.8 4.83z"/>
        </svg>
      );
    case 'meetup':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M15.93 11.625c.433-2.166 2.599-2.599 3.898-1.299l.433.433c.433.433.866.433 1.299.433.433 0 .866-.433.866-.866 0-.433-.433-.866-.866-1.299-1.732-1.732-4.764-1.299-5.63.866l-.433.866c-.433.866-1.299.866-1.732 0l-.433-.866c-.866-2.165-3.898-2.598-5.63-.866-.433.433-.866.866-.866 1.299 0 .433.433.866.866.866.433 0 .866 0 1.299-.433l.433-.433c1.299-1.299 3.465-.866 3.898 1.299l.433 2.165c.433 2.165 3.465 2.165 3.898 0l.433-2.165zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
      );
    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
};

// --- MARKET CONVERGENCE COMPONENT ---
const MarketConvergence = () => {
  const [activeSlice, setActiveSlice] = useState(null);

  const competitors = [
    { id: 'whatsapp', name: 'WhatsApp', color: 'bg-green-500', capture: 'Chat', desc: 'Purposeful communication', angle: 0, icon: 'whatsapp', total: '2.8B', totalValue: 2800, target: '5M', targetValue: 5 },
    { id: 'instagram', name: 'Instagram', color: 'bg-purple-500', capture: 'Visuals', desc: 'Authentic moments', angle: 60, icon: 'instagram', total: '2.4B', totalValue: 2400, target: '8M', targetValue: 8 },
    { id: 'reddit', name: 'Reddit', color: 'bg-orange-500', capture: 'Tribes', desc: 'Shared interests', angle: 120, icon: 'reddit', total: '850M', totalValue: 850, target: '4M', targetValue: 4 },
    { id: 'twitter', name: 'X / Twitter', color: 'bg-sky-500', capture: 'Pulse', desc: 'Civil discourse', angle: 180, icon: 'twitter', total: '600M', totalValue: 600, target: '3M', targetValue: 3 },
    { id: 'meetup', name: 'Meetup', color: 'bg-red-500', capture: 'Events', desc: 'Real world gathering', angle: 240, icon: 'meetup', total: '60M', totalValue: 60, target: '2M', targetValue: 2 },
    { id: 'tinder', name: 'Tinder', color: 'bg-pink-500', capture: 'Match', desc: 'Soul compatibility', angle: 300, icon: 'tinder', total: '75M', totalValue: 75, target: '1.5M', targetValue: 1.5 },
  ];

  const totalMarket = competitors.reduce((sum, comp) => sum + comp.totalValue, 0);
  const totalTarget = competitors.reduce((sum, comp) => sum + comp.targetValue, 0);
  const capturePct = Math.min(100, (totalTarget / totalMarket) * 100);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Aggregate Target HUD */}
      <motion.div 
        className="absolute top-6 right-6 z-40 w-72 bg-neutral-900/80 border border-cyan-400/30 rounded-2xl p-4 shadow-xl backdrop-blur-xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-gray-400">Capture Plan</div>
            <div className="text-sm text-white">Targeting high-intent users</div>
          </div>
          <div className="text-xs text-cyan-400 font-mono">{totalTarget.toFixed(1)}M</div>
        </div>
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${capturePct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-400 mt-2">
          <span>Market: {(totalMarket / 1000).toFixed(1)}B users</span>
          <span>Weave: {totalTarget.toFixed(1)}M</span>
        </div>
      </motion.div>

      {/* Central Weave Core */}
      <motion.div 
        className="absolute z-20 w-48 h-48 rounded-full bg-neutral-950 border-4 border-white/20 flex flex-col items-center justify-center shadow-[0_0_100px_rgba(6,182,212,0.4)]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, delay: 0.5, type: "spring" }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-pink-500/20 animate-pulse"></div>
        <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text relative z-10">WEAVE</h3>
        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1 relative z-10">The Nexus</p>
        <div className="mt-2 text-[10px] text-cyan-400 font-mono relative z-10">Target: 23.5M Users</div>
      </motion.div>

      {/* Competitor Bubbles */}
      {competitors.map((comp, i) => {
        const radius = 160; // Distance from center
        const x = Math.cos((comp.angle * Math.PI) / 180) * radius;
        const y = Math.sin((comp.angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={comp.id}
            className={`absolute ${activeSlice === comp.id ? 'z-50' : 'z-10'}`}
            initial={{ x: x * 2.5, y: y * 2.5, opacity: 0 }}
            animate={{ x: x, y: y, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 + i * 0.1, type: "spring" }}
            onHoverStart={() => setActiveSlice(comp.id)}
            onHoverEnd={() => setActiveSlice(null)}
          >
            {/* The Bubble */}
            <motion.div 
              className={`w-32 h-32 rounded-full ${comp.color} bg-opacity-10 backdrop-blur-md border border-white/10 flex flex-col items-center justify-center cursor-pointer relative group`}
              whileHover={{ scale: 1.2, zIndex: 50 }}
            >
              <div className={`absolute inset-0 rounded-full ${comp.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity`}></div>
              <BrandIcon brand={comp.icon} className="w-8 h-8 text-white mb-2 opacity-80 group-hover:opacity-100" />
              <span className="text-xs font-bold text-white opacity-60 group-hover:opacity-100">{comp.name}</span>
              <span className="text-[10px] text-gray-400 mt-1">{comp.total} Users</span>
              
              {/* Connection Line */}
              <motion.div 
                className="absolute top-1/2 left-1/2 w-[200px] h-[2px] origin-left bg-gradient-to-r from-white/20 to-transparent -z-10"
                style={{ 
                  rotate: `${comp.angle + 180}deg`,
                  width: '160px' // Connect to center
                }}
              />
            </motion.div>

            {/* Capture Label (The "Venn" Intersection Info) */}
            <AnimatePresence>
              {activeSlice === comp.id && (
                <motion.div 
                  className={`absolute left-1/2 -translate-x-1/2 w-56 bg-neutral-900/90 border border-white/20 p-4 rounded-xl shadow-2xl z-50 text-center backdrop-blur-xl ${y > 0 ? 'bottom-full mb-4' : 'top-full mt-4'}`}
                  initial={{ opacity: 0, y: y > 0 ? 10 : -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: y > 0 ? 10 : -10 }}
                >
                  <div className="text-xs text-gray-500 uppercase mb-1">We Capture</div>
                  <div className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400`}>{comp.capture}</div>
                  <div className="text-xs text-cyan-400 mt-1 mb-2">{comp.desc}</div>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
                    <div className="text-left">
                      <div className="text-[10px] text-gray-500">Total Market</div>
                      <div className="text-xs font-bold text-white">{comp.total}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-500">Weave Target</div>
                      <div className="text-xs font-bold text-cyan-400">{comp.target}</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Orbiting Particles representing Users migrating */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          animate={{
            offsetDistance: "100%",
            scale: [1, 1.5, 1],
            opacity: [0, 1, 0]
          }}
          style={{
            offsetPath: `path("M ${Math.cos(i * 30 * Math.PI/180) * 250} ${Math.sin(i * 30 * Math.PI/180) * 250} L 0 0")`,
            offsetRotate: "0deg",
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

// --- RELATIONSHIP ECONOMY COMPONENT ---
const RelationshipEconomy = () => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const nodes = [
    { 
      id: 'chat', 
      brand: 'whatsapp', 
      label: 'Deep Chat', 
      replace: 'WhatsApp', 
      desc: 'Context-aware. Purposeful.',
      color: 'from-green-400 to-emerald-600',
      pos: { x: -140, y: -100 },
      mockup: 'chat'
    },
    { 
      id: 'visual', 
      brand: 'instagram', 
      label: 'Moments', 
      replace: 'Instagram', 
      desc: 'Memories, not vanity.',
      color: 'from-purple-500 to-pink-600',
      pos: { x: 140, y: -100 },
      mockup: 'visual'
    },
    { 
      id: 'match', 
      brand: 'tinder', 
      label: 'Soul Sync', 
      replace: 'Tinder', 
      desc: 'Connection, not swiping.',
      color: 'from-pink-500 to-rose-600',
      pos: { x: -190, y: 0 },
      mockup: 'match'
    },
    { 
      id: 'event', 
      brand: 'meetup', 
      label: 'Gather', 
      replace: 'Meetup', 
      desc: 'Community, not tickets.',
      color: 'from-red-500 to-red-700',
      pos: { x: 190, y: 0 },
      mockup: 'event'
    },
    { 
      id: 'voice', 
      brand: 'twitter', 
      label: 'Pulse', 
      replace: 'X / Twitter', 
      desc: 'Dialogue, not shouting.',
      color: 'from-sky-500 to-blue-600',
      pos: { x: -100, y: 130 },
      mockup: 'voice',
      tooltipPos: 'top'
    },
    { 
      id: 'tribe', 
      brand: 'reddit', 
      label: 'Tribes', 
      replace: 'Reddit', 
      desc: 'Belonging, not arguing.',
      color: 'from-orange-400 to-red-500',
      pos: { x: 100, y: 130 },
      mockup: 'tribe',
      tooltipPos: 'top'
    }
  ];

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Background Orbit Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          className="w-[450px] h-[450px] rounded-full border border-cyan-400/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute w-[300px] h-[300px] rounded-full border border-pink-500/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Central Core */}
      <div className="relative z-20 flex flex-col items-center justify-center">
        <motion.div 
          className="w-32 h-32 rounded-full bg-neutral-950 border-4 border-cyan-400 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.3)] relative"
          animate={{ boxShadow: ["0 0 50px rgba(6,182,212,0.3)", "0 0 80px rgba(236,72,153,0.5)", "0 0 50px rgba(6,182,212,0.3)"] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-pink-500/20 animate-pulse"></div>
          <HeartPulse className="w-12 h-12 text-white relative z-10" />
        </motion.div>
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">RELATIONSHIP<br/>ECONOMY</h3>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-2">The New Standard</p>
        </div>
      </div>

      {/* Orbiting Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.id}
          className="absolute z-30"
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: node.pos.x, y: node.pos.y, opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.2, type: "spring" }}
          onHoverStart={() => setHoveredNode(node.id)}
          onHoverEnd={() => setHoveredNode(null)}
          onClick={() => setSelectedNode(node)}
        >
          <motion.div 
            className={`relative group cursor-pointer`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Connection Line to Center */}
            <svg className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: -1 }}>
              <motion.line 
                x1="200" 
                y1="200" 
                x2={200 - node.pos.x * 0.8} 
                y2={200 - node.pos.y * 0.8} 
                stroke="url(#threadGradient)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 1 + i * 0.2 }}
              />
            </svg>

            {/* Node Circle */}
            <div className={`w-20 h-20 rounded-full bg-neutral-900 border-2 border-white/10 flex items-center justify-center shadow-xl relative overflow-hidden group-hover:border-white/50 transition-colors`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${node.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <BrandIcon brand={node.brand} className="w-10 h-10 text-white" />
            </div>

            {/* Hover Card */}
            <AnimatePresence>
              {hoveredNode === node.id && !selectedNode && (
                <motion.div 
                  className={`absolute left-1/2 -translate-x-1/2 w-48 bg-neutral-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl z-50 pointer-events-none ${node.tooltipPos === 'top' ? 'bottom-full mb-4' : 'top-full mt-4'}`}
                  initial={{ opacity: 0, y: node.tooltipPos === 'top' ? 10 : -10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: node.tooltipPos === 'top' ? 10 : -10, scale: 0.9 }}
                >
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">Replaces {node.replace}</div>
                  <div className="text-white font-bold mb-1">{node.label}</div>
                  <div className="text-xs text-gray-400 leading-tight">{node.desc}</div>
                  <div className="mt-2 text-[10px] text-cyan-400 font-mono">Click to view demo</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ))}

      {/* Feature Modal */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedNode(null)}></div>
            <motion.div 
              className="relative w-[320px] h-[600px] bg-neutral-950 rounded-[3rem] border-[8px] border-neutral-800 shadow-2xl overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 z-50 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X size={16} />
              </button>

              {/* Mockup Content */}
              <div className="w-full h-full bg-neutral-900 overflow-hidden relative">
                {/* Header */}
                <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/80 to-transparent z-20 pt-8 px-6 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${selectedNode.color} flex items-center justify-center`}>
                    <BrandIcon brand={selectedNode.brand} className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold">{selectedNode.label}</span>
                </div>

                {/* Chat Mockup */}
                {selectedNode.mockup === 'chat' && (
                  <div className="pt-24 px-4 space-y-4">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                      <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none text-sm text-gray-300 max-w-[80%]">
                        Hey! Are we still on for the jazz night?
                      </div>
                    </div>
                    <div className="flex gap-2 flex-row-reverse">
                      <div className="bg-cyan-500/20 text-cyan-400 p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%] border border-cyan-500/20">
                        Absolutely. The whole group is coming!
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                      <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none text-sm text-gray-300 max-w-[80%]">
                        I'm bringing a friend who's new to the city.
                      </div>
                    </div>
                    <div className="mt-8 text-center text-xs text-gray-500 uppercase tracking-widest">Context Aware • No Noise</div>
                  </div>
                )}

                {/* Visual Mockup */}
                {selectedNode.mockup === 'visual' && (
                  <div className="pt-0 h-full">
                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400" className="w-full h-2/3 object-cover" />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-pink-500"></div>
                          <span className="text-white font-bold text-sm">Sarah</span>
                        </div>
                        <span className="text-gray-500 text-xs">2m ago</span>
                      </div>
                      <p className="text-gray-300 text-sm">Real moments. No filters. Just us.</p>
                    </div>
                  </div>
                )}

                {/* Tribe Mockup */}
                {selectedNode.mockup === 'tribe' && (
                  <div className="pt-24 px-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs text-orange-500 font-bold">r/Mindfulness</span>
                          <span className="text-xs text-gray-500">• 2h ago</span>
                        </div>
                        <h4 className="text-white font-bold text-sm mb-2">Weekly meditation meetup in the park?</h4>
                        <div className="flex gap-4 text-gray-500 text-xs">
                          <span>24 comments</span>
                          <span>12 attending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Match Mockup */}
                {selectedNode.mockup === 'match' && (
                  <div className="h-full flex flex-col items-center justify-center p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-black"></div>
                    <div className="w-full aspect-[3/4] bg-neutral-800 rounded-2xl overflow-hidden relative shadow-2xl border border-pink-500/20">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black to-transparent">
                        <h3 className="text-2xl font-bold text-white">Elena, 28</h3>
                        <p className="text-pink-400 text-sm">98% Compatibility</p>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-8">
                      <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center text-red-500 border border-red-500/20">✕</div>
                      <div className="w-14 h-14 rounded-full bg-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">♥</div>
                    </div>
                  </div>
                )}

                {/* Event Mockup */}
                {selectedNode.mockup === 'event' && (
                  <div className="pt-20 px-0">
                    <div className="bg-neutral-800 mx-4 rounded-2xl overflow-hidden border border-white/10">
                      <div className="h-32 bg-red-500/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-red-500 font-black text-4xl opacity-20">NOV 24</div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2">Tech Founders Mixer</h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                          <MapPin size={14} />
                          <span>Weave House, Berlin</span>
                        </div>
                        <button className="w-full py-3 bg-red-500 rounded-xl text-white font-bold text-sm">Join Guestlist</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voice Mockup */}
                {selectedNode.mockup === 'voice' && (
                  <div className="pt-24 px-4 space-y-4">
                    <div className="bg-neutral-800/50 p-4 rounded-xl border border-white/5">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-sky-500 flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold text-sm">Alex</span>
                            <span className="text-gray-500 text-xs">@alex_w • 1h</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            Just had the most incredible conversation about sustainable living. No trolls, just pure exchange of ideas. This is what social media should be. 🌿
                          </p>
                          <div className="flex gap-6 mt-3 text-gray-500 text-xs">
                            <span className="flex items-center gap-1">💬 12</span>
                            <span className="flex items-center gap-1">⚡ 45</span>
                            <span className="flex items-center gap-1">♥ 128</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-neutral-800/30 p-4 rounded-xl border border-white/5 ml-8">
                       <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500 flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-bold text-sm">Sarah</span>
                            <span className="text-gray-500 text-xs">@sarah_j • 45m</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            Totally agree! It feels so refreshing to actually connect.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Label */}
      <motion.div 
        className="absolute bottom-0 flex items-center gap-2 text-sm text-gray-500 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <Infinity className="w-4 h-4 text-cyan-400" />
        <span>RETENTION LOOP: INFINITE</span>
      </motion.div>
    </div>
  );
};

// --- THEME CONFIGURATION ---
const THEME = {
  bg: "bg-black", // Deep black
  text: "text-white", // White text
  accent: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600", // Vibrant gradient
  accentBg: "bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600",
  accentSimple: "bg-cyan-400",
  white: "bg-neutral-900",
  border: "border-cyan-400",
  secondary: "text-gray-300",
  card: "bg-neutral-950 border border-neutral-800"
};

// --- INTERACTIVE APP DEMO COMPONENT ---
// Ambient Particles Background Component
const AmbientParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-cyan-400/20 to-pink-400/20"
          animate={{
            x: Math.cos(i) * 40 + "px",
            y: Math.sin(i * 1.5) * 40 + "px",
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + i * 8}%`,
          }}
        />
      ))}
    </div>
  );
};

// Status Bar Component
const StatusBar = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-1 left-0 right-0 px-3 h-5 flex items-center justify-between z-30 text-[8px] text-white font-semibold">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <motion.div
        className="text-cyan-300 tracking-widest"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        AI-POWERED
      </motion.div>
      <div className="flex items-center gap-0.5">
        <span>📡</span>
        <span>🔋</span>
      </div>
    </div>
  );
};

// Floating Notification Component
const FloatingNotifications = ({ notification }) => {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-8 left-3 right-3 z-40 bg-neutral-800/95 border border-white/10 rounded-xl px-3 py-2 text-[9px] text-gray-200 backdrop-blur shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{notification.icon}</span>
            <span className="font-medium">{notification.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Shimmer Loading Effect Component
const ShimmerLoader = () => (
  <div className="p-4 space-y-4">
    {[1, 2, 3].map(i => (
      <motion.div
        key={i}
        className="h-12 bg-neutral-800/50 rounded-xl overflow-hidden"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['0%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    ))}
  </div>
);

const InteractiveAppDemo = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [notification, setNotification] = useState(null);
  const [liveCounters, setLiveCounters] = useState({ connections: 18, replies: 3, tribes: 3 });
  const [isLoading, setIsLoading] = useState(false);

  // NEW: Interconnected demo state
  const [demoStage, setDemoStage] = useState(0);
  const [cascadeNotifications, setCascadeNotifications] = useState([]);
  const [activeConnections, setActiveConnections] = useState([]);
  const [pulseFeature, setPulseFeature] = useState(null);
  const [showStoryMode, setShowStoryMode] = useState(true);

  // Interactive State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hey! Are you going to the event tonight?", sender: 'them', time: '10:30 AM' },
    { id: 2, text: "Yes! I'll be there around 8.", sender: 'me', time: '10:32 AM' },
    { id: 3, text: "Awesome, see you there! 🥂", sender: 'them', time: '10:33 AM' },
    { id: 4, text: "Can't wait!", sender: 'me', time: '10:35 AM' },
    { id: 5, text: "Btw, is it casual or dressy?", sender: 'them', time: '10:36 AM' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState('none'); // none, going
  const [matchStatus, setMatchStatus] = useState('none'); // none, connected, passed
  const [copilotCopied, setCopilotCopied] = useState(false);

  // Floating notifications
  const showNotification = (text, icon = '✨') => {
    setNotification({ text, icon });
    setTimeout(() => setNotification(null), 3000);
  };

  // NEW: Cascade notification system - shows interconnected effects
  const triggerCascade = (notifications) => {
    notifications.forEach((notif, idx) => {
      setTimeout(() => {
        setCascadeNotifications(prev => [...prev, { ...notif, id: Date.now() + idx }]);
        if (notif.pulseFeature) setPulseFeature(notif.pulseFeature);
        if (notif.connection) setActiveConnections(prev => [...prev, notif.connection]);
        
        // Auto-remove each notification after 2 seconds
        setTimeout(() => {
          setCascadeNotifications(prev => prev.filter(n => n.id !== Date.now() + idx));
        }, 2000);
      }, idx * 1000);
    });
    
    // Clear everything after sequence completes
    setTimeout(() => {
      setCascadeNotifications([]);
      setPulseFeature(null);
      setActiveConnections([]);
    }, notifications.length * 1000 + 2500);
  };

  // NEW: Auto-play interconnected demo sequence - ONE TIME ONLY then stops
  useEffect(() => {
    if (!showStoryMode || demoStage > 0) return; // Only run once
    
    const storySequence = [
      // Stage 0: Initial notification burst
      { delay: 1500, action: () => {
        triggerCascade([
          { text: "🧘 Morning meditation complete", icon: "✨", pulseFeature: "soul" },
          { text: "👥 3 neighbors share your rhythm", icon: "🏘️", pulseFeature: "tribes", connection: "soul-tribes" },
        ]);
      }},
      // Stage 1: Show connection
      { delay: 6000, action: () => {
        triggerCascade([
          { text: "🎵 Jazz event matches your vibe", icon: "🎯", pulseFeature: "gather", connection: "tribes-gather" },
          { text: "☕ Alex invited you to coffee", icon: "💬", pulseFeature: "chat", connection: "gather-ai" },
        ]);
      }},
      // Stage 2: End story mode - let user explore
      { delay: 12000, action: () => {
        setShowStoryMode(false);
        setCascadeNotifications([]);
        setPulseFeature(null);
        setActiveConnections([]);
      }},
    ];

    storySequence.forEach(({ delay, action }) => {
      const timer = setTimeout(action, delay);
      return () => clearTimeout(timer);
    });

  }, [showStoryMode, demoStage]);

  // Live counter updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounters(prev => ({
        connections: prev.connections + (Math.random() > 0.6 ? 1 : 0),
        replies: prev.replies + (Math.random() > 0.7 ? 1 : 0),
        tribes: prev.tribes
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Swipe detection
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setSwipeDelta(e.touches[0].clientX - touchStart);
  const handleTouchEnd = () => {
    if (swipeDelta > 50) {
      setActiveFeature(null);
    }
    setSwipeDelta(0);
  };

  // Feature loading simulation
  const openFeature = (feature) => {
    setIsLoading(true);
    setShowStoryMode(false); // Pause story mode when user interacts
    setTimeout(() => {
      setActiveFeature(feature);
      setIsLoading(false);
    }, 600);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: chatInput,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput("");
    
    // Simulate reply
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sounds good! See ya 👋",
        sender: 'them',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      showNotification("New message from Alex", "💬");
    }, 2000);
  };

  const renderFeature = () => {
    switch(activeFeature) {
      case 'ai':
        return (
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            <div className="text-center mt-4">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 p-1 animate-pulse">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-white font-bold mt-4 text-lg">Alex, 28</h3>
              <p className="text-cyan-400 text-sm font-mono">95% Compatibility</p>
            </div>
            <div className="bg-neutral-800/50 p-4 rounded-xl border border-cyan-400/20 mt-4">
              <p className="text-gray-300 text-sm italic leading-relaxed">"Alex also loves jazz and hiking. We think you'd hit it off! He's looking for a climbing partner."</p>
            </div>
            
            {matchStatus === 'none' ? (
              <div className="flex gap-2 mt-4">
                 <button 
                   onClick={() => { setMatchStatus('passed'); showNotification('Passed', '👋'); }}
                   className="flex-1 py-3 bg-neutral-800 rounded-xl text-white font-bold text-xs border border-white/10 hover:bg-neutral-700 transition-colors"
                 >
                   Pass
                 </button>
                 <button 
                   onClick={() => { setMatchStatus('connected'); showNotification('Connection Request Sent!', '🚀'); }}
                   className="flex-1 py-3 bg-cyan-500 rounded-xl text-black font-bold text-xs shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
                 >
                   Connect
                 </button>
              </div>
            ) : matchStatus === 'connected' ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-center"
              >
                <div className="text-green-400 font-bold text-sm mb-1">Request Sent!</div>
                <div className="text-green-300/70 text-xs">Waiting for Alex to accept...</div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 p-4 bg-neutral-800 border border-white/10 rounded-xl text-center"
              >
                <div className="text-gray-400 font-bold text-sm">Passed</div>
              </motion.div>
            )}
          </div>
        );
      case 'moments':
        return (
          <div className="h-full overflow-y-auto bg-black">
             {[1, 2].map(i => (
               <div key={i} className="mb-4 relative">
                 <img src={`https://images.unsplash.com/photo-${i === 1 ? '1492684223066-81342ee5ff30' : '1511632765486-a01980e01a18'}?auto=format&fit=crop&q=80&w=400`} className="w-full aspect-[4/5] object-cover" />
                 <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center gap-2 mb-2">
                       <div className="w-8 h-8 rounded-full bg-purple-500 border border-white"></div>
                       <span className="text-white text-sm font-bold">Sarah</span>
                    </div>
                    <p className="text-white text-xs opacity-90">Rooftop vibes with the crew! 🌆 #WeaveMoments</p>
                 </div>
               </div>
             ))}
          </div>
        );
      case 'soul':
        return (
          <div className="p-4 h-full flex flex-col items-center justify-center text-center">
             <div className="w-32 h-32 rounded-full border-4 border-pink-500 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 rounded-full border-4 border-pink-500 animate-ping opacity-20"></div>
                <HeartPulse className="w-12 h-12 text-pink-500" />
             </div>
             <h3 className="text-2xl font-black text-white mb-2">Soul Sync</h3>
             <p className="text-gray-400 text-sm mb-8">Analyzing your values, interests, and goals...</p>
             <div className="w-full bg-neutral-800 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div className="h-full bg-pink-500" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} />
             </div>
             <p className="text-pink-500 text-xs font-mono">FINDING YOUR TRIBE</p>
          </div>
        );
      case 'tribes':
        return (
          <div className="h-full overflow-y-auto p-4 space-y-3">
             <h3 className="text-white font-bold text-lg mb-4">Your Tribes</h3>
             {['Mindfulness NYC', 'Tech Founders', 'Sunday Hikers'].map((t, i) => (
               <div key={i} className="bg-neutral-800 p-3 rounded-xl border border-orange-500/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-xs">#{i+1}</div>
                  <div>
                     <div className="text-white font-bold text-sm">{t}</div>
                     <div className="text-gray-500 text-xs">12 active now</div>
                  </div>
               </div>
             ))}
          </div>
        );
      case 'gather':
        return (
          <div className="h-full relative">
             <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400" className="w-full h-1/2 object-cover" />
             <div className="p-4 -mt-6 relative bg-neutral-900 rounded-t-3xl min-h-[50%]">
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-1">Sunset Jazz</h3>
                <p className="text-red-400 text-xs font-bold uppercase mb-4">Tonight • 8:00 PM</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">Join us for an evening of smooth jazz and cocktails on the roof. Members only.</p>
                
                {rsvpStatus === 'none' ? (
                  <button 
                    onClick={() => { setRsvpStatus('going'); showNotification("You're on the list!", "🎟️"); }}
                    className="w-full py-3 bg-red-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:bg-red-600 transition-colors"
                  >
                    RSVP
                  </button>
                ) : (
                  <button 
                    className="w-full py-3 bg-green-500 rounded-xl text-white font-bold text-sm shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                    disabled
                  >
                    <CheckCircle size={16} /> Going
                  </button>
                )}
             </div>
          </div>
        );
      case 'pulse':
        return (
          <div className="h-full overflow-y-auto p-4 space-y-4">
             <h3 className="text-white font-bold text-lg mb-2">Pulse</h3>
             {[1, 2, 3].map(i => (
               <div key={i} className="border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-sky-500"></div>
                     <span className="text-white text-xs font-bold">@user_{i}</span>
                     <span className="text-gray-500 text-[10px]">2h</span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">Just had the most amazing deep talk session. This app is changing how I connect. 🚀</p>
                  <div className="flex gap-4 mt-2 text-gray-500 text-[10px]">
                     <span>💬 5</span>
                     <span>♥ 24</span>
                  </div>
               </div>
             ))}
          </div>
        );
      case 'chat':
        return (
          <div className="h-full flex flex-col">
             <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-2 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                     {msg.sender === 'them' && <div className="w-8 h-8 rounded-full bg-green-500 flex-shrink-0"></div>}
                     <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                       msg.sender === 'me' 
                         ? 'bg-green-500/20 text-green-400 rounded-tr-none border border-green-500/20' 
                         : 'bg-neutral-800 text-gray-300 rounded-tl-none'
                     }`}>
                        {msg.text}
                        <div className={`text-[9px] mt-1 opacity-50 ${msg.sender === 'me' ? 'text-right' : ''}`}>{msg.time}</div>
                     </div>
                  </div>
                ))}
             </div>
             <div className="p-3 bg-neutral-800 border-t border-white/5 flex gap-2">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-neutral-900 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-green-500/50"
                />
                <button 
                  onClick={handleSendMessage}
                  className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-400 transition-colors"
                >
                  <ArrowRight size={14} />
                </button>
             </div>
          </div>
        );
      case 'copilot':
        return (
          <div className="h-full flex flex-col p-4">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                   <Sparkles className="text-white w-5 h-5" />
                </div>
                <div>
                   <h3 className="text-white font-bold text-lg">Weave Copilot</h3>
                   <p className="text-indigo-400 text-xs font-mono">AI WINGMAN ACTIVE</p>
                </div>
             </div>
             
             <div className="space-y-4">
                {/* User Query */}
                <div className="bg-neutral-800/50 p-3 rounded-xl rounded-tr-none border border-white/5 ml-8">
                   <p className="text-gray-300 text-xs">How do I start a convo with Alex?</p>
                </div>
  
                {/* AI Response */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-4 rounded-xl rounded-tl-none border border-indigo-500/30 relative overflow-hidden"
                >
                   <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                   <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                         <Sparkles className="w-3 h-3 text-indigo-400" />
                         <span className="text-indigo-300 text-[10px] font-bold uppercase">Analysis Complete</span>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                         Alex lists <span className="text-cyan-400 font-bold">Jazz</span> and <span className="text-cyan-400 font-bold">Hiking</span> as top interests.
                      </p>
                      <div className="mt-3 bg-black/40 p-3 rounded-lg border border-indigo-400/20">
                         <p className="text-indigo-200 text-xs italic">"I see you're into Jazz! Have you checked out the Sunset Jazz event tonight?"</p>
                      </div>
                      <button 
                        onClick={() => { 
                          setCopilotCopied(true); 
                          setChatInput("I see you're into Jazz! Have you checked out the Sunset Jazz event tonight?");
                          showNotification("Copied to clipboard!", "📋");
                          setTimeout(() => setCopilotCopied(false), 2000);
                        }}
                        className={`mt-3 w-full py-2 rounded-lg text-white text-xs font-bold transition-colors ${
                          copilotCopied ? 'bg-green-500' : 'bg-indigo-500 hover:bg-indigo-400'
                        }`}
                      >
                         {copilotCopied ? 'Copied!' : 'Copy & Send'}
                      </button>
                   </div>
                </motion.div>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="relative w-[280px] h-[560px] bg-neutral-900 rounded-[32px] border-4 border-neutral-700 shadow-[0_25px_80px_rgba(6,182,212,0.35)] overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
       {/* Ambient Background */}
       <AmbientParticles />

       {/* NEW: Connection Lines SVG Overlay */}
       <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" style={{ overflow: 'visible' }}>
         <defs>
           <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#06b6d4" />
             <stop offset="50%" stopColor="#ec4899" />
             <stop offset="100%" stopColor="#a855f7" />
           </linearGradient>
         </defs>
         {activeConnections.includes('soul-tribes') && (
           <motion.line
             x1="200" y1="280" x2="70" y2="380"
             stroke="url(#connectionGrad)"
             strokeWidth="2"
             strokeDasharray="4 4"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 0.8 }}
           />
         )}
         {activeConnections.includes('tribes-gather') && (
           <motion.line
             x1="70" y1="380" x2="140" y2="320"
             stroke="url(#connectionGrad)"
             strokeWidth="2"
             strokeDasharray="4 4"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 0.8 }}
           />
         )}
         {activeConnections.includes('gather-ai') && (
           <motion.line
             x1="140" y1="320" x2="140" y2="160"
             stroke="url(#connectionGrad)"
             strokeWidth="2"
             strokeDasharray="4 4"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 0.8 }}
           />
         )}
         {activeConnections.includes('ai-chat') && (
           <motion.line
             x1="140" y1="160" x2="140" y2="480"
             stroke="url(#connectionGrad)"
             strokeWidth="2"
             strokeDasharray="4 4"
             initial={{ pathLength: 0, opacity: 0 }}
             animate={{ pathLength: 1, opacity: 1 }}
             transition={{ duration: 0.8 }}
           />
         )}
       </svg>

       {/* NEW: Cascade Notifications Stack - max 2 at a time */}
       <div className="absolute top-8 left-2 right-2 z-50 space-y-2 pointer-events-none">
         <AnimatePresence mode="popLayout">
           {cascadeNotifications.slice(-2).map((notif, idx) => (
             <motion.div
               key={notif.id}
               initial={{ opacity: 0, y: -20, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, x: 100, scale: 0.8 }}
               transition={{ type: "spring", damping: 20 }}
               className="bg-gradient-to-r from-neutral-800/95 to-neutral-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-xl px-3 py-2 shadow-lg shadow-cyan-500/20 flex items-center gap-2"
             >
               <motion.div 
                 className="text-lg"
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 0.5 }}
               >
                 {notif.icon}
               </motion.div>
               <div className="flex-1 min-w-0">
                 <div className="text-white text-[10px] font-medium truncate">{notif.text}</div>
               </div>
               {notif.connection && (
                 <motion.div 
                   className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500"
                   animate={{ scale: [1, 1.5, 1] }}
                   transition={{ duration: 1, repeat: Infinity }}
                 />
               )}
             </motion.div>
           ))}
         </AnimatePresence>
       </div>

       {/* Status Bar */}
       <StatusBar />

       {/* Floating Notifications */}
       <FloatingNotifications notification={notification} />

       {/* Header */}
       <div className="absolute top-6 left-0 w-full h-8 bg-black/60 backdrop-blur-xl flex items-center justify-between px-4 z-20 border-b border-white/5">
          {activeFeature ? (
            <button onClick={() => { setActiveFeature(null); setShowStoryMode(true); }} className="text-white hover:text-cyan-400 flex items-center gap-1 text-[10px] font-bold transition-colors">
              <ArrowLeft size={12} /> BACK
            </button>
          ) : (
            <span className="text-cyan-400 font-bold text-[12px] tracking-wider">WEAVE OS</span>
          )}
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
             {showStoryMode && (
               <motion.span 
                 className="text-[8px] text-cyan-400 ml-1"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 2, repeat: Infinity }}
               >
                 DEMO
               </motion.span>
             )}
          </div>
       </div>

       {/* Content */}
       <div 
         className="absolute top-14 bottom-10 w-full bg-neutral-900 overflow-hidden"
         style={{ transform: activeFeature ? 'translateX(0)' : `translateX(${swipeDelta * 0.5}px)` }}
       >
          <AnimatePresence mode="wait">
            {!activeFeature ? (
              <motion.div 
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 h-full overflow-y-auto space-y-3"
              >
                {/* Ambient hero bar for instant vibe check */}
                <motion.div 
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-800 via-neutral-900 to-black border border-white/5 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.4),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.4),transparent_35%)]" />
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-white font-black text-xs tracking-[0.08em]">WEAVE SIGNAL</div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.div className="text-white text-lg font-black">
                        {liveCounters.connections} connections
                      </motion.div>
                      <div className="text-gray-400 text-[10px]">Tonight • Brooklyn</div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => showNotification('3 new matches found!', '✨')}
                      className="px-3 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white font-bold backdrop-blur hover:bg-white/10 transition-colors"
                    >
                      Quick intro
                    </motion.button>
                  </div>
                </motion.div>

                <div className="grid grid-cols-2 gap-2 relative">
                  {/* Dynamic floating context popups based on story mode */}
                  <AnimatePresence>
                    {showStoryMode && !cascadeNotifications.length && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: 0.1 }}
                        className="absolute -top-6 right-0 bg-neutral-800/90 border border-white/10 rounded-xl px-3 py-2 shadow-lg shadow-cyan-500/10 text-[9px] text-gray-200 flex items-center gap-2 backdrop-blur z-10"
                      >
                        <motion.div 
                          className="w-5 h-5 rounded-lg bg-gradient-to-br from-cyan-400/40 to-blue-500/40 flex items-center justify-center text-[10px] text-cyan-200"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          🔗
                        </motion.div>
                        <div className="truncate">Watch the ecosystem flow...</div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* AI Match Widget - Large */}
                  <motion.div 
                    onClick={() => { openFeature('ai'); showNotification('Opening Smart Matching...', '🤖'); }}
                    className={`col-span-2 bg-neutral-800/80 border rounded-2xl p-3 relative overflow-hidden cursor-pointer group hover:border-cyan-400/60 hover:bg-neutral-800 transition-all ${pulseFeature === 'ai' ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-cyan-400/30'}`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: pulseFeature === 'ai' ? [1, 1.02, 1] : 1
                    }}
                    transition={{ delay: 0.15, duration: pulseFeature === 'ai' ? 0.5 : 0.3 }}
                  >
                    <div className="absolute top-0 right-0 p-2">
                      <motion.div 
                        className="bg-cyan-500/30 text-cyan-300 text-[8px] font-bold px-2 py-1 rounded-full backdrop-blur-sm border border-cyan-400/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        95% MATCH
                      </motion.div>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <div className="relative">
                        <motion.div 
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 relative z-10">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" className="w-full h-full rounded-full object-cover" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-bold text-xs">Alex, 28</div>
                        <div className="text-gray-400 text-[9px]">Loves jazz & hiking...</div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="text-cyan-400 text-[8px] font-bold bg-cyan-400/10 px-2 py-1 rounded"
                      >
                        TAP
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Moments Widget - Image Preview */}
                  <motion.div 
                    onClick={() => { openFeature('moments'); showNotification('Loading Moments...', '📸'); }}
                    className="bg-neutral-800/80 border border-purple-500/30 rounded-2xl p-2 cursor-pointer relative overflow-hidden h-32 group hover:border-purple-400/60"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.img 
                      src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=200" 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute top-2 right-2 z-10">
                      <motion.span 
                        className="text-purple-300 text-[7px] font-bold bg-purple-500/20 px-2 py-1 rounded-full backdrop-blur"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                      >
                        LIVE
                      </motion.span>
                    </div>
                    <div className="absolute bottom-2 left-2 relative z-10">
                      <div className="text-white font-bold text-[10px] drop-shadow-md">Moments</div>
                      <div className="text-purple-300 text-[8px] drop-shadow-md">Sarah posted</div>
                    </div>
                  </motion.div>

                  {/* Soul Sync Widget */}
                  <motion.div 
                    onClick={() => { openFeature('soul'); showNotification('Syncing your soul...', '💜'); }}
                    className={`bg-neutral-800/80 border rounded-2xl p-2 cursor-pointer flex flex-col items-center justify-center h-32 relative overflow-hidden group hover:border-pink-400/60 hover:bg-neutral-800/60 transition-all ${pulseFeature === 'soul' ? 'border-pink-400 ring-2 ring-pink-400/50' : 'border-pink-500/30'}`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: pulseFeature === 'soul' ? [1, 1.05, 1] : 1
                    }}
                    transition={{ delay: 0.25, duration: pulseFeature === 'soul' ? 0.5 : 0.3 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent"
                      animate={{ opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <HeartPulse className="w-8 h-8 text-pink-500 mb-2" />
                    </motion.div>
                    <div className="text-white font-bold text-[10px] relative z-10">Soul Sync</div>
                    <motion.div 
                      className="text-pink-400 text-[8px] relative z-10"
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Ready
                    </motion.div>
                  </motion.div>

                  {/* Gather Widget */}
                  <motion.div 
                    onClick={() => { openFeature('gather'); showNotification('Event details loaded', '🎵'); }}
                    className={`col-span-2 bg-neutral-800/80 border rounded-2xl p-3 cursor-pointer relative overflow-hidden group hover:border-red-400/60 hover:bg-neutral-800 transition-all ${pulseFeature === 'gather' ? 'border-red-400 ring-2 ring-red-400/50' : 'border-red-500/30'}`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: pulseFeature === 'gather' ? [1, 1.02, 1] : 1
                    }}
                    transition={{ delay: 0.3, duration: pulseFeature === 'gather' ? 0.5 : 0.3 }}
                  >
                    <div className="absolute top-2 right-2">
                      <motion.div 
                        className="text-red-300 text-[8px] font-bold bg-red-500/25 px-2 py-1 rounded-full backdrop-blur"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        IN 4 HOURS
                      </motion.div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-white font-bold text-[10px]">Tonight's Event</div>
                      <div className="text-red-400 text-[8px] font-bold">8:00 PM</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.img 
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=100" 
                        className="w-12 h-12 rounded-lg object-cover"
                        whileHover={{ scale: 1.08 }}
                      />
                      <div>
                        <div className="text-white font-bold text-xs">Sunset Jazz</div>
                        <div className="text-gray-400 text-[9px]">Rooftop Lounge</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Tribes Widget */}
                  <motion.div 
                    onClick={() => { openFeature('tribes'); showNotification('Finding your tribes...', '👥'); }}
                    className={`bg-neutral-800/80 border rounded-2xl p-3 cursor-pointer group hover:border-orange-400/60 hover:bg-neutral-800/60 transition-all ${pulseFeature === 'tribes' ? 'border-orange-400 ring-2 ring-orange-400/50' : 'border-orange-500/30'}`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: pulseFeature === 'tribes' ? [1, 1.05, 1] : 1
                    }}
                    transition={{ delay: 0.35, duration: pulseFeature === 'tribes' ? 0.5 : 0.3 }}
                  >
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-[10px] mb-2 border border-orange-400/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      #
                    </motion.div>
                    <div className="text-white font-bold text-[10px]">Tribes</div>
                    <div className="text-orange-300 text-[8px] font-medium">{liveCounters.tribes} active now</div>
                  </motion.div>

                  {/* Pulse Widget */}
                  <motion.div 
                    onClick={() => { openFeature('pulse'); showNotification('Pulse feed loading...', '💭'); }}
                    className="bg-neutral-800/80 border border-sky-500/30 rounded-2xl p-3 cursor-pointer group hover:border-sky-400/60 hover:bg-neutral-800/60 transition-all relative"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-400 animate-pulse"></div>
                    <motion.div 
                      className="w-6 h-6 rounded-full bg-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-[10px] mb-2 border border-sky-400/30"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      @
                    </motion.div>
                    <div className="text-white font-bold text-[10px]">Pulse</div>
                    <div className="text-sky-300 text-[8px] font-medium">+{liveCounters.replies} New replies</div>
                  </motion.div>

                  {/* Micro pop: shared playlist */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 text-[10px] text-white backdrop-blur"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-600/40 flex items-center justify-center text-amber-200 font-bold text-[10px]">♬</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold">Cass dropped a playlist</div>
                      <div className="text-gray-300 text-[9px] truncate">“Late night rooftop” • 12 tracks</div>
                    </div>
                    <span className="text-emerald-400 text-[8px]">Play</span>
                  </motion.div>

                  {/* AI Copilot Widget */}
                  <motion.div 
                    onClick={() => { openFeature('copilot'); showNotification('AI Wingman activated', '✨'); }}
                    className="col-span-2 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-3 cursor-pointer relative overflow-hidden group hover:border-indigo-400/60 transition-all"
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.42 }}
                  >
                     <div className="absolute top-0 right-0 p-2">
                        <div className="bg-indigo-500/20 text-indigo-300 text-[8px] font-bold px-2 py-1 rounded-full border border-indigo-500/30 flex items-center gap-1">
                           <Sparkles size={8} /> BETA
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                           <Sparkles className="text-white w-5 h-5" />
                        </div>
                        <div>
                           <div className="text-white font-bold text-xs">Weave Copilot</div>
                           <div className="text-indigo-200 text-[9px]">Your social AI wingman</div>
                        </div>
                     </div>
                  </motion.div>

                  {/* Chat Widget - Bottom Full Width */}
                  <motion.div 
                    onClick={() => { openFeature('chat'); showNotification('Opening Deep Chat...', '💬'); }}
                    className={`col-span-2 bg-neutral-800/80 border rounded-2xl p-3 cursor-pointer flex items-center gap-3 group hover:border-green-400/60 hover:bg-neutral-800 transition-all ${pulseFeature === 'chat' ? 'border-green-400 ring-2 ring-green-400/50' : 'border-green-500/30'}`}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: pulseFeature === 'chat' ? [1, 1.02, 1] : 1
                    }}
                    transition={{ delay: 0.45, duration: pulseFeature === 'chat' ? 0.5 : 0.3 }}
                  >
                    <div className="relative flex-shrink-0">
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      ></motion.div>
                      <motion.div 
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-900"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      ></motion.div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-white font-bold text-[10px]">Deep Chat</div>
                        <motion.div 
                          className="text-green-400 text-[8px] font-bold bg-green-500/20 px-1.5 py-0.5 rounded"
                          animate={{ scale: [1, 1.08, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          1 UNREAD
                        </motion.div>
                      </div>
                      <div className="text-gray-400 text-[9px] truncate">"Are you going to the event tonight?"</div>
                    </div>
                  </motion.div>

                  {/* Floating Quick-Action FAB */}
                  <motion.button
                    onClick={() => { openFeature('ai'); showNotification('Finding perfect matches!', '🎯'); }}
                    className="col-span-2 mt-2 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white text-[10px] font-bold shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: [0, -5, 0] }}
                    transition={{ delay: 0.5, duration: 2, repeat: Infinity, repeatDelay: 0 }}
                  >
                    <Zap size={12} />
                    MATCH NOW
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="feature"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="h-full bg-neutral-900 relative"
              >
                {/* Frosted Glass Backdrop */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-b from-neutral-800/20 to-neutral-900/40 backdrop-blur-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                
                {/* Shimmer effect for loading */}
                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </AnimatePresence>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative z-10"
                >
                  {renderFeature()}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
       </div>

       {/* Bottom Bar */}
       <div className="absolute bottom-0 w-full h-10 bg-black/80 backdrop-blur-xl flex items-center justify-center z-20 border-t border-white/5">
          <div className="w-12 h-1 bg-gray-800 rounded-full"></div>
       </div>

       {/* NEW: Ecosystem Indicator - shows interconnection status, auto-hides */}
       <AnimatePresence>
         {showStoryMode && activeConnections.length > 0 && (
           <motion.div 
             className="absolute bottom-12 left-2 right-2 z-40"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 10 }}
           >
             <div className="bg-gradient-to-r from-cyan-900/80 to-pink-900/80 backdrop-blur-xl rounded-xl px-3 py-2 border border-white/10">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <motion.div 
                     className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500"
                     animate={{ scale: [1, 1.3, 1] }}
                     transition={{ duration: 1, repeat: Infinity }}
                   />
                   <span className="text-[9px] text-white font-bold">ECOSYSTEM ACTIVE</span>
                 </div>
                 <div className="flex gap-1">
                   {activeConnections.map((_, i) => (
                     <motion.div 
                       key={i}
                       className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ delay: i * 0.1 }}
                     />
                   ))}
                 </div>
               </div>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
    </div>
  );
};

// --- SLIDE DATA (20 SLIDES) ---
const slides = [
  // 1. TITLE
  {
    id: 1,
    type: "title",
    title: "WEAVE",
    subtitle: "Restoring the threads of local community.",
    tagline: "Technology for presence, not optimization.",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=2532",
    showTicker: true
  },
  
  // 2. THE CONTEXT (PROBLEM)
  {
    id: 2,
    type: "split",
    title: "We Are Connected, But Alone",
    content: [
      { label: "The Reality", text: "We have 'users' and 'followers', but fewer friends to call in a crisis than ever before." },
      { label: "The Burnout", text: "Algorithmic optimization has turned social life into a performance, creating exhaustion, not intimacy." },
      { label: "The Gap", text: "Dating apps gamify rejection. Social media sells dissatisfaction. Where is the commons?" },
      { label: "The Need", text: "People are seeking environments of low-stakes presence, safety, and un-optimized human connection." }
    ],
    image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&q=80&w=2649",
    interactive: {
      label: "Desire for Community by Age",
      values: [45, 65, 72, 58]
    }
  },

  // 3. WHY EXISTING SOLUTIONS FAIL
  {
    id: 3,
    type: "tiles",
    title: "The Optimization Trap",
    tiles: [
      { icon: CalendarX, title: "Optimized for Swiping", text: "Gamification turns people into inventory. We browse humans like products." },
      { icon: HeartCrack, title: "Optimized for Engagement", text: "Algorithms prioritize outrage and envy over connection and nuance." },
      { icon: ThumbsDown, title: "Optimized for Speed", text: "Fast matching removes the context and slowness required for trust." }
    ]
  },

  // 4. INTRODUCING WEAVE
  {
    id: 4,
    type: "split-text",
    title: "Weave: A Digital Commons",
    highlight: "Facilitating environments where connection can emerge naturally.",
    points: [
      "We don't 'match' you. We curate safe spaces (pods) for shared interests.",
      "No ranking, no scoring, no 'mate value' optimization.",
      "Small groups (3-6) reduce the pressure of 1:1 performance.",
      "Technology as a facilitator of presence, not a decider of outcomes."
    ]
  },

  // 5. HOW WEAVE WORKS (Moved from Slide 7)
  {
    id: 6,
    type: "video",
    title: "The Magic: How Weave Actually Works",
    subtitle: "Simple. Elegant. Psychologically proven.",
    videoUrl: "/Whisk_egzjr2nirmm4mgnx0cnyejytgznjrtljn2m50cm.mp4"
  },

  // 6. THE WEAVE COMMONS
  {
    id: 5,
    type: "grid",
    title: "One Connected Life",
    subtitle: "An ecosystem where every interaction deepens your local roots.",
    items: [
      { icon: Coffee, title: "Social Circles", text: "Interest-based groups. Book clubs, hiking, slow food." },
      { icon: Briefcase, title: "Professional Support", text: "Peer mentorship and co-working, not just networking." },
      { icon: Palette, title: "Creative Collabs", text: "Artist jams, skill swaps, and maker sessions." },
      { icon: Plane, title: "Group Travel", text: "Shared experiences and local exploration." },
      { icon: HeartPulse, title: "Wellness Pods", text: "Accountability circles, nature walks, and meditation." },
      { icon: Home, title: "Co-Living", text: "Roommate matching based on shared values and rhythms." }
    ]
  },

  // 7. ECOSYSTEM (NEW)
  {
    id: 22, // Unique ID
    type: "ecosystem",
    title: "From Attention to Presence",
    subtitle: "We don't want your screen time. We want your real time.",
    text: "Moving from the Attention Economy to the Presence Economy."
  },

  // 8. OUR REFUSAL (NEW)
  {
    id: 23,
    type: "convergence",
    title: "What We Will Never Do",
    subtitle: "Trust is built on what you refuse to do.",
    text: "No algorithmic ranking of humans. No 'hotness' scores. No selling of privacy. No gamification of rejection. No optimization of love."
  },

  // 7. OUR FOUNDATION
  {
    id: 7,
    type: "tiles",
    title: "Why We Thrive (Our Values)",
    tiles: [
      { icon: ShieldCheck, title: "Psychological Safety", text: "Verified identity and community vouches create a high-trust environment." },
      { icon: Home, title: "Local Roots", text: "Physical presence in neighborhood venues builds resilient local networks." },
      { icon: Smile, title: "Culture of Consent", text: "Design that rewards slowing down and respecting boundaries, not speed." }
    ]
  },

  // 8. SUSTAINABILITY MODEL
  {
    id: 8,
    type: "grid",
    title: "Membership to the Commons",
    subtitle: "A sustainable model that aligns our incentives with your well-being.",
    items: [
      { icon: CheckCircle, title: "Community Membership", text: "$15-50/mo. Access to the platform, events, and curated spaces." },
      { icon: Briefcase, title: "Team Culture", text: "Helping organizations build internal community and trust." },
      { icon: Home, title: "Venue Support", text: "Supporting local businesses by bringing consistent community foot traffic." },
      { icon: TrendingUp, title: "Workshops & Retreats", text: "Deepening practice through guided experiences and travel." },
      { icon: Smile, title: "The Anti-Ad Promise", text: "We never sell user data. You are the member, not the product." }
    ]
  },

  // 9. THE TRACTION
  {
    id: 9,
    type: "split",
    title: "We're Already Moving. Real Traction.",
    subtitle: "Private beta in Madrid. Revenue flowing.",
    content: [
      { label: "Beta Users", text: "500 beta testers in Madrid. 68% retention after 4 weeks (benchmark: most apps are 20%)." },
      { label: "Daily Active", text: "340 DAU. 2.3 sessions/day. We're STICKY." },
      { label: "Revenue Today", text: "$8k MRR from 180 paid users. Average spend: $45/month. Proof of willingness to pay." },
      { label: "NPS Score", text: "68. Better than Airbnb at launch (60). Users love us." }
    ],
    image: "https://images.unsplash.com/photo-1516714819001-8ee7a13b71d7?auto=format&fit=crop&q=80&w=2649"
  },

  // 10. UNIT ECONOMICS
  {
    id: 10,
    type: "chart",
    title: "Unit Economics That Work",
    subtitle: "Path to profitability: Month 18 | Contribution margin: 35% by Year 2",
    data: [
      { label: "CAC", val: 70, text: "$12-18" },
      { label: "LTV", val: 92, text: "$180-240" },
      { label: "LTV:CAC", val: 100, text: "12-15:1" },
      { label: "Payback", val: 35, text: "4-6 months" }
    ]
  },

  // 11. MARKET OPPORTUNITY
  {
    id: 11,
    type: "split-text",
    title: "TAM: $50B. SAM: $2B. SOM: $500M",
    highlight: "We're not going after 10%. We're going after 1%. Conservative. Doable.",
    points: [
      "TAM: Global wellness + dating + social + corporate wellness = $50B+ addressable",
      "SAM: High-engagement demographics (18-45, urban, disposable income) = $2B serviceable",
      "SOM: 5-city footprint, 2M users, 40% paying, $12-50/mo = $500M by Year 5",
      "Path is clear. Execution is hard. But the market is massive and hungry."
    ]
  },

  // 12. GO-TO-MARKET STRATEGY
  {
    id: 12,
    type: "tiles",
    title: "How We Scale Naturally",
    tiles: [
      { icon: Users, title: "Community Builders", text: "Empowering local hosts to cultivate 100+ meaningful connections." },
      { icon: Zap, title: "Trusted Invitations", text: "Growth through high-trust referral chains, not spammy invites. 40% organic." },
      { icon: TrendingUp, title: "Venue Ecosystem", text: "Integration with third places (cafes, libraries) to anchor digital groups in reality." }
    ]
  },

  // 13. YEAR 1 TARGETS
  {
    id: 13,
    type: "chart",
    title: "Year 1: 3 Cities. 100k Users. $2M ARR.",
    subtitle: "Aggressive but achievable. We've modeled every number.",
    data: [
      { label: "Q1", val: 15, text: "15k users | Madrid" },
      { label: "Q2", val: 35, text: "35k users | +London" },
      { label: "Q3", val: 65, text: "65k users | +Berlin" },
      { label: "Q4", val: 100, text: "100k users | $2M ARR" }
    ]
  },

  // 14. THE FUNDING ASK
  {
    id: 14,
    type: "grid",
    title: "$3M Seed. Here's Where It Goes.",
    subtitle: "18 months to GAAP profitability. Disciplined.",
    items: [
      { icon: Users, title: "Engineering (40%)", text: "$1.2M | Core app, matching algorithm, backend infra, security." },
      { icon: TrendingUp, title: "Marketing & GTM (35%)", text: "$1.05M | Ambassador program, partnership deals, paid growth in 3 cities." },
      { icon: Briefcase, title: "Operations (15%)", text: "$450k | Compliance, partnerships, customer success, venues." },
      { icon: Zap, title: "Runway Buffer (10%)", text: "$300k | 6-month safety net for macro shocks." }
    ]
  },

  // 15. THE TEAM
  {
    id: 15,
    type: "split-text",
    title: "A Team Built to Win",
    highlight: "Ex-Uber, Airbnb, Bumble. We've scaled before. We'll scale again.",
    points: [
      "CEO: Built 2 companies to $10M+ ARR. Raised $8M total. 1 profitable exit.",
      "CTO: 12 years at Uber. Shipped matching algo to 50M+ users. Patent holder.",
      "COO: VP Growth at Bumble. 300% YoY growth. Knows the wellness/dating market inside out.",
      "Advisors: Y Combinator partners. Founders of Tinder, Meetup, Klarna. We have the best"
    ]
  },

  // 16. ROADMAP TO PROFITABILITY
  {
    id: 16,
    type: "timeline",
    title: "18-Month Path to Profitability",
    steps: [
      { time: "Q1", title: "Expand Madrid", text: "1k→5k users. Launch corporate product." },
      { time: "Q2", title: "London Launch", text: "20k users. Hit $500k MRR." },
      { time: "Q3", title: "Berlin + B2B", text: "50k users. 100 corporate contracts." },
      { time: "Q4", title: "Profitable", text: "100k users. GAAP positive. $2M ARR." }
    ]
  },

  // 17. RESILIENCE
  {
    id: 17,
    type: "grid",
    title: "Building for Trust & Safety",
    subtitle: "Solving the hard problems of social connection.",
    items: [
      { icon: CheckCircle, title: "Community Density", text: "Venue partnerships ensure critical mass of people in specific neighborhoods." },
      { icon: CheckCircle, title: "Retention via Bond", text: "People stay for the relationships they build, not the app notification." },
      { icon: CheckCircle, title: "Safety by Design", text: "Vouching systems, venue-only first meetings, and consent-first protocols." },
      { icon: CheckCircle, title: "Local Autonomy", text: "Cities managed by local teams who understand the cultural nuance." }
    ]
  },

  // 18. VISION & IMPACT
  {
    id: 18,
    type: "split-text",
    title: "Impact Beyond Profit",
    highlight: "We measure success in both dollars AND human flourishing.",
    points: [
      "1M people make real friendships through Weave by Year 3",
      "100k weekly accountability pods = actual behavior change",
      "500+ venue partners = physical infrastructure for connection globally",
      "NPS 70+ maintained = world-class retention and love"
    ]
  },

  // 19. WHY NOW
  {
    id: 19,
    type: "vision",
    title: "The Timing Is Perfect",
    text: "Post-pandemic, remote-work epidemic, Gen Z spending 2x on wellness. The loneliness crisis is undeniable. The technology is ready. The market is hungry. The team is assembled. This is our window. Next 18 months decide everything.",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=2670"
  },

  // 20. DEMO
  {
    id: 20,
    type: "demo",
    title: "The Experience",
    subtitle: "Low friction. High context. Human scale.",
    text: "Weave is a digital tool for an analog life."
  },

  // 21. APP SHOWCASE (NEW)
  {
    id: 24,
    type: "app-showcase",
    title: "The Interconnected Ecosystem",
    subtitle: "Wellness feeds Community. Community feeds Social.",
    text: "Experience how your habits naturally lead to your people."
  },

  // 22. CLOSING - THE ASK
  {
    id: 21,
    type: "closing",
    title: "Let's weave a better social fabric.",
    text1: "Every connection changes a life.",
    text2: "Building a company that matters.",
    cta: "Join Us",
    stats: [
      { icon: TrendingUp, number: 50, label: "M", suffix: "", description: "Global Impact Target" },
      { icon: Users, number: 2, label: "M", suffix: "+", description: "Members by Year 5" },
      { icon: Zap, number: 1, label: "B", suffix: "+", description: "Real-world hours spent together" },
      { icon: Globe, number: 50, label: "", suffix: "+", description: "Cities globally" }
    ]
  }
];

const App = () => {
  const sanitizedSlides = slides.filter(Boolean);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Navigation Logic
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sanitizedSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sanitizedSlides.length) % sanitizedSlides.length);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slide = sanitizedSlides[currentSlide];

  return (
    <div className={`w-full h-screen ${THEME.bg} ${THEME.text} font-sans overflow-hidden relative flex flex-col items-center justify-center`}>
      {/* Animated background thread pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" style={{ zIndex: 0 }}>
          <defs>
            <pattern id="threadPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <motion.path
                d="M 0 50 Q 25 25, 50 50 T 100 50"
                stroke="#06b6d4"
                strokeWidth="1"
                fill="none"
                animate={{ strokeDashoffset: [0, -100] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#threadPattern)" />
        </svg>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-neutral-900 w-full z-50 border-b border-neutral-800">
        <motion.div 
          className={`h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600`} 
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / sanitizedSlides.length) * 100}%` }}
          transition={{ ease: "easeInOut" }}
        />
      </div>

      {/* Slide Content */}
      <AnimatePresence mode='wait'>
        <motion.div 
          key={slide.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-7xl h-full flex items-center justify-center p-8 sm:p-12 relative"
        >
          {/* 1. TITLE LAYOUT */}
          {slide.type === 'title' && (
            <div className="text-center relative z-10 max-w-5xl w-full">
              <motion.div className="mb-12 inline-block relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 rounded-lg blur-2xl opacity-50"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <h1 className={`relative text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 text-transparent bg-clip-text`}>{slide.title}</h1>
              </motion.div>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-tight font-light">{slide.subtitle}</p>
              <div className={`inline-block border-t border-cyan-400 pt-6 text-xs tracking-[0.2em] uppercase text-cyan-400 font-semibold`}>
                {slide.tagline}
              </div>
              
              {/* Live Population Ticker */}
              {slide.showTicker && (
                <motion.div 
                  className="mt-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <LivePopulationTicker />
                </motion.div>
              )}
            </div>
          )}

          {/* 2. SPLIT LAYOUT (Text Left, Image Right) */}
          {slide.type === 'split' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full h-full items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
                {slide.subtitle && <h3 className={`text-xl font-semibold text-cyan-400 mb-10`}>{slide.subtitle}</h3>}
                <ul className="space-y-8 mb-10">
                  {slide.content.map((item, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex flex-col group cursor-pointer"
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <strong className={`text-lg text-cyan-400 block mb-2 font-semibold group-hover:text-pink-500 transition-colors`}>{item.label}</strong>
                      <span className="text-base text-gray-400 font-light leading-relaxed">{item.text}</span>
                      <motion.div 
                        className="h-0.5 bg-gradient-to-r from-cyan-400 to-pink-500 mt-2 origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.li>
                  ))}
                </ul>
                
                {/* Interactive Graph */}
                {slide.interactive && (
                  <motion.div 
                    className="mt-10 p-6 bg-neutral-950/50 rounded-xl border border-cyan-400/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <AnimatedGraph data={{ values: slide.interactive.values }} label={slide.interactive.label} />
                  </motion.div>
                )}
              </div>
              <motion.div 
                className="h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-cyan-400/20 glow-border relative group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={slide.image} alt="Visual" className="w-full h-full object-cover" />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-pink-500/0 group-hover:from-cyan-400/10 group-hover:to-pink-500/10 transition-colors"
                />
              </motion.div>
            </div>
          )}

          {/* 3. SPLIT-TEXT LAYOUT (No Image) */}
          {slide.type === 'split-text' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full h-full items-center relative">
              {/* Animated background threads */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="bgThread" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((i) => (
                  <motion.path
                    key={`thread-${i}`}
                    d={`M 0 ${i * 150} Q 300 ${i * 150 + 100}, 600 ${i * 150}`}
                    stroke="url(#bgThread)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, delay: i * 0.2 }}
                  />
                ))}
              </svg>
               
               <motion.div className="relative z-10">
                  <h2 className="text-6xl md:text-7xl font-black leading-tight bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
               </motion.div>
               <motion.div 
                 className="flex flex-col justify-center border-l-4 border-cyan-400 pl-10 relative z-10"
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.2 }}
               >
                  <h3 className={`text-3xl italic font-semibold text-pink-500 mb-10`}>"{slide.highlight}"</h3>
                  <ul className="space-y-6">
                    {slide.points.map((p, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-start text-lg text-gray-300 group cursor-pointer"
                        whileHover={{ x: 10 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                         <motion.div
                           animate={{ scale: [1, 1.2, 1] }}
                           transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                         >
                           <CheckCircle className={`w-6 h-6 text-cyan-400 mr-4 flex-shrink-0 mt-0.5 group-hover:text-pink-500 transition-colors`} />
                         </motion.div>
                         <span className="group-hover:text-white transition-colors">{p}</span>
                      </motion.li>
                    ))}
                  </ul>
               </motion.div>
            </div>
          )}

          {/* 4. TILES LAYOUT */}
          {slide.type === 'tiles' && (
            <div className="w-full relative">
              <h2 className="text-5xl md:text-6xl font-black mb-16 text-left bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting thread SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                  <defs>
                    <linearGradient id="threadGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M 50 100 Q 250 50, 450 100 T 900 100"
                    stroke="url(#threadGrad1)"
                    strokeWidth="2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                </svg>
                
                {slide.tiles.map((tile, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`${THEME.card} p-10 rounded-2xl border-t-2 border-cyan-400 hover:border-t-4 hover:border-pink-500 hover:shadow-2xl hover:shadow-cyan-400/20 hover:-translate-y-3 transition-all duration-300 group relative overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative z-10">
                      <tile.icon className={`w-12 h-12 text-cyan-400 mb-6 group-hover:text-pink-500 transition-colors`} />
                      <h3 className="text-2xl font-bold mb-4">{tile.title}</h3>
                      <p className="text-base text-gray-400 font-light leading-relaxed">{tile.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 5. GRID LAYOUT (6 Items) */}
          {slide.type === 'grid' && (
            <div className="w-full">
              <h2 className="text-5xl md:text-6xl font-black mb-4 text-left bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
              {slide.subtitle && <p className="text-lg text-gray-400 mb-12 font-light">{slide.subtitle}</p>}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Thread network visualization */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <defs>
                    <linearGradient id="networkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.circle
                      key={`dot-${i}`}
                      cx={`${20 + i * 20}%`}
                      cy="50%"
                      r="3"
                      fill="#06b6d4"
                      opacity="0.3"
                      animate={{ r: [3, 5, 3] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </svg>
                
                {slide.items.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    className={`${THEME.card} p-8 rounded-2xl border-l-4 border-cyan-400 flex flex-col items-start hover:shadow-xl hover:shadow-cyan-400/10 hover:border-l-pink-500 transition-all group relative overflow-hidden z-10`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative z-10 w-full">
                      <div className="flex items-center mb-4">
                         {item.icon && <item.icon className={`w-8 h-8 text-cyan-400 mr-3 group-hover:text-pink-500 transition-colors`} />}
                         <h3 className={`text-xl font-bold text-cyan-400 group-hover:text-pink-500 transition-colors`}>{item.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* VIDEO LAYOUT */}
          {slide.type === 'video' && (
            <div className="w-full h-full flex flex-col items-center justify-center max-w-5xl">
              <motion.div 
                className="w-full mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-5xl md:text-6xl font-black mb-4 text-center bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
                {slide.subtitle && <p className="text-lg text-gray-400 text-center font-light">{slide.subtitle}</p>}
              </motion.div>
              
              <motion.div 
                className="w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-cyan-400/30 glow-border"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ borderColor: '#ec4899' }}
              >
                <video 
                  width="100%" 
                  height="auto" 
                  controls 
                  autoPlay
                  className="w-full h-auto bg-black"
                  style={{ aspectRatio: '16/9' }}
                >
                  <source src={slide.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          )}

          {/* 6. TABLE LAYOUT */}
          {slide.type === 'table' && (
            <div className="w-full max-w-5xl">
              <h2 className="text-4xl md:text-5xl font-black mb-12 text-center bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
              <motion.div 
                className="bg-neutral-900/50 rounded-2xl border border-cyan-400/20 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-3 bg-gradient-to-r from-cyan-400/10 to-pink-500/10 p-8 font-black tracking-wider text-lg border-b border-cyan-400/20">
                  <div className="text-cyan-400">Feature</div>
                  <div className="text-gray-300">Standard Meetup</div>
                  <div className="text-pink-500">Weave</div>
                </div>
                {slide.rows.map((row, idx) => (
                   <motion.div 
                     key={idx} 
                     className="grid grid-cols-3 p-8 border-b border-neutral-800 last:border-0 items-center text-lg hover:bg-neutral-900/80 transition-all group cursor-pointer relative"
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: idx * 0.1 }}
                     whileHover={{ x: 5 }}
                   >
                     <motion.div 
                       className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 to-pink-500/0 group-hover:from-cyan-400/5 group-hover:to-pink-500/5 transition-all pointer-events-none"
                     />
                     <div className="font-bold text-white relative z-10">{row.feature}</div>
                     <div className="text-gray-500 relative z-10">{row.old}</div>
                     <div className={`font-bold text-cyan-400 bg-cyan-400/5 p-4 rounded-lg -ml-4 relative z-10 group-hover:bg-cyan-400/10 transition-colors`}>{row.new}</div>
                   </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {/* 7. TIMELINE LAYOUT */}
          {slide.type === 'timeline' && (
            <div className="w-full">
              <h2 className="text-4xl md:text-5xl font-black mb-20 text-center bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
              <div className="relative flex justify-between items-start px-4 md:px-12">
                {/* Animated thread connecting line */}
                <svg className="absolute top-10 left-0 right-0 w-full h-2 pointer-events-none" style={{ zIndex: 0 }}>
                  <defs>
                    <linearGradient id="threadGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={`M 50 10 Q ${typeof window !== 'undefined' ? window.innerWidth / 4 : 250} 5, ${typeof window !== 'undefined' ? window.innerWidth / 2 : 500} 10 T ${typeof window !== 'undefined' ? window.innerWidth : 1000} 10`}
                    stroke="url(#threadGradient2)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                  />
                </svg>
                
                {slide.steps.map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex flex-col items-center text-center flex-1 group relative z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <motion.div 
                      className={`w-20 h-20 rounded-full ${THEME.card} border-3 border-cyan-400 flex items-center justify-center text-lg font-black text-cyan-400 mb-6 shadow-lg shadow-cyan-400/20 group-hover:scale-110 group-hover:border-pink-500 group-hover:text-pink-500 transition-all relative z-20`}
                      whileHover={{ scale: 1.2, boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)" }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full border-3 border-pink-500/0 group-hover:border-pink-500/50"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {step.time}
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{step.title}</h3>
                    <p className="text-gray-400 px-4 text-sm group-hover:text-gray-300 transition-colors">{step.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* 8. CHART LAYOUT */}
          {slide.type === 'chart' && (
             <div className="w-full max-w-5xl">
               <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">{slide.title}</h2>
               <p className="text-xl text-gray-400 mb-16 font-light max-w-3xl">{slide.subtitle}</p>
               <div className="space-y-8 bg-neutral-900/30 p-10 rounded-3xl border border-white/5 backdrop-blur-sm">
                 {slide.data.map((item, idx) => (
                   <motion.div 
                     key={idx} 
                     className="group relative"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.15 }}
                   >
                     <div className="flex justify-between items-end mb-2">
                        <div className="font-bold text-xl text-white group-hover:text-cyan-400 transition-colors">{item.label}</div>
                        <div className="text-pink-500 font-mono font-bold">{item.text}</div>
                     </div>
                     
                     <div className="h-4 bg-neutral-800 rounded-full overflow-hidden relative">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${item.val}%` }}
                         transition={{ duration: 1.5, delay: 0.3 + idx * 0.1, ease: "circOut" }}
                         className={`h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full relative shadow-[0_0_15px_rgba(6,182,212,0.5)]`}
                       >
                         <motion.div 
                           className="absolute inset-0 bg-white/30"
                           animate={{ x: ['-100%', '100%'] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: idx * 0.2 }}
                         />
                       </motion.div>
                     </div>
                   </motion.div>
                 ))}
               </div>
             </div>
          )}

          {/* 9. VISION LAYOUT (Full BG) */}
          {slide.type === 'vision' && (
            <div className="w-full h-full absolute inset-0">
               <img src={slide.image} className="w-full h-full object-cover" alt="Vision" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
               <div className="absolute bottom-0 left-0 w-full p-20 text-white">
                  <h2 className="text-6xl font-black mb-8 bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text">The Future We're Building</h2>
                  <p className="text-2xl max-w-5xl font-light leading-relaxed text-gray-200">{slide.text}</p>
               </div>
            </div>
          )}

          {/* DEMO LAYOUT */}
          {slide.type === 'demo' && (
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-16">
              <div className="flex-1 max-w-xl">
                <motion.h2 
                  className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.h3 
                  className="text-3xl text-white font-bold mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.h3>
                <motion.p 
                  className="text-xl text-gray-400 font-light leading-relaxed mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {slide.text}
                </motion.p>
                
                <div className="flex gap-4 flex-wrap">
                  {['Smart Matching', 'Instant Groups', 'Real Connection'].map((tag, i) => (
                    <motion.div 
                      key={i}
                      className="px-4 py-2 rounded-full border border-cyan-400/30 text-cyan-400 text-sm font-mono uppercase tracking-wider bg-cyan-400/5"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      {tag}
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <motion.div 
                className="flex-1 flex justify-center"
                initial={{ opacity: 0, x: 50, rotate: 5 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              >
                <PhoneDemo />
              </motion.div>
            </div>
          )}

          {/* ECOSYSTEM LAYOUT */}
          {slide.type === 'ecosystem' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="text-center mb-12 max-w-4xl relative z-10">
                <motion.h2 
                  className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.p 
                  className="text-2xl text-white font-light mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>
                <motion.p 
                  className="text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {slide.text}
                </motion.p>
              </div>
              
              <motion.div 
                className="w-full max-w-5xl h-[500px] relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <RelationshipEconomy />
              </motion.div>
            </div>
          )}

          {/* MARKET CONVERGENCE LAYOUT */}
          {slide.type === 'convergence' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8 max-w-4xl relative z-10">
                <motion.h2 
                  className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-300 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>
              </div>
              
              <motion.div 
                className="w-full max-w-5xl h-[600px] relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <MarketConvergence />
              </motion.div>
            </div>
          )}

          {/* APP SHOWCASE LAYOUT */}
          {slide.type === 'app-showcase' && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="text-center mb-8 relative z-10">
                <motion.h2 
                  className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-300 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.subtitle}
                </motion.p>
              </div>

              {/* Interactive phone wireframe */}
              <motion.div 
                className="relative w-full flex justify-center py-4 lg:py-8 z-20"
                initial={{ opacity: 0, y: 20, rotate: 3 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
              >
                <InteractiveAppDemo />
              </motion.div>
            </div>
          )}

          {/* 10. CLOSING LAYOUT */}
          {slide.type === 'closing' && (
            <div className="w-full max-w-7xl px-4">
              <div className="grid grid-cols-1 gap-6 lg:gap-10 border-2 border-cyan-400 p-6 lg:p-10 rounded-3xl bg-neutral-950 shadow-2xl shadow-cyan-400/20 relative mb-6 items-center text-center">
                <motion.div 
                  className="absolute -left-24 -top-16 w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/20 to-pink-500/30 blur-3xl pointer-events-none"
                  animate={{ x: [0, 20, -10, 0], y: [0, -10, 15, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute -right-16 bottom-0 w-56 h-56 rounded-full bg-gradient-to-tr from-purple-500/25 to-cyan-400/20 blur-3xl pointer-events-none"
                  animate={{ x: [0, -15, 10, 0], y: [0, 20, -10, 0] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 1 }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-pink-500/5 pointer-events-none rounded-3xl"></div>
                <div className="relative z-10 space-y-4 lg:space-y-6 max-w-4xl mx-auto">
                  <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-600 text-transparent bg-clip-text leading-tight`}>{slide.title}</h2>
                  <p className="text-lg md:text-xl text-gray-300">{slide.text1}</p>
                  <p className="text-lg md:text-xl italic text-cyan-400 font-light">{slide.text2}</p>
                  <motion.button 
                    className={`border-2 border-cyan-400 px-8 py-3 rounded-full text-sm md:text-base font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all duration-300 text-cyan-400 shadow-lg shadow-cyan-400/30 hover:shadow-2xl hover:shadow-cyan-400/50`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {slide.cta}
                  </motion.button>
                </div>
              </div>
              
              {/* Interactive Stats Grid */}
              {slide.stats && (
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {slide.stats.map((stat, idx) => (
                    <StatCard
                      key={idx}
                      icon={stat.icon}
                      number={stat.number}
                      label={stat.label}
                      suffix={stat.suffix}
                      delay={0.4 + idx * 0.15}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 right-8 flex items-center gap-6 z-50">
        <button 
          onClick={prevSlide}
          className="p-4 rounded-full bg-neutral-900 border border-cyan-400 hover:bg-cyan-400 hover:text-black hover:scale-110 transition-all shadow-lg shadow-cyan-400/20 text-cyan-400"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="font-mono text-sm text-gray-400 tracking-widest">
           {currentSlide + 1} / {sanitizedSlides.length}
        </div>
        <button 
          onClick={nextSlide}
          className="p-4 rounded-full bg-neutral-900 border border-pink-500 hover:bg-pink-500 hover:text-black hover:scale-110 transition-all shadow-lg shadow-pink-500/20 text-pink-500"
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;
