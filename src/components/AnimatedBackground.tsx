import { useMemo, type FC } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'

const FloatingShape: FC<{
  shape: 'circle' | 'triangle' | 'hexagon'
  x: number
  y: number
  size: number
  color: string
  delay: number
  duration: number
  rotate: boolean
}> = ({ shape, x, y, size, color, delay, duration, rotate }) => {
  const rotation = rotate ? [0, 360] : [0, 0]
  const opacity = [0.15, 0.3, 0.15]

  const element = () => {
    const s = size
    switch (shape) {
      case 'triangle':
        return (
          <polygon
            points={`${s},0 ${s * 2},${s * 1.732} 0,${s * 1.732}`}
            fill={color}
          />
        )
      case 'hexagon':
        return (
          <polygon
            points={`${s * 0.5},0 ${s * 1.5},0 ${s * 2},${s * 0.866} ${s * 1.5},${s * 1.732} ${s * 0.5},${s * 1.732} 0,${s * 0.866}`}
            fill={color}
          />
        )
      case 'circle':
        return <circle cx={s} cy={s} r={s} fill={color} />
    }
  }

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size * 2, height: size * 2 }}
      animate={{
        y: [0, -40, 0],
        opacity,
        rotate: rotation,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size * 2} ${size * 2}`}
        style={{ filter: 'blur(1px)' }}
      >
        {element()}
      </svg>
    </motion.div>
  )
}

const ShootingStar: FC<{
  delay: number
  top: number
  duration: number
}> = ({ delay, top, duration }) => (
  <motion.div
    className="absolute w-[2px] h-[2px] rounded-full"
    style={{
      left: '-10px',
      top: `${top}%`,
      background:
        'linear-gradient(to right, transparent, rgba(139, 233, 253, 0.8), rgba(139, 233, 253, 0))',
      boxShadow: '0 0 6px 2px rgba(139, 233, 253, 0.3)',
    }}
    animate={{
      left: ['-10vw', '110vw'],
      opacity: [0, 1, 1, 0],
      width: [2, 80, 100, 120],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'linear',
      repeatDelay: 5,
    }}
  />
)

const SunGlow: FC = () => {
  const { theme } = useTheme()
  if (theme !== 'dracula') return null

  return (
    <div className="fixed top-1/4 left-1/2 -translate-x-1/2 pointer-events-none z-0">
      <motion.div
        className="w-[600px] h-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 185, 0, 0.12) 0%, rgba(255, 140, 0, 0.06) 30%, rgba(255, 100, 0, 0.02) 60%, transparent 80%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 233, 253, 0.06) 0%, transparent 60%)',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

const OrbitalRings: FC = () => {
  const { theme } = useTheme()
  if (theme !== 'dracula') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
      {[320, 440, 560].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-dracula-cyan/10"
          style={{ width: size, height: size }}
          animate={{
            rotate: [0, i % 2 === 0 ? 360 : -360],
            opacity: [0.12, 0.25, 0.12],
          }}
          transition={{
            duration: 20 + i * 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="w-2 h-2 rounded-full bg-dracula-cyan/40 absolute"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </motion.div>
      ))}
    </div>
  )
}

const GridOverlay: FC = () => {
  const { theme } = useTheme()
  if (theme !== 'dracula') return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(139, 233, 253, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 233, 253, 0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }}
    />
  )
}

const FloatingLines: FC = () => {
  const { theme } = useTheme()
  if (theme !== 'dracula') return null

  const lines = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        width: Math.random() * 200 + 100,
        rotation: Math.random() * 360,
        delay: Math.random() * 5,
        duration: Math.random() * 8 + 12,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {lines.map((line) => (
        <motion.div
          key={line.id}
          className="absolute h-px"
          style={{
            left: `${line.x}%`,
            top: `${line.y}%`,
            width: line.width,
            rotate: line.rotation,
            background:
              'linear-gradient(90deg, transparent, rgba(139, 233, 253, 0.15), transparent)',
          }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [0, 30, 0],
          }}
          transition={{
            duration: line.duration,
            delay: line.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const LightRays: FC = () => {
  const { theme } = useTheme()
  if (theme !== 'dracula') return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-[800px] h-px origin-left"
          style={{
            rotate: `${angle}deg`,
            background:
              'linear-gradient(90deg, rgba(139, 233, 253, 0.03) 0%, transparent 100%)',
          }}
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{
            duration: 4,
            delay: i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const StarField: FC = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{ opacity: [0, 0.8, 0] }}
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

const ParticlesV2: FC = () => {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 15 + 15,
        xDrift: (Math.random() - 0.5) * 60,
        color: ['#8be9fd', '#bd93f9', '#50fa7b', '#ffb86c'][
          Math.floor(Math.random() * 4)
        ],
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}40`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, p.xDrift, 0],
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Light theme background
const LightSparkles: FC = () => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1, 0] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <svg width={s.size * 3} height={s.size * 3} viewBox="0 0 12 12">
            <path
              d="M6 0L7.35 4.65L12 6L7.35 7.35L6 12L4.65 7.35L0 6L4.65 4.65Z"
              fill="#fbbf24"
              opacity={0.3}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

