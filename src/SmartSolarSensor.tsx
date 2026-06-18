import { memo, useState, useRef, useEffect, type FC } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronUp, Moon, Sun, Pause, Play } from 'lucide-react'
import { useCarousel } from './hooks/useCarousel'
import { useTheme } from './contexts/ThemeContext'
import { AnimatedBackground } from './components/AnimatedBackground'
import { MouseEffects, ParallaxCard } from './components/MouseEffects'
import { productImages, authors, features, type Feature } from './data/content'

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------

const AnimatedCounter: FC<{ from?: number; to: number; suffix?: string; label: string }> = ({
  from = 0, to, suffix = '', label
}) => {
  const [count, setCount] = useState(from)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const duration = 1500
          const steps = 30
          const increment = (to - from) / steps
          let current = from
          const timer = setInterval(() => {
            current += increment
            if (current >= to) {
              setCount(to)
              clearInterval(timer)
            } else {
              setCount(Math.round(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [from, to])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-1">
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  )
}

const StatsSection: FC = () => (
  <motion.section
    className="px-4 sm:px-6 max-w-5xl mx-auto mb-16"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
  >
    <div className="bg-gray-100 dark:bg-gray-900/50 rounded-2xl p-8 sm:p-12 border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
        <AnimatedCounter to={4} label="Cảm biến LDR" />
        <AnimatedCounter to={1} suffix="" label="Arduino Uno" />
        <AnimatedCounter to={3} label="Động cơ Servo" />
        <AnimatedCounter to={100} suffix="%" label="Năng lượng tái tạo" />
      </div>
    </div>
  </motion.section>
)

// ---------------------------------------------------------------------------
// Section navigation dots
// ---------------------------------------------------------------------------

const SECTION_IDS = [
  { id: 'hero', label: 'Giới thiệu' },
  { id: 'features', label: 'Tính năng' },
  { id: 'authors', label: 'Tác giả' },
  { id: 'video', label: 'Video' },
]

const SectionNav: FC = () => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200
      let current = 0
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i].id)
        if (el && el.offsetTop <= scrollY) {
          current = i
          break
        }
      }
      setActive(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-3" aria-label="Điều hướng nhanh">
      {SECTION_IDS.map((sec, idx) => (
        <motion.button
          key={sec.id}
          onClick={() => {
            document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="relative group"
          animate={{ scale: idx === active ? 1.3 : 1 }}
          whileHover={{ scale: 1.5 }}
          aria-label={sec.label}
        >
          <div
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              idx === active
                ? 'bg-gray-600 dark:bg-gray-300 shadow-md'
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-gray-900 px-2 py-1 rounded shadow">
            {sec.label}
          </span>
        </motion.button>
      ))}
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

const Navbar: FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-neutral-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          ☀️ Smart Solar Sensor
        </motion.div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <motion.span
              className="w-2 h-2 rounded-full bg-gray-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            THCS Hòa Tân | Tân Nhuận Đông, Đồng Tháp
          </span>
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Chuyển giao diện"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </div>
      </div>
    </nav>
  )
}

// ---------------------------------------------------------------------------
// Dot buttons
// ---------------------------------------------------------------------------

const DotNav: FC<{
  count: number
  active: number
  onClick: (i: number) => void
}> = ({ count, active, onClick }) => {
  const length = count
  return (
  <div className="flex gap-2" role="tablist">
    {Array.from({ length }, (_, i) => (
      <motion.button
        key={i}
        role="tab"
        aria-selected={i === active}
        onClick={() => onClick(i)}
        className="h-2 rounded-full transition-all"
        animate={{
          width: i === active ? 32 : 8,
          backgroundColor: i === active ? '#9ca3af' : '#6b7280',
        }}
        whileHover={{ scale: 1.2 }}
      />
    ))}
  </div>
)
}

// ---------------------------------------------------------------------------
// Image Carousel
// ---------------------------------------------------------------------------

const ImageCarousel: FC = () => {
  const { index, item, goTo, next, prev, isPaused, togglePause } =
    useCarousel(productImages, 5000)

  return (
    <motion.div
      className="relative bg-gray-800/50 dark:bg-gray-900/50 rounded-2xl p-4 sm:p-8 border border-gray-600/30 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-gray-400/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="aspect-video rounded-xl overflow-hidden border border-gray-600/30 relative mb-6 bg-gray-800 select-none">
          <motion.div
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) next()
              if (info.offset.x > 50) prev()
            }}
          />
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={item.url}
              alt={item.title}
              className="w-full h-full object-cover pointer-events-none"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              loading="lazy"
              draggable={false}
            />
          </AnimatePresence>

          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-200 dark:text-gray-300">
              {item.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-400">{item.desc}</p>
          </motion.div>

          <button
            onClick={togglePause}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <motion.button
            onClick={prev}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <DotNav count={productImages.length} active={index} onClick={goTo} />

          <motion.button
            onClick={next}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Ảnh sau"
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Feature Card
// ---------------------------------------------------------------------------

const FeatureCard: FC<{ feature: Feature; index: number }> = memo(
  ({ feature: { icon: Icon, title, description }, index }) => (
    <ParallaxCard strength={6}>
      <motion.div
        className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-300"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -6 }}
      >
        <div className="text-gray-500 dark:text-gray-400 mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon size={32} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </motion.div>
    </ParallaxCard>
  ),
)

FeatureCard.displayName = 'FeatureCard'

// ---------------------------------------------------------------------------
// Author Showcase
// ---------------------------------------------------------------------------

const AuthorShowcase: FC = () => {
  const { index: authorIndex, item: author, goTo: goToAuthor, next: nextAuthor, prev: prevAuthor } =
    useCarousel(authors, 4000)

  return (
    <motion.div
      className="relative bg-gray-800/50 dark:bg-gray-900/50 rounded-2xl p-4 sm:p-8 border border-gray-600/30 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-gray-400/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="aspect-video bg-gray-700/50 dark:bg-gray-800/50 rounded-xl mb-6 flex items-center justify-center border border-gray-600/30 relative overflow-hidden select-none">
          <motion.div
            className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) nextAuthor()
              if (info.offset.x > 50) prevAuthor()
            }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={authorIndex}
              className="flex flex-col items-center justify-center text-white p-6 pointer-events-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
            >
              {author.image ? (
                <motion.div
                  className="w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/30 mb-4 sm:mb-6 shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <img
                    src={author.image}
                    alt={author.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ) : (
                <motion.div
                  className="text-7xl sm:text-9xl mb-4 sm:mb-6"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {author.icon}
                </motion.div>
              )}
              <h3 className="text-2xl sm:text-4xl font-bold text-center mb-2">
                {author.name}
              </h3>
              <p className="text-lg sm:text-xl text-gray-200 mb-1">{author.role}</p>
              <p className="text-sm sm:text-base text-gray-300/80">{author.class}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Tên', value: author.name },
            { label: 'Vị Trí', value: author.role },
            { label: 'Lớp', value: author.class },
          ].map((info) => (
            <div
              key={info.label}
              className="bg-gray-800/50 dark:bg-gray-800/50 rounded-lg p-3 sm:p-4 text-center border border-gray-600/30"
            >
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-1">
                {info.label}
              </p>
              <p className="text-gray-300 dark:text-gray-300 font-bold text-sm sm:text-base">
                {info.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <motion.button
            onClick={prevAuthor}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <DotNav count={authors.length} active={authorIndex} onClick={goToAuthor} />

          <motion.button
            onClick={nextAuthor}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 dark:bg-gray-700/60 dark:hover:bg-gray-700 text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={24} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Author Grid
// ---------------------------------------------------------------------------

const AuthorGrid: FC = () => {
  const { index: activeIndex, goTo: goToAuthor } = useCarousel(authors, 4000)

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {authors.map((author, idx) => (
        <motion.button
          key={author.name}
          onClick={() => goToAuthor(idx)}
          className="group transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div
            className={`bg-gray-700 dark:bg-gray-800 rounded-xl p-4 sm:p-6 text-center h-full transition-all ${
              idx === activeIndex
                ? 'ring-2 ring-gray-400 dark:ring-gray-500 shadow-lg shadow-gray-500/30'
                : ''
            }`}
          >
            {author.image ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/40 mx-auto mb-2 sm:mb-4">
                <img src={author.image} alt={author.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="text-4xl sm:text-6xl mb-2 sm:mb-4">{author.icon}</div>
            )}
            <h4 className="font-bold text-white text-sm sm:text-base mb-1">
              {author.name}
            </h4>
            <p className="text-gray-200 text-xs sm:text-sm">{author.role}</p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Description Section
// ---------------------------------------------------------------------------

const DescriptionSection: FC = () => (
  <motion.section
    className="px-4 sm:px-6 max-w-3xl mx-auto mb-16"
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6 }}
  >
    <div className="bg-gray-800/40 dark:bg-gray-800/70 rounded-2xl p-6 sm:p-8 border border-gray-600/30">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-700 dark:text-gray-200">
        Giới Thiệu Dự Án
      </h2>
      <span className="block h-1 bg-gray-300 dark:bg-gray-600 rounded-full mb-6" style={{ width: '80px' }} />
      <div className="space-y-4 text-gray-700 dark:text-gray-200 leading-relaxed">
        <p>
          Mô hình cảm biến ánh sáng Mặt Trời thông minh được thiết kế nhằm minh họa nguyên lý tận dụng năng lượng mặt trời hiệu quả hơn. Hệ thống sử dụng các cảm biến ánh sáng kết hợp với Arduino để nhận biết cường độ ánh sáng từ nhiều hướng khác nhau và tự động điều chỉnh tấm pin về phía có ánh sáng mạnh nhất. Qua đó, mô hình góp phần nâng cao hiệu suất thu nhận năng lượng và giúp học sinh tìm hiểu về tự động hóa, năng lượng tái tạo.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-gray-800/40 dark:bg-gray-800/40 rounded-lg p-4 border border-gray-600/20">
            <p className="font-bold text-gray-300 dark:text-gray-400 mb-1">Ứng dụng</p>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              Học tập STEM, nghiên cứu tự động hóa, năng lượng tái tạo, giáo dục ý thức tiết kiệm năng lượng và bảo vệ môi trường.
            </p>
          </div>
          <div className="bg-gray-800/40 dark:bg-gray-800/40 rounded-lg p-4 border border-gray-600/20">
            <p className="font-bold text-gray-300 dark:text-gray-400 mb-1">Thành phần chính</p>
            <p className="text-sm text-gray-400 dark:text-gray-400">
              Arduino Uno, cảm biến ánh sáng, động cơ servo, tấm pin mặt trời mini, pin sạc, quạt mini và các linh kiện hỗ trợ khác.
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
)

// ---------------------------------------------------------------------------
// Video Section
// ---------------------------------------------------------------------------

const VIDEO_ID = 'D3nshD9zafA'

const VideoSection: FC = () => {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.section
      className="px-4 sm:px-6 max-w-4xl mx-auto mb-16"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-8 sm:mb-12">
        <motion.h2
          className="text-2xl sm:text-4xl font-bold text-gray-700 dark:text-gray-200 inline-block relative"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Video Giới Thiệu
          <span className="block h-1 bg-gray-300 dark:bg-gray-600 rounded-full mt-3 mx-auto" style={{ width: '60%' }} />
        </motion.h2>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-800 border border-gray-600/30 group">
        {!loaded ? (
          <>
            <img
              src={`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`}
              alt="Video thumbnail"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
            <motion.button
              onClick={() => setLoaded(true)}
              className="absolute inset-0 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Phát video"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700 flex items-center justify-center shadow-lg shadow-gray-700/40 group-hover:shadow-gray-700/60 transition-shadow">
                <svg
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </motion.button>
          </>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
            title="Video giới thiệu dự án Smart Solar Sensor"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </motion.section>
  )
}

// ---------------------------------------------------------------------------
// Parallax section wrapper
// ---------------------------------------------------------------------------

const ParallaxSection: FC<{ children: React.ReactNode; speed?: number; className?: string }> = ({
  children, speed = 0.15, className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Typewriter effect
// ---------------------------------------------------------------------------

const Typewriter: FC<{ text: string; speed?: number }> = ({ text, speed = 40 }) => {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let i = 0
    let dir = 1
    let paused = false
    const timer = setInterval(() => {
      if (paused) return
      i += dir
      if (i > text.length) {
        dir = -1
        i = text.length
        paused = true
        setTimeout(() => { paused = false }, 10000)
        return
      } else if (i < 0) {
        dir = 1
        i = 0
        paused = true
        setTimeout(() => { paused = false }, 2000)
        return
      }
      setDisplayed(text.slice(0, i))
    }, speed)
    return () => clearInterval(timer)
  }, [started, text, speed])

  return (
    <span ref={ref}>
      {displayed}
      <motion.span
        className="inline-block w-[2px] h-[1.1em] bg-gray-400 dark:bg-gray-500 ml-0.5 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  )
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------

const Footer: FC = () => {
  return (
    <footer className="relative z-10 bg-white dark:bg-neutral-950 border-t border-gray-200 dark:border-gray-800 py-6 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span>☀️ Smart Solar Sensor – THCS Hòa Tân, xã Tân Nhuận Đông, Đồng Tháp</span>
        <span>© {new Date().getFullYear()} cklh809in</span>
      </div>
    </footer>
  );
};

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

const SmartSolarSensor: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-neutral-950 dark:text-gray-100 transition-colors duration-300 overflow-hidden relative">
      <SectionNav />
      <AnimatedBackground />
      <MouseEffects />

      <Navbar />

      <main className="relative z-10 pt-16 sm:pt-20">
        {/* Hero */}
        <ParallaxSection speed={0.1}>
          <section id="hero" className="pt-8 sm:pt-12 pb-4 sm:pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Mô Hình Cảm Biến Ánh Sáng Mặt Trời Thông Minh
              </h1>
              <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto min-h-[1.5em]">
                <Typewriter text="Một giải pháp năng lượng tái tạo với công nghệ cảm biến hiện đại để tối ưu hóa sử dụng năng lượng" />
              </p>
            </motion.div>

            <ImageCarousel />
          </section>
        </ParallaxSection>

        <StatsSection />

        {/* Features */}
        <ParallaxSection speed={-0.08}>
          <section id="features" className="px-4 sm:px-6 max-w-7xl mx-auto mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <motion.h2
                className="text-2xl sm:text-4xl font-bold text-gray-700 dark:text-gray-200 inline-block relative"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                Tính Năng Chính
                <span className="block h-1 bg-gray-300 dark:bg-gray-600 rounded-full mt-3 mx-auto" style={{ width: '60%' }} />
              </motion.h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, idx) => (
                <FeatureCard key={feature.title} feature={feature} index={idx} />
              ))}
            </div>
          </section>
        </ParallaxSection>

        {/* Authors */}
        <ParallaxSection speed={0.12}>
          <section id="authors" className="px-4 sm:px-6 max-w-7xl mx-auto mb-12 sm:mb-16">
            <div className="text-center mb-8 sm:mb-12">
              <motion.h2
                className="text-2xl sm:text-4xl font-bold text-gray-700 dark:text-gray-200 inline-block relative"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                Nhóm Tác Giả
                <span className="block h-1 bg-gray-300 dark:bg-gray-600 rounded-full mt-3 mx-auto" style={{ width: '60%' }} />
              </motion.h2>
            </div>
            <AuthorShowcase />
            <div className="mt-6 sm:mt-8">
              <AuthorGrid />
            </div>
          </section>
        </ParallaxSection>

        {/* Description */}
        <ParallaxSection speed={-0.1}>
          <DescriptionSection />
        </ParallaxSection>

        {/* Video */}
        <ParallaxSection speed={0.08}>
          <section id="video">
            <VideoSection />
          </section>
        </ParallaxSection>

        {/* Scroll to top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gray-800 dark:bg-gray-700 text-white shadow-xl hover:shadow-2xl hover:bg-gray-700 dark:hover:bg-gray-600 transition-all"
          whileHover={{ scale: 1.15, y: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Lên đầu trang"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <ChevronUp size={20} />
        </motion.button>
      </main>

      <Footer />
    </div>
  )
}

export default SmartSolarSensor
