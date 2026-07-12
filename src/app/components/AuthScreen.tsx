import { useState, useRef } from 'react'
import { motion } from 'motion/react'
import { signInWithGoogle } from '../../lib/firebase'
import JellyfishDrift from '../../components/ui/demo'
import { ArrowDown } from 'lucide-react'

export function AuthScreen({ onEnter }: { onEnter: () => void }) {
  const [loading, setLoading] = useState(false)
  const signInSectionRef = useRef<HTMLDivElement>(null)

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signInWithGoogle()
      onEnter()
    } catch (e) {
      console.error(e)
      // Fallback for preview
      onEnter()
    } finally {
      setLoading(false)
    }
  }

  const scrollToSignIn = () => {
    signInSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAF7] text-[#1D1D1F] overflow-y-auto">
      {/* SECTION 1: Jellyfish Drift Visual */}
      <div className="relative h-screen w-full overflow-hidden">
        <JellyfishDrift />
        
        {/* Scroll Indicator Overlay */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto">
          <motion.button
            onClick={scrollToSignIn}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 px-6 py-3 bg-white/80 hover:bg-white text-black rounded-full font-medium shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-black/5 transition-all cursor-pointer"
          >
            <span className="text-sm tracking-wider font-semibold uppercase">Scroll to Sign In</span>
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* SECTION 2: Sign In Page */}
      <div 
        ref={signInSectionRef}
        className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#e6f0e9] to-[#FAFAF7] text-[#1D1D1F] px-6 relative py-20"
      >
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-md p-10 md:p-14 rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col items-center text-center"
        >
          <h1 className="text-4xl md:text-5xl font-calligraphy mb-4 tracking-tight">Impact Awaits</h1>
          <p className="text-[#1D1D1F]/60 mb-12 text-lg">Sign in to uncover the ripples of your actions.</p>
          
          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="w-full bg-[#1D1D1F] text-white rounded-full py-4 px-8 font-medium text-lg hover:bg-black hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 cursor-pointer"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {loading ? 'Entering...' : 'Continue with Google'}
          </button>

          <button 
            onClick={onEnter}
            className="mt-6 text-sm text-[#1D1D1F]/50 hover:text-[#1D1D1F] transition-colors cursor-pointer"
          >
            Explore as Guest
          </button>
        </motion.div>
      </div>
    </div>
  )
}