const LightFloatingShapes: FC = () => (
  <>
    <FloatingShape
      shape="circle"
      x={8}
      y={25}
      size={12}
      color="rgba(251, 191, 36, 0.08)"
      delay={0}
      duration={14}
      rotate={false}
    />
    <FloatingShape
      shape="triangle"
      x={82}
      y={20}
      size={16}
      color="rgba(59, 130, 246, 0.07)"
      delay={2}
      duration={16}
      rotate
    />
    <FloatingShape
      shape="hexagon"
      x={75}
      y={65}
      size={10}
      color="rgba(16, 185, 129, 0.07)"
      delay={4}
      duration={12}
      rotate
    />
    <FloatingShape
      shape="circle"
      x={15}
      y={72}
      size={8}
      color="rgba(139, 92, 246, 0.06)"
      delay={1}
      duration={18}
      rotate={false}
    />
    <FloatingShape
      shape="triangle"
      x={50}
      y={12}
      size={20}
      color="rgba(251, 191, 36, 0.05)"
      delay={3}
      duration={20}
      rotate
    />
    <FloatingShape
      shape="hexagon"
      x={90}
      y={40}
      size={7}
      color="rgba(236, 72, 153, 0.05)"
      delay={5}
      duration={13}
      rotate
    />
  </>
)

const LightSunGlow: FC = () => (
  <div className="fixed top-[15%] right-[10%] pointer-events-none z-0">
    <motion.div
      className="w-[500px] h-[500px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, rgba(251, 146, 60, 0.05) 40%, rgba(251, 146, 60, 0.02) 70%, transparent 100%)',
      }}
      animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className="absolute inset-0 w-[500px] h-[500px] rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(255, 255, 200, 0.05) 0%, transparent 60%)',
      }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
    />
  </div>
)

const LightLeafParticles: FC = () => {
  const leaves = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 10,
        size: Math.random() * 8 + 6,
        rotation: Math.random() * 360,
        duration: Math.random() * 8 + 12,
        color: ['rgba(16, 185, 129, 0.06)', 'rgba(5, 150, 105, 0.05)', 'rgba(52, 211, 153, 0.05)'][
          Math.floor(Math.random() * 3)
        ],
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {leaves.map((l) => (
        <motion.div
          key={l.id}
          className="absolute"
          style={{ left: `${l.x}%`, top: -20 }}
          animate={{
            top: ['-5vh', '105vh'],
            rotate: [l.rotation, l.rotation + 360],
            x: [0, Math.sin(l.id) * 80, 0],
          }}
          transition={{
            duration: l.duration,
            delay: l.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg width={l.size} height={l.size} viewBox="0 0 24 24" fill={l.color}>
            <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

const LightGrid: FC = () => (
  <div
    className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
      backgroundSize: '80px 80px',
    }}
  />
)

const LightBeams: FC = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
    {[-30, -15, 0, 15, 30].map((angle, i) => (
      <motion.div
        key={i}
        className="absolute top-0 left-1/2 w-[300px] h-full origin-bottom"
        style={{
          rotate: `${angle}deg`,
          background:
            'linear-gradient(180deg, rgba(251, 191, 36, 0.03) 0%, transparent 80%)',
          clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{
          duration: 5,
          delay: i * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
)

const LightDots: FC = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
        color: [
          'rgba(59, 130, 246, 0.15)',
          'rgba(16, 185, 129, 0.12)',
          'rgba(251, 191, 36, 0.12)',
          'rgba(139, 92, 246, 0.1)',
        ][Math.floor(Math.random() * 4)],
      })),
    [],
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            backgroundColor: d.color,
          }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 0] }}
          transition={{
            duration: 4,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const LightBackground: FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-sky-50" />

      {/* Second gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-50/30 via-transparent to-cyan-50/30" />

      <LightGrid />
      <LightSunGlow />
      <LightBeams />
      <LightFloatingShapes />
      <LightLeafParticles />
      <LightSparkles />
      <LightDots />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white/60 to-transparent" />
    </div>
  )
}

export const AnimatedBackground: FC = () => {
  const { theme } = useTheme()

  if (theme === 'dracula') {
    return (
      <>
        <GridOverlay />
        <OrbitalRings />
        <StarField />
        <ParticlesV2 />
        <SunGlow />
        <FloatingLines />
        <LightRays />
        <ShootingStar delay={0} top={15} duration={1.5} />
        <ShootingStar delay={8} top={45} duration={2} />
        <ShootingStar delay={16} top={70} duration={1.8} />
        <FloatingShape
          shape="triangle"
          x={5}
          y={30}
          size={18}
          color="rgba(139, 233, 253, 0.12)"
          delay={0}
          duration={12}
          rotate
        />
        <FloatingShape
          shape="hexagon"
          x={85}
          y={55}
          size={14}
          color="rgba(189, 147, 249, 0.12)"
          delay={3}
          duration={15}
          rotate
        />
        <FloatingShape
          shape="circle"
          x={75}
          y={15}
          size={10}
          color="rgba(80, 250, 123, 0.1)"
          delay={5}
          duration={10}
          rotate={false}
        />
        <FloatingShape
          shape="triangle"
          x={15}
          y={75}
          size={12}
          color="rgba(255, 184, 108, 0.1)"
          delay={2}
          duration={14}
          rotate
        />
        <FloatingShape
          shape="hexagon"
          x={92}
          y={85}
          size={8}
          color="rgba(255, 121, 198, 0.1)"
          delay={7}
          duration={11}
          rotate
        />
        <FloatingShape
          shape="circle"
          x={50}
          y={10}
          size={15}
          color="rgba(139, 233, 253, 0.08)"
          delay={4}
          duration={18}
          rotate={false}
        />
      </>
    )
  }

  return <LightBackground />
}
