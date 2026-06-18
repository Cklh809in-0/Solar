import { useMemo, type FC } from 'react'
import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// Star field
// ---------------------------------------------------------------------------

const StarField: FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.2,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
          animate={{
            opacity: [s.opacity, s.opacity * 0.2, s.opacity],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Nebula clouds (large blurred color patches)
// ---------------------------------------------------------------------------

const Nebula: FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    <motion.div
      className="absolute top-[10%] left-[5%] w-[700px] h-[700px] rounded-full opacity-20 dark:opacity-30"
      style={{
        background: 'radial-gradient(circle, rgba(200,200,200,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }}
      animate={{ x: [0, 120, 0], y: [0, -60, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute bottom-[15%] right-[10%] w-[550px] h-[550px] rounded-full opacity-15 dark:opacity-25"
      style={{
        background: 'radial-gradient(circle, rgba(150,150,150,0.06) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }}
      animate={{ x: [0, -80, 0], y: [0, 80, 0] }}
      transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 dark:opacity-15"
      style={{
        background: 'radial-gradient(circle, rgba(100,100,100,0.04) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }}
      animate={{ scale: [1, 1.4, 1], rotate: [0, 360] }}
      transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
    />
  </div>
)

// ---------------------------------------------------------------------------
// Shooting stars
// ---------------------------------------------------------------------------

const ShootingStar: FC<{ delay: number; top: number; duration: number }> = ({
  delay, top, duration,
}) => (
  <motion.div
    className="absolute w-[1.5px] h-[1.5px] rounded-full"
    style={{
      left: '-10px',
      top: `${top}%`,
      background:
        'linear-gradient(to right, transparent, rgba(200,200,200,0.7), rgba(200,200,200,0))',
      boxShadow: '0 0 4px 1px rgba(200,200,200,0.2)',
    }}
    animate={{
      left: ['-5vw', '105vw'],
      opacity: [0, 1, 1, 0],
      width: [1.5, 60, 80, 100],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
      repeatDelay: 10,
    }}
  />
)

// ---------------------------------------------------------------------------
// Cosmic dust particles
// ---------------------------------------------------------------------------

const CosmicDust: FC = () => {
  const dust = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 10,
        duration: Math.random() * 25 + 20,
        driftX: (Math.random() - 0.5) * 60,
        driftY: (Math.random() - 0.5) * 40,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {dust.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-gray-300/20 dark:bg-gray-400/15"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
          }}
          animate={{
            x: [0, d.driftX, 0],
            y: [0, d.driftY, 0],
            opacity: [0.05, 0.25, 0.05],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Orbital rings
// ---------------------------------------------------------------------------

const OrbitalRings: FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
    {[280, 400, 520].map((size, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-gray-400/10 dark:border-gray-500/10"
        style={{ width: size, height: size }}
        animate={{
          rotate: [0, i % 2 === 0 ? 360 : -360],
          opacity: [0.08, 0.2, 0.08],
        }}
        transition={{
          duration: 25 + i * 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full bg-gray-400/30 dark:bg-gray-300/30 absolute"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        />
      </motion.div>
    ))}
  </div>
)

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const AnimatedBackground: FC = () => {
  return (
    <>
      <Nebula />
      <StarField />
      <OrbitalRings />
      <CosmicDust />
      <ShootingStar delay={0} top={15} duration={2} />
      <ShootingStar delay={12} top={45} duration={2.5} />
      <ShootingStar delay={24} top={70} duration={1.8} />
      <ShootingStar delay={38} top={30} duration={2.2} />
      <ShootingStar delay={50} top={85} duration={1.5} />
    </>
  )
}
