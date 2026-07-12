import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const HERO_IMAGES = [
  { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800", top: "12%", left: "8%", width: "24%", rotate: -12, yOffset: 80 },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800", top: "14%", left: "68%", width: "25%", rotate: 10, yOffset: -60 },
  { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", top: "54%", left: "34%", width: "28%", rotate: -4, yOffset: 110 },
  { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800", top: "56%", left: "6%", width: "24%", rotate: 8, yOffset: -90 },
  { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", top: "52%", left: "70%", width: "24%", rotate: -10, yOffset: 90 },
];

export function MemoryBookHero({ onEnter }: { onEnter?: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  return (
    <div ref={ref} className="relative w-full h-[120vh] bg-black overflow-hidden flex items-center justify-center font-sans">
      {/* Background Floating Images with Parallax & Circular/Oval Floating Drift */}
      {HERO_IMAGES.map((img, i) => {
        // Parallax effect combined with custom circular/wave drift
        const yParallax = useTransform(scrollYProgress, [0, 1], [0, img.yOffset * 1.5]);
        return (
          <motion.div
            key={i}
            className="absolute rounded-[32px] overflow-hidden shadow-2xl pointer-events-none select-none opacity-80"
            style={{
              top: img.top,
              left: img.left,
              width: img.width,
              y: yParallax,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 0.85, 
              scale: 1,
              x: [0, Math.cos(i) * 25, -Math.sin(i) * 25, 0],
              y: [0, Math.sin(i) * 25, Math.cos(i) * 25, 0],
              rotate: [img.rotate, img.rotate + 3, img.rotate - 3, img.rotate],
            }}
            transition={{
              opacity: { duration: 1.5, delay: i * 0.1 },
              scale: { duration: 1.5, delay: i * 0.1 },
              x: { duration: 14 + i * 2, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 14 + i * 2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 18 + i * 3, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <div className="aspect-[4/5] w-full h-full bg-neutral-900">
              <img src={img.url} className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]" alt="Memory" />
            </div>
          </motion.div>
        );
      })}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 pointer-events-none" />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-white/60 tracking-[0.3em] text-sm md:text-base font-semibold uppercase mb-8"
        >
          The Sound of Impact
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.7 }}
          className="text-5xl md:text-7xl lg:text-8xl font-calligraphy text-white leading-[1.1] tracking-tight mb-12"
          style={{ textShadow: "0 10px 40px rgba(0,0,0,0.8)" }}
        >
          The cosmos is within us.
          <br />
          We are made of star-stuff.
          <br />
          We are a way for the universe
          <br />
          to know itself.
        </motion.h1>

        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-black px-8 py-3.5 rounded-full font-sans font-medium text-base md:text-lg flex items-center gap-2.5 shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:bg-neutral-50 hover:shadow-[0_12px_40px_rgba(255,255,255,0.25)] transition-all duration-300 z-20 pointer-events-auto border border-white/5"
        >
          Enter Echoes <ArrowRight className="w-5 h-5 stroke-[2]" />
        </motion.button>
      </div>
    </div>
  );
}
