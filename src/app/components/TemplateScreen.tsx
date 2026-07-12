import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import JellyfishDrift from "../../components/ui/demo";
import { ArrowRight, Globe, Heart, Users, ChevronLeft, ChevronRight, Activity, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { CursorTrail } from "./CursorTrail";

// Animal Gallery Data
const ANIMALS = [
  {
    id: 1,
    name: "Red-tailed black cockatoo",
    sci: "Calyptorhynchus banksii",
    photo: "David Clode",
    img: "https://images.unsplash.com/photo-1549479361-bd80970ecf62?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Dromedary",
    sci: "Camelus dromedarius",
    photo: "Moaz Tobok",
    img: "https://images.unsplash.com/photo-1574780655866-963b652875b1?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Cheetah",
    sci: "Acinonyx jubatus",
    photo: "Cara Fuller",
    img: "https://images.unsplash.com/photo-1518330554109-f6a8e80ab4a4?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    name: "African Elephant",
    sci: "Loxodonta africana",
    photo: "Harvey Sapir",
    img: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: 5,
    name: "Red Panda",
    sci: "Ailurus fulgens",
    photo: "Nils Baastrup",
    img: "https://images.unsplash.com/photo-1543372863-1d07c0e86b0a?w=800&auto=format&fit=crop&q=80",
  }
];

function AnimalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);

  return (
    <section ref={containerRef} className="py-32 bg-[#121214] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-serif">Animal Gallery</h2>
        <p className="text-white/50 text-lg">Scroll to rotate the gallery</p>
      </div>
      
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center">
        <motion.div style={{ x }} className="flex gap-8 px-[10vw]">
          {ANIMALS.map((animal, i) => (
            <motion.div 
              key={animal.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="relative w-[300px] md:w-[450px] aspect-[3/4] shrink-0 rounded-3xl overflow-hidden shadow-2xl group"
            >
              <img src={animal.img} alt={animal.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-bold text-white tracking-tight mb-1">{animal.name}</h3>
                <p className="text-white/70 italic text-lg mb-4">{animal.sci}</p>
                <p className="text-white/50 text-sm">Photo by: {animal.photo}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-black/10">
          {[
            { label: "Beneficiaries Served", value: "2M+" },
            { label: "Global Volunteers", value: "15K" },
            { label: "Active Projects", value: "142" },
            { label: "Countries Reached", value: "35" }
          ].map((stat, i) => (
            <div key={i} className="pt-8 md:pt-0 px-4">
              <h4 className="text-6xl font-bold text-[#1D1D1F] tracking-tighter mb-4">{stat.value}</h4>
              <p className="text-[#1D1D1F]/60 uppercase tracking-widest text-sm font-semibold">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TemplateScreen() {
  return (
    <div className="w-full min-h-screen bg-[#FAFAF7] text-[#1D1D1F] selection:bg-[#1D1D1F] selection:text-white font-sans">
      <CursorTrail />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference text-white">
        <div className="flex items-center gap-2">
          <Globe className="w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">Crowdera</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <a href="#" className="hover:opacity-70 transition-opacity">Our Mission</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Programs</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Impact</a>
          <a href="#" className="hover:opacity-70 transition-opacity">Stories</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm font-semibold">
            Volunteer
          </button>
          <button className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-colors text-sm font-semibold">
            Donate
          </button>
        </div>
      </nav>

      {/* Hero 3D Component */}
      <div className="relative h-screen w-full bg-black">
        <JellyfishDrift />
      </div>

      <Stats />

      {/* Programs */}
      <section className="py-32 bg-[#FAFAF7]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1D1D1F] mb-6 font-serif">Programs driving change.</h2>
            <p className="text-xl text-[#1D1D1F]/60 leading-relaxed">Discover our key initiatives designed to empower communities and protect our natural world.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Education for All", desc: "Providing access to quality education in underserved communities.", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80" },
              { title: "Clean Water Initiative", desc: "Building sustainable water systems for villages worldwide.", img: "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&auto=format&fit=crop&q=80" },
              { title: "Wildlife Conservation", desc: "Protecting endangered species and preserving natural habitats.", img: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80" }
            ].map((program, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer rounded-3xl overflow-hidden bg-white shadow-xl shadow-black/5"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={program.img} alt={program.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3 tracking-tight">{program.title}</h3>
                  <p className="text-[#1D1D1F]/70 mb-6 line-clamp-2">{program.desc}</p>
                  <div className="flex items-center gap-2 font-semibold text-[#1D1D1F] group-hover:gap-4 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animal Gallery */}
      <AnimalGallery />

      {/* Footer */}
      <footer className="bg-black text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-8 h-8" />
              <span className="font-bold text-2xl tracking-tight">Crowdera</span>
            </div>
            <p className="text-white/50 text-lg max-w-sm mb-8">Empowering registered non-profit organizations to create beautiful, impactful websites.</p>
            <div className="flex gap-4">
              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Resources</h4>
            <ul className="space-y-4 text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-white/50">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
          <p>© 2026 Crowdera Inc. All rights reserved.</p>
          <p>Designed with ❤️ for Non-Profits</p>
        </div>
      </footer>
    </div>
  )
}
