import { useState, useEffect, useCallback, useRef, type FC } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

// ---------------------------------------------------------------------------
// Cursor glow (spotlight following mouse)
// ---------------------------------------------------------------------------

const CursorGlow: FC = () => {
  const { theme } = useTheme()
  const mouseX = useMotionValue(-200)
  const mouseY = useMotionValue(-200)
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [mouseX, mouseY])

  if (theme !== 'dracula') return null

  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: springX,
        top: springY,
        width: 400,
        height: 400,
        transform: 'translate(-50%, -50%)',
        background:
          'radial-gradient(circle, rgba(139, 233, 253, 0.06) 0%, transparent 60%)',
        borderRadius: '50%',
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Ripple on click
// ---------------------------------------------------------------------------

interface Ripple {
  id: number
  x: number
  y: number
  size: number
  color: string
}

const RippleEffect: FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextId = useRef(0)
  const { theme } = useTheme()

  const addRipple = useCallback((e: MouseEvent) => {
    const ripple: Ripple = {
      id: nextId.current++,
      x: e.clientX,
      y: e.clientY,
      size: Math.random() * 40 + 20,
      color: theme === 'dracula' ? 'rgba(139, 233, 253, 0.15)' : 'rgba(251, 191, 36, 0.12)',
    }
    setRipples((prev) => [...prev, ripple])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== ripple.id))
    }, 800)
  }, [theme])

  useEffect(() => {
    window.addEventListener('click', addRipple)
    return () => window.removeEventListener('click', addRipple)
  }, [addRipple])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: r.x,
            top: r.y,
            transform: 'translate(-50%, -50%)',
            border: `1px solid ${r.color}`,
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{
            width: r.size * 4,
            height: r.size * 4,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Cursor trail particles
// ---------------------------------------------------------------------------

interface TrailParticle {
  id: number
  x: number
  y: number
  size: number
  color: string
}

const CursorTrail: FC = () => {
  const [trail, setTrail] = useState<TrailParticle[]>([])
  const nextId = useRef(0)
  const lastTime = useRef(0)
  const { theme } = useTheme()

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastTime.current < 40) return
      lastTime.current = now

      const particle: TrailParticle = {
        id: nextId.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 4 + 2,
        color:
          theme === 'dracula'
            ? ['#8be9fd', '#bd93f9', '#50fa7b', '#ffb86c'][
                Math.floor(Math.random() * 4)
              ]
            : ['#fbbf24', '#60a5fa', '#34d399', '#a78bfa'][
                Math.floor(Math.random() * 4)
              ],
      }
      setTrail((prev) => [...prev.slice(-18), particle])

      setTimeout(() => {
        setTrail((prev) => prev.filter((p) => p.id !== particle.id))
      }, 600)
    }

    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [theme])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9997]">
      {trail.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}60`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Parallax effect on cards
// ---------------------------------------------------------------------------

export const ParallaxCard: FC<{
  children: React.ReactNode
  className?: string
  strength?: number
}> = ({ children, className = '', strength = 8 }) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [{ rotateX, rotateY }, setRotate] = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const card = cardRef.current
      if (!card) return
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      setRotate({
        rotateX: -((y - centerY) / centerY) * strength,
        rotateY: ((x - centerX) / centerX) * strength,
      })
    },
    [strength],
  )

  const handleMouseLeave = useCallback(() => {
    setRotate({ rotateX: 0, rotateY: 0 })
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
      }}
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Export all
// ---------------------------------------------------------------------------

export const MouseEffects: FC = () => (
  <>
    <CursorGlow />
    <CursorTrail />
    <RippleEffect />
  </>
)
