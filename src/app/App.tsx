import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HomeScreen } from './components/HomeScreen'
import { CauseDetailScreen } from './components/CauseDetailScreen'
import { TimelineScreen } from './components/TimelineScreen'
import { DonationScreen } from './components/DonationScreen'
import { ProfileScreen } from './components/ProfileScreen'
import { AuthScreen } from './components/AuthScreen'
import { TemplateScreen } from './components/TemplateScreen'
import type { Cause, Screen } from './data'
import { CAUSES } from './data'
import { Home, Compass, Clock, User, History, Heart } from 'lucide-react'
import { AppleCursor } from './components/AppleCursor'

const EASE = [0.22, 1, 0.36, 1] as const
const PAGE_TRANSITION = {
  initial: { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.02, filter: 'blur(10px)' },
  transition: { duration: 0.8, ease: EASE },
}

function FloatingNav({ currentScreen, onNavigate }: { currentScreen: Screen | 'landing', onNavigate: (s: Screen) => void }) {
  if (currentScreen === 'landing' || currentScreen === 'auth' || currentScreen === 'donate') return null;
  
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Journal' },
    { id: 'cause' as Screen, icon: Compass, label: 'Discover' },
    { id: 'timeline' as Screen, icon: Clock, label: 'Journeys' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* DESKTOP TOP HEADER NAVIGATION */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="hidden md:flex fixed top-0 left-0 right-0 h-20 bg-[#FAFAF7]/85 backdrop-blur-md border-b border-black/5 z-40 items-center justify-between px-12"
      >
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="font-bold text-3xl font-calligraphy italic text-[#1D1D1F] tracking-tight">
            Echoes
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-200/40 border border-black/5 rounded-full">
          {navItems.map((item) => {
            const active = currentScreen === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 ease-out font-sans font-medium text-sm tracking-wide ${
                  active ? 'text-white' : 'text-[#1D1D1F]/60 hover:text-[#1D1D1F]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="desktop-nav-pill"
                    className="absolute inset-0 bg-[#2C5530] rounded-full shadow-[0_4px_12px_rgba(44,85,48,0.15)]"
                    transition={{ type: 'spring', bounce: 0.12, duration: 0.5 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* User Badge */}
        <div className="w-24 flex justify-end">
          <div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C5530] to-[#142A17] flex items-center justify-center text-white text-sm font-serif shadow-sm cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => onNavigate('profile')}
          >
            E
          </div>
        </div>
      </motion.header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FAFAF7]/95 backdrop-blur-2xl border-t border-black/5 z-40 items-center justify-around px-4 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.03)]"
      >
        {navItems.map((item) => {
          const active = currentScreen === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-300 relative"
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  className={`transition-colors duration-300 ${
                    active ? 'text-[#2C5530]' : 'text-[#1D1D1F]/40'
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                {active && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute -bottom-1.5 w-1 h-1 bg-[#2C5530] rounded-full"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-sans mt-1 tracking-wide font-medium transition-colors duration-300 ${
                  active ? 'text-[#2C5530]' : 'text-[#1D1D1F]/40'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </motion.div>
    </>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen | 'landing'>('landing')
  const [selectedCause, setSelectedCause] = useState<Cause>(CAUSES[0])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [screen])

  const handleSelectCause = useCallback((cause: Cause) => {
    setSelectedCause(cause)
    setScreen('cause')
  }, [])

  const handleDonate = useCallback((cause: Cause) => {
    setSelectedCause(cause)
    setScreen('donate')
  }, [])

  const handleTimeline = useCallback((cause: Cause) => {
    setSelectedCause(cause)
    setScreen('timeline')
  }, [])

  const handleNavigation = useCallback((s: Screen) => {
    setScreen(s)
  }, [])

  return (
    <div className="min-h-screen w-full bg-[#FAFAF7] text-[#1D1D1F] selection:bg-[#2C5530] selection:text-white">
      <AppleCursor />
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <motion.div key="landing" {...PAGE_TRANSITION} className="min-h-screen">
            <TemplateScreen onEnter={() => setScreen('auth')} />
          </motion.div>
        )}
        
        {screen === 'auth' && (
          <motion.div key="auth" {...PAGE_TRANSITION} className="min-h-screen">
            <AuthScreen onEnter={() => setScreen('home')} />
          </motion.div>
        )}

        {screen === 'home' && (
          <motion.div key="home" {...PAGE_TRANSITION} className="min-h-screen">
            <HomeScreen onSelectCause={handleSelectCause} />
          </motion.div>
        )}

        {screen === 'cause' && (
          <motion.div key="cause" {...PAGE_TRANSITION} className="min-h-screen">
            <CauseDetailScreen 
              cause={selectedCause} 
              onBack={() => setScreen('home')} 
              onDonate={handleDonate}
              onTimeline={handleTimeline}
            />
          </motion.div>
        )}

        {screen === 'timeline' && (
          <motion.div key="timeline" {...PAGE_TRANSITION} className="min-h-screen">
            <TimelineScreen 
              cause={selectedCause} 
              onBack={() => setScreen('cause')} 
              onDonate={handleDonate}
            />
          </motion.div>
        )}

        {screen === 'donate' && (
          <motion.div key="donate" {...PAGE_TRANSITION} className="min-h-screen">
            <DonationScreen 
              cause={selectedCause} 
              onBack={() => setScreen('cause')} 
              onSuccess={() => setScreen('timeline')}
            />
          </motion.div>
        )}

        {screen === 'profile' && (
          <motion.div key="profile" {...PAGE_TRANSITION} className="min-h-screen">
            <ProfileScreen onSelectCause={handleSelectCause} />
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingNav currentScreen={screen} onNavigate={handleNavigation} />
    </div>
  )
}
