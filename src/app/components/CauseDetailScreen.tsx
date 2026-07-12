import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowLeft, MapPin, ChevronRight, Bookmark, Eye, Heart } from 'lucide-react'
import type { Cause } from '../data'
import { 
  incrementCauseViews, 
  incrementCauseHearts, 
  decrementCauseHearts, 
  subscribeCauseStats, 
  StatsData 
} from '../../lib/stats'

interface CauseDetailScreenProps {
  cause: Cause
  onBack: () => void
  onDonate: (cause: Cause) => void
  onTimeline: (cause: Cause) => void
}

export function CauseDetailScreen({ cause, onBack, onDonate, onTimeline }: CauseDetailScreenProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isHearted, setIsHearted] = useState(false)
  const [stats, setStats] = useState<StatsData>({ views: 0, hearts: 0 })
  const [heartsBurst, setHeartsBurst] = useState<{ id: number; x: number }[]>([]);

  useEffect(() => {
    // Check local storage for hearted state
    const localKey = `cause_hearted_${cause.id}`;
    setIsHearted(localStorage.getItem(localKey) === 'true');

    // Increment cause views on mount
    incrementCauseViews(cause.id);

    // Subscribe to cause-specific stats
    const unsubscribe = subscribeCauseStats(cause.id, (data) => {
      setStats(data);
    });

    return () => unsubscribe();
  }, [cause.id]);

  const handleHeartClick = async () => {
    setIsHearted(true);
    const localKey = `cause_hearted_${cause.id}`;
    localStorage.setItem(localKey, 'true');

    // Add a floating heart
    const id = Date.now() + Math.random();
    const x = (Math.random() - 0.5) * 40;
    setHeartsBurst(prev => [...prev, { id, x }]);
    setTimeout(() => {
      setHeartsBurst(prev => prev.filter(h => h.id !== id));
    }, 1200);

    await incrementCauseHearts(cause.id);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAF7] pb-32 pt-0 md:pt-20">
      {/* Hero Image */}
      <div className="relative w-full h-[60vh] md:h-[70vh] max-h-[800px] bg-neutral-200 overflow-hidden">
        <motion.img
          src={cause.heroImage}
          alt={cause.name}
          onLoad={() => setImgLoaded(true)}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full object-cover"
        />
        
        {/* Top Gradient for Nav */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-8 left-8 md:top-12 md:left-12 w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-24 relative z-10">
        
        {/* Title Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.06)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-[#FAFAF7] text-[#1D1D1F]/60 text-xs font-semibold tracking-wide uppercase border border-black/5">
                {cause.tag}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#1D1D1F]/40">
                <MapPin size={14} /> {cause.location}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-[#1D1D1F]/40">
                <Eye size={14} /> {stats.views.toLocaleString()} views
              </span>
            </div>
            
            {/* Heart Button */}
            <div className="relative">
              <button 
                onClick={handleHeartClick}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 transform active:scale-95 cursor-pointer ${
                  isHearted 
                    ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_4px_12px_rgba(239,68,68,0.1)]' 
                    : 'bg-white text-[#1D1D1F]/60 border-black/5 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 shadow-sm'
                }`}
              >
                <Heart size={14} className={isHearted ? 'fill-current' : ''} />
                <span>{stats.hearts}</span>
              </button>

              {/* Floating hearts container */}
              <AnimatePresence>
                {heartsBurst.map((h) => (
                  <motion.div
                    key={h.id}
                    initial={{ y: 0, opacity: 1, scale: 0.8 }}
                    animate={{ y: -60, opacity: 0, scale: 1.3, x: h.x, rotate: h.x * 0.5 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-red-500 pointer-events-none"
                  >
                    <Heart size={14} className="fill-current" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-medium text-[#1D1D1F] leading-[1.1] tracking-tight mb-8">
            {cause.name}
          </h1>

          <p className="text-lg md:text-xl text-[#1D1D1F]/70 leading-relaxed font-light">
            {cause.description}
          </p>
        </motion.div>

        {/* Story Journal Entries */}
        <div className="mt-24">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl font-serif text-[#1D1D1F]">Journal Entries</h2>
            <button 
              onClick={() => onTimeline(cause)}
              className="text-[#2C5530] font-medium text-sm flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              View Full Timeline <ChevronRight size={16} />
            </button>
          </div>

          <div className="space-y-16">
            {cause.journalEntries.map((entry, i) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
              >
                {/* Date & Emotion */}
                <div className="md:col-span-3 flex flex-row md:flex-col items-center md:items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-black/5">
                    {entry.emotion}
                  </div>
                  <div className="text-sm font-medium text-[#1D1D1F]/50">{entry.date}</div>
                </div>

                {/* Content */}
                <div className={`md:col-span-9 ${entry.type === 'photo' ? 'bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)]' : ''}`}>
                  {entry.image && (
                    <div className="rounded-[16px] overflow-hidden mb-6 bg-neutral-100">
                      <img src={entry.image} alt="Journal entry" className="w-full h-auto object-cover" />
                    </div>
                  )}
                  <p className={`text-xl md:text-2xl font-serif leading-relaxed text-[#1D1D1F] ${!entry.image ? 'border-l-2 border-[#2C5530]/20 pl-6' : 'px-4 pb-4'}`}>
                    "{entry.text}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8, type: 'spring', damping: 20 }}
        className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm z-30"
      >
        <button
          onClick={() => onDonate(cause)}
          className="w-full py-5 bg-[#2C5530] text-white rounded-full shadow-[0_16px_40px_rgba(44,85,48,0.3)] hover:shadow-[0_20px_50px_rgba(44,85,48,0.4)] hover:bg-[#234526] transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium text-lg tracking-wide flex items-center justify-center gap-2"
        >
          <Bookmark size={20} className="fill-current opacity-80" />
          Support {cause.person.split(' ')[0]}'s Story
        </button>
      </motion.div>
    </div>
  )
}
