import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { ArrowRight, Globe, Heart, Users, Sun, Moon } from "lucide-react";
import { MemoryBookHero } from "./MemoryBookHero";
import { RainbowButton } from "./RainbowButton";

const HUMANS = [
  { name: "Maya's Education", sci: "Rural Kenya", img: "https://images.unsplash.com/photo-1507513583-1348b7b8a7d2?w=800&auto=format&fit=crop&q=80", photo: "Desola Lanre-Ologun" },
  { name: "Clean Water for Amina", sci: "Somalia", img: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=800&auto=format&fit=crop&q=80", photo: "Ben White" },
  { name: "Rahul's First Harvest", sci: "Punjab, India", img: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80", photo: "Ravi Sharma" },
  { name: "A New Home", sci: "Syrian Refugees", img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80", photo: "Ahmed Akacha" },
]

function HumanGallery() {
  return (
    <section className="py-32 bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 blur-[100px] pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen"
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-calligraphy">Transforming human lives.</h2>
        <p className="text-xl text-white/60 max-w-2xl">Every story matters. Discover the resilient humans we're working alongside to build a better future.</p>
      </div>
      <div className="relative w-full z-10">
        <motion.div 
          className="flex gap-8 px-6 md:px-12 w-max"
          animate={{ x: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...HUMANS, ...HUMANS].map((human, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative w-[300px] md:w-[450px] aspect-[3/4] shrink-0 rounded-[40px] overflow-hidden shadow-2xl group"
              style={{ borderRadius: i % 2 === 0 ? "40px 100px 40px 100px" : "100px 40px 100px 40px" }}
            >
              <img src={human.img} alt={human.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h3 className="text-3xl font-bold text-white tracking-tight mb-2 font-calligraphy">{human.name}</h3>
                <p className="text-white/80 text-lg mb-6">{human.sci}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium">
                  Photo: {human.photo}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Stats({ isDark }: { isDark: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={ref} className={`py-28 transition-colors duration-700 overflow-hidden ${isDark ? 'bg-black' : 'bg-[#FAFAF7]'}`}>
      <motion.div style={{ y }} className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 text-center divide-y md:divide-y-0 md:divide-x ${isDark ? 'divide-white/10' : 'divide-black/10'}`}>
          {[
            { label: "Beneficiaries Served", value: "2M+" },
            { label: "Global Volunteers", value: "15K" },
            { label: "Active Projects", value: "142" },
            { label: "Countries Reached", value: "35" }
          ].map((stat, i) => (
            <div key={i} className="pt-8 md:pt-0 px-4 group">
              <motion.h4 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: i * 0.1 }}
                className={`text-7xl md:text-8xl font-calligraphy italic font-normal mb-3 transition-colors ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}
              >
                {stat.value}
              </motion.h4>
              <p className={`uppercase tracking-[0.25em] text-xs font-semibold font-sans transition-colors ${isDark ? 'text-white/50' : 'text-[#1D1D1F]/50'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

function ParallaxImageCard({ program, index, isDark }: { program: any; index: number; isDark: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group cursor-pointer rounded-[40px] overflow-hidden shadow-2xl transition-colors duration-700 ${isDark ? 'bg-neutral-900 shadow-white/5' : 'bg-white shadow-black/5'}`}
      style={{ borderRadius: "40px 100px 40px 100px" }}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img 
          style={{ y, scale: 1.15 }}
          src={program.img} 
          alt={program.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className={`p-10 relative z-10 transition-colors duration-700 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
        <h3 className={`text-2xl font-bold mb-3 tracking-tight font-calligraphy ${isDark ? 'text-white' : 'text-black'}`}>{program.title}</h3>
        <p className={`mb-8 line-clamp-2 ${isDark ? 'text-white/70' : 'text-[#1D1D1F]/70'}`}>{program.desc}</p>
        <div className={`flex items-center gap-2 font-semibold group-hover:gap-4 transition-all ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>
          Learn more <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

export function TemplateScreen({ onEnter }: { onEnter?: () => void }) {
  const [isDark, setIsDark] = useState(false);

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${isDark ? 'dark bg-black text-white' : 'bg-[#FAFAF7] text-[#1D1D1F]'} selection:bg-purple-500 selection:text-white font-sans`}>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 mix-blend-difference text-white">
        <div className="flex items-center gap-3 group cursor-pointer">
          <span className="font-bold text-4xl tracking-tight font-calligraphy">Echoes</span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Hero Memory Book Component */}
      <MemoryBookHero onEnter={onEnter} />

      <Stats isDark={isDark} />

      {/* Programs */}
      <section className={`py-32 transition-colors duration-700 relative overflow-hidden ${isDark ? 'bg-black' : 'bg-[#FAFAF7]'}`}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
              <feBlend in="SourceGraphic" in2="gooey" />
            </filter>
          </defs>
        </svg>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl mb-20">
            <h2 className={`text-5xl md:text-6xl font-bold tracking-tight mb-8 font-calligraphy transition-colors ${isDark ? 'text-white' : 'text-[#1D1D1F]'}`}>Programs driving change.</h2>
            <p className={`text-2xl leading-relaxed transition-colors ${isDark ? 'text-white/60' : 'text-[#1D1D1F]/60'}`}>Discover our key initiatives designed to empower communities and protect our natural world.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Education for All", desc: "Providing access to quality education in underserved communities.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80" },
              { title: "Clean Water Initiative", desc: "Building sustainable water systems for villages worldwide.", img: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&auto=format&fit=crop&q=80" },
              { title: "Wildlife Conservation", desc: "Protecting endangered species and preserving natural habitats.", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80" }
            ].map((program, i) => (
              <ParallaxImageCard key={i} program={program} index={i} isDark={isDark} />
            ))}
          </div>
        </div>
      </section>

      {/* Human Gallery */}
      <HumanGallery />

      {/* Footer */}
      <footer className="bg-black text-white pt-32 pb-12 rounded-t-[80px] -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <span className="font-bold text-5xl tracking-tight font-calligraphy">Echoes</span>
            </div>
            <p className="text-white/50 text-xl max-w-sm mb-12 leading-relaxed">Capturing the profound stories of human impact across the globe.</p>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                <Heart className="w-6 h-6" />
              </button>
              <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all">
                <Users className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-xl mb-8 font-calligraphy">Resources</h4>
            <ul className="space-y-5 text-white/50 text-lg">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xl mb-8 font-calligraphy">Legal</h4>
            <ul className="space-y-5 text-white/50 text-lg">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-10 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-base">
          <p>© 2026 Echoes All rights reserved.</p>
          <p>Designed with ❤️ by Adrija Chowdhury for Non-Profits</p>
        </div>
      </footer>
    </div>
  )
}
