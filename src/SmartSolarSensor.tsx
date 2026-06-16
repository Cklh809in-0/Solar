import { memo, useState, type FC } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Moon, Sun, Pause, Play } from 'lucide-react'
import { useCarousel } from './hooks/useCarousel'
import { useTheme } from './contexts/ThemeContext'
import { AnimatedBackground } from './components/AnimatedBackground'
import { MouseEffects, ParallaxCard } from './components/MouseEffects'
import { productImages, authors, features, type Feature } from './data/content'

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------

const Navbar: FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-dracula-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dracula-current">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          ☀️ Smart Solar Sensor
        </motion.div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-gray-500 dark:text-dracula-comment">
            THCS Hòa Tân | Đồng Tháp
          </span>
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-dracula-current text-gray-600 dark:text-dracula-fg hover:bg-gray-200 dark:hover:bg-dracula-comment transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={theme === 'dracula' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện Dracula'}
          >
            {theme === 'dracula' ? <Sun size={20} /> : <Moon size={20} />}
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
          backgroundColor: i === active ? '#8be9fd' : '#6272a4',
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
      className="relative bg-gradient-to-br from-blue-900/50 to-slate-900/50 dark:from-dracula-bg dark:to-dracula-current rounded-2xl p-4 sm:p-8 border border-blue-500/20 dark:border-dracula-comment/30 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-green-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Image area */}
        <div className="aspect-video rounded-xl overflow-hidden border border-blue-400/20 dark:border-dracula-comment/30 relative mb-6 bg-slate-800 select-none">
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

          {/* Overlay text */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-cyan-300">
              {item.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-300">{item.desc}</p>
          </motion.div>

          {/* Pause overlay button */}
          <button
            onClick={togglePause}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
            aria-label={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={prev}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} />
          </motion.button>

          <DotNav count={productImages.length} active={index} onClick={goTo} />

          <motion.button
            onClick={next}
            className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
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
        className="group bg-gradient-to-br from-blue-900/40 to-slate-900/40 dark:from-dracula-current dark:to-dracula-bg p-6 sm:p-8 rounded-xl border border-blue-500/20 dark:border-dracula-comment/30 hover:border-blue-500/50 dark:hover:border-dracula-cyan/50 transition-colors"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
      >
        <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
          <Icon size={32} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-dracula-fg">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-dracula-comment">
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
      className="relative bg-gradient-to-br from-emerald-900/50 to-cyan-900/50 dark:from-dracula-current dark:to-dracula-bg rounded-2xl p-4 sm:p-8 border border-emerald-500/20 dark:border-dracula-green/30 overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Author card */}
        <div className="aspect-video bg-gradient-to-br from-emerald-600 to-cyan-600 dark:from-dracula-green/20 dark:to-dracula-cyan/20 rounded-xl mb-6 flex items-center justify-center border border-emerald-400/20 dark:border-dracula-cyan/30 relative overflow-hidden select-none">
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
              <p className="text-lg sm:text-xl text-cyan-100 mb-1">{author.role}</p>
              <p className="text-sm sm:text-base text-cyan-50/80">{author.class}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Author info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { label: 'Tên', value: author.name },
            { label: 'Vị Trí', value: author.role },
            { label: 'Lớp', value: author.class },
          ].map((info) => (
            <div
              key={info.label}
              className="bg-slate-800/50 dark:bg-dracula-current/50 rounded-lg p-3 sm:p-4 text-center border border-cyan-400/20 dark:border-dracula-cyan/20"
            >
              <p className="text-gray-400 dark:text-dracula-comment text-xs sm:text-sm mb-1">
                {info.label}
              </p>
              <p className="text-cyan-300 dark:text-dracula-cyan font-bold text-sm sm:text-base">
                {info.value}
              </p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <motion.button
            onClick={prevAuthor}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-dracula-green/60 dark:hover:bg-dracula-green text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={24} />
          </motion.button>

          <DotNav count={authors.length} active={authorIndex} onClick={goToAuthor} />

          <motion.button
            onClick={nextAuthor}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-dracula-green/60 dark:hover:bg-dracula-green text-white transition-colors"
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
            className={`bg-gradient-to-br from-emerald-600 to-cyan-600 dark:from-dracula-green/80 dark:to-dracula-cyan/80 rounded-xl p-4 sm:p-6 text-center h-full transition-all ${
              idx === activeIndex
                ? 'ring-2 ring-cyan-400 dark:ring-dracula-cyan shadow-lg shadow-cyan-500/30'
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
            <p className="text-cyan-100 text-xs sm:text-sm">{author.role}</p>
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
    <div className="bg-gradient-to-r from-blue-900/40 to-slate-900/40 dark:from-dracula-current/70 dark:to-dracula-bg/70 rounded-2xl p-6 sm:p-8 border border-blue-500/20 dark:border-dracula-comment/30">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300 dark:text-dracula-cyan">
        Giới Thiệu Dự Án
      </h2>
      <div className="space-y-4 text-gray-700 dark:text-dracula-fg leading-relaxed">
        <p>
          Mô hình cảm biến ánh sáng mặt trời thông minh là một dự án khoa học
          tập trung vào việc tạo ra một hệ thống năng lượng tái tạo hiệu quả và
          thông minh.
        </p>
        <p>
          Hệ thống sử dụng tấm pin mặt trời để cung cấp năng lượng, kết hợp với
          các cảm biến ánh sáng để phát hiện cường độ ánh sáng xung quanh, từ đó
          điều khiển tự động việc sáng/tắt đèn LED.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-800/40 dark:bg-dracula-current/40 rounded-lg p-4 border border-blue-500/10 dark:border-dracula-comment/20">
            <p className="font-bold text-yellow-300 dark:text-dracula-yellow mb-1">Ứng dụng</p>
            <p className="text-sm text-gray-300 dark:text-dracula-comment">
              Chiếu sáng công cộng, hệ thống cảm ứng thông minh, tiết kiệm năng
              lượng và bảo vệ môi trường.
            </p>
          </div>
          <div className="bg-slate-800/40 dark:bg-dracula-current/40 rounded-lg p-4 border border-blue-500/10 dark:border-dracula-comment/20">
            <p className="font-bold text-green-300 dark:text-dracula-green mb-1">Thành phần chính</p>
            <p className="text-sm text-gray-300 dark:text-dracula-comment">
              Tấm pin mặt trời, cảm biến ánh sáng, vi điều khiển, LED, mạch điện,
              giá đỡ.
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
      <motion.h2
        className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-cyan-500 dark:text-dracula-cyan"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Video Giới Thiệu
      </motion.h2>

      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-800 border border-blue-500/20 dark:border-dracula-comment/30 group">
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:shadow-red-600/60 transition-shadow">
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
// Footer
// ---------------------------------------------------------------------------

const Footer: FC = () => {
  return (
    <footer className="bg-white dark:bg-dracula-background border-t border-gray-200 dark:border-dracula-current py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-800 dark:text-dracula-comment">
          🌱 Sáng tạo Thanh thiếu niên Nhi đồng • Trường THCS Hòa Tân, Đồng Tháp
        </p>
      </div>
    </footer>
  );
};

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

const SmartSolarSensor: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dracula-bg dark:text-dracula-fg transition-colors duration-300 overflow-hidden relative">
      <AnimatedBackground />
      <MouseEffects />

      <Navbar />

      <main className="relative z-10 pt-16 sm:pt-20">
        {/* Hero */}
        <section className="pt-8 sm:pt-12 pb-4 sm:pb-8 px-4 sm:px-6 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient-shift">
              Mô Hình Cảm Biến Ánh Sáng Mặt Trời Thông Minh
            </h1>
            <p className="text-base sm:text-lg text-gray-500 dark:text-dracula-comment max-w-2xl mx-auto">
              Một giải pháp năng lượng tái tạo với công nghệ cảm biến hiện đại để
              tối ưu hóa sử dụng năng lượng
            </p>
          </motion.div>

          <ImageCarousel />
        </section>

        {/* Features */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-12 sm:mb-16">
          <motion.h2
            className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-cyan-500 dark:text-dracula-cyan"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Tính Năng Chính
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={feature.title} feature={feature} index={idx} />
            ))}
          </div>
        </section>

        {/* Authors */}
        <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-12 sm:mb-16">
          <motion.h2
            className="text-2xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-cyan-500 dark:text-dracula-cyan"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Nhóm Tác Giả
          </motion.h2>
          <AuthorShowcase />
          <div className="mt-6 sm:mt-8">
            <AuthorGrid />
          </div>
        </section>

        {/* Description */}
        <DescriptionSection />

        {/* Video */}
        <VideoSection />

        {/* Scroll to top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-blue-600 dark:bg-dracula-current text-white shadow-lg hover:bg-blue-500 dark:hover:bg-dracula-comment transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Lên đầu trang"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </motion.button>
      </main>

      <Footer />
    </div>
  )
}

export default SmartSolarSensor
