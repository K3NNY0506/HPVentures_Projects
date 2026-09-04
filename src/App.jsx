import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import logo from './images/logo.png'
import ceoImage from './images/leadership/CEO_CROPPED (2).png'
import Groups from './groups.jsx'
import Staff from './staff.jsx'
import Careers from './Careers.jsx'
import Admin from './Admin.jsx'
import Footer from './Footer.jsx'
import Card3D from './Card3D.jsx'
import FloatingCertifications from './FloatingCertifications.jsx'
import { defaultEvents, loadEvents } from './eventData.js'
import { defaultArchiveEntries, defaultCertifications, defaultGroups, defaultWhatWeDo, loadArchiveEntries, loadCertifications, loadGroups, loadWhatWeDo } from './siteContent.js'

const defaultArchive = Object.fromEntries(Object.entries(defaultArchiveEntries).map(([key, entry], index) => [key, { ...entry, image: defaultEvents[index + 7] }]))

function FeatureBanner({
  image,
  title,
  text,
  reverse = false,
  isVisible = false,
  sectionRef
}) {
  return (
    <section
      ref={sectionRef}
      className={`feature-banner ${reverse ? 'reverse' : ''} ${
        isVisible ? 'is-visible' : ''
      }`}
    >
      <div
        className="feature-image"
        style={{ backgroundImage: `url("${image}")` }}
        role="img"
        aria-label={title}
      >
        <div className="feature-image-overlay" />

        <div className="feature-image-index">
          <span>01</span>
          <span>—</span>
          <span>FEATURED</span>
        </div>
      </div>

      <div className="feature-panel">

        {/* Decorative geometry */}
        <div className="feature-orbit feature-orbit-one">
          <span />
        </div>

        <div className="feature-orbit feature-orbit-two">
          <span />
        </div>

        <div className="feature-grid-lines" />

        {/* Large background number */}
        <div className="feature-big-number">
          01
        </div>

        {/* Top information */}
        <div className="feature-panel-top">
          <div className="feature-status">
            <span className="feature-status-dot" />
            <span>FEATURED</span>
          </div>

          <span className="feature-panel-count">
            01 / 01
          </span>
        </div>

        {/* Main content */}
        <div className="feature-content">

          <div className="feature-eyebrow">
            <span className="feature-line" />
            <span>PEOPLE &amp; PROGRESS</span>
          </div>

          <h2>{title}</h2>

          <p>{text}</p>

          <a className="feature-link" href="/staff">
            <span className="feature-link-text">
              Discover more
            </span>

            <span className="feature-link-arrow">
              ↗
            </span>
          </a>
        </div>

        {/* Bottom information */}
        <div className="feature-panel-bottom">
          <span>THE HP GROUP</span>

          <div className="feature-scroll-indicator">
            <span>EXPLORE</span>
            <span className="feature-scroll-line" />
          </div>
        </div>

      </div>
    </section>
  )
}


function WordScroller({ text }) {
  const words = text
    .split(',')
    .map((item) => item.trim().replace(/\.$/, '').toUpperCase())
    .filter(Boolean)

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(0)
    if (words.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, 2200)

    return () => clearInterval(timer)
  }, [text])

  if (words.length === 0) return null

  return (
    <span className="archive-word-scroller-box">
      <span key={currentIndex} className="archive-word-scroller-item">
        {words[currentIndex]}
      </span>
    </span>
  )
}

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroImages, setHeroImages] = useState(defaultEvents)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [categoryDirection, setCategoryDirection] = useState('next')
  const [archiveTab, setArchiveTab] = useState(null)
  const [content, setContent] = useState({ categories: defaultWhatWeDo, archive: defaultArchive })
  const [groupsList, setGroupsList] = useState(defaultGroups)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [featureVisible, setFeatureVisible] = useState(false)
  const [certifications, setCertifications] = useState(defaultCertifications)
  const [certIndex, setCertIndex] = useState(0)
  const [selectedCert, setSelectedCert] = useState(null)
  const heroAboutRef = useRef(null)
  const aboutSectionRef = useRef(null)
  const featureBannerRef = useRef(null)
  const believeRotateY = mousePosition.x * 12
  const believeRotateX = mousePosition.y * -8

  const { scrollYProgress } = useScroll({
  target: heroAboutRef,
  offset: ["start start", "end start"]
})

const [workspacePhotos, setWorkspacePhotos] = useState(() =>
  heroImages.slice(0, 5)
)

const [isPhotoShuffling, setIsPhotoShuffling] = useState(false)

useEffect(() => {
  setWorkspacePhotos(heroImages.slice(0, 5))
}, [heroImages])

useEffect(() => {
  if (workspacePhotos.length <= 1) return

  const interval = setInterval(() => {
    setIsPhotoShuffling(true)

    setTimeout(() => {
      setWorkspacePhotos((current) => {
        if (current.length <= 1) return current

        return [
          ...current.slice(1),
          current[0]
        ]
      })

      setIsPhotoShuffling(false)
    }, 650)
  }, 3000)

  return () => clearInterval(interval)
}, [workspacePhotos.length])
const aboutY = useTransform(
  scrollYProgress,
  [0, 0.55],
  ["100%", "0%"]
)

  if (window.location.pathname === '/groups' || window.location.pathname === '/groups/') {
    return <Groups />
  }

  if (window.location.pathname === '/staff' || window.location.pathname === '/staff/') {
    return <Staff />
  }

  if (window.location.pathname === '/careers' || window.location.pathname === '/careers/') {
    return <Careers />
  }

  if (window.location.pathname === '/infozadminz' || window.location.pathname === '/infozadminz/') {
    return <Admin />
  }

  useEffect(() => {
    const refreshContent = async () => {
      const [categories, archive, loadedGroups, loadedCertifications] = await Promise.all([loadWhatWeDo(), loadArchiveEntries(), loadGroups(), loadCertifications()])
      setContent({ categories, archive: Object.fromEntries(Object.entries(defaultArchive).map(([key, entry]) => [key, { ...entry, ...archive[key] }])) })
      if (loadedGroups && loadedGroups.length) {
        setGroupsList(loadedGroups)
      }
      if (loadedCertifications && loadedCertifications.length) {
        setCertifications(loadedCertifications)
      }
    }
    window.addEventListener('site-content-updated', refreshContent)
    const refreshEvents = async () => setHeroImages(await loadEvents())
    window.addEventListener('events-updated', refreshEvents)
    refreshContent()
    refreshEvents()
    const heroTimer = setInterval(() => setHeroIndex((currentIndex) => (currentIndex + 1) % Math.max(heroImages.length, 1)), 5000)
    const certTimer = setInterval(() => {
      setCertIndex((currentIndex) => (currentIndex + 1) % Math.max(certifications.length, 1))
    }, 4000)

    const updateHeaderState = () => {
      const heroSection = document.querySelector('.hero-section')
      if (!heroSection) return
      setHeaderScrolled(window.scrollY > heroSection.offsetTop + heroSection.offsetHeight - 90)
    }

    const aboutObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    const featureObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeatureVisible(true)
        }
      },
      { threshold: 0.25 }
    )

    if (aboutSectionRef.current) {
      aboutObserver.observe(aboutSectionRef.current)
    }

    if (featureBannerRef.current) {
      featureObserver.observe(featureBannerRef.current)
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => {
      clearInterval(heroTimer)
      clearInterval(certTimer)
      aboutObserver.disconnect()
      featureObserver.disconnect()
      window.removeEventListener('events-updated', refreshEvents)
      window.removeEventListener('site-content-updated', refreshContent)
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [heroImages.length])

  
useEffect(() => {
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * 2

    setMousePosition({ x, y })
  }

  window.addEventListener('mousemove', handleMouseMove)

  return () => {
    window.removeEventListener('mousemove', handleMouseMove)
  }
}, [])
  useEffect(() => {
    setCertIndex((currentIndex) => currentIndex % Math.max(certifications.length, 1))
  }, [certifications.length])

  const categoryNames = Object.keys(content.categories)
  const activeCategory = categoryNames[categoryIndex % categoryNames.length]
  const visibleCards = content.categories[activeCategory] || []

  const moveCategory = (direction) => {
    document.getElementById('the-team')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setCategoryDirection(direction > 0 ? 'next' : 'previous')
    setCategoryIndex((currentIndex) => (currentIndex + direction + categoryNames.length) % categoryNames.length)
  }

  return (
    <main className="site-shell">
      <nav className={`topbar ${headerScrolled ? 'scrolled' : 'transparent'}`} aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
        <button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
        <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {['About us', 'Groups', 'The Team', 'Careers'].map((item) => <a href={item === 'Groups' ? '/groups' : item === 'The Team' ? '/staff' : item === 'Careers' ? '/careers' : `#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>) }
        </div>
        <a className="phone-link" href="#"><span aria-hidden="true">☎</span> (032) 343-9651 </a>
      </nav>

  <div className="hero-about-reveal" ref={heroAboutRef}>
      <section className="hero-section" id="about-us">
        <div className="hero-background" key={heroIndex} style={{ backgroundImage: `url("${heroImages[heroIndex]}")` }} aria-hidden="true" />
        <div className="hero-copy">
          <h1>Emancipating of<br />Quality and Quantifiable Investments<span>.</span></h1>
          <div className="hero-actions">
            <a className="primary-action" href="#about-us">Learn More</a>
          </div>
        </div>
      </section>

      
  </div>


<section className="workspace-section" id="about-content" ref={aboutSectionRef}>
  <div className="workspace-inner">

    {/* TOP META */}
    <motion.div
      className="workspace-meta"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
    >
      <span>THE HP GROUP</span>
      <span>ABOUT US</span>
      <span>01 / 04</span>
    </motion.div>

    {/* MAIN STATEMENT */}
    <div className="workspace-heading">

      <motion.p
        className="workspace-kicker"
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        Who we are
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        We build
        <br />
        <span>businesses.</span>
      </motion.h2>

      <motion.div
        className="workspace-heading-accent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      />
    </div>

    {/* IMAGE + CONTENT */}
    <div className="workspace-grid">

      {/* IMAGE */}
      <div className="workspace-image-stack">

  {/* Main image */}
  <motion.div
    className="workspace-image-wrap"
    initial={{ opacity: 0, x: -80 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, amount: 0.25 }}
    transition={{
      duration: 1,
      ease: [0.22, 1, 0.36, 1]
    }}
  >
    <motion.div
      className="workspace-image"
      style={{
        backgroundImage: `url("${heroImages[1] || defaultEvents[1]}")`
      }}
      whileHover={{ scale: 1.025 }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1]
      }}
    />

    <div className="workspace-image-overlay" />

    <div className="workspace-image-label">
      <span>OUR WORKSPACE</span>
      <span>EST. — 20XX</span>
    </div>

    <div className="workspace-image-number">
      01
    </div>
  </motion.div>


  {/* SHUFFLING PHOTO STACK */}
  {/* SHUFFLING PHOTO STACK */}
<div className="workspace-photo-stack">
  {workspacePhotos.map((image, index) => {
    const isFront = index === 0

    return (
      <motion.div
        key={image}
        className={`workspace-stack-photo ${
          isFront && isPhotoShuffling
            ? 'workspace-stack-photo-shuffling'
            : ''
        }`}
        style={{
          backgroundImage: `url("${image}")`,
          zIndex: workspacePhotos.length - index,
        }}
        animate={{
          x: isFront
            ? isPhotoShuffling
              ? 110
              : 0
            : index * 12,

          y: isFront
            ? isPhotoShuffling
              ? -25
              : 0
            : index * -8,

          rotate: isFront
            ? isPhotoShuffling
              ? 8
              : 0
            : index % 2 === 0
              ? 3
              : -3,

          scale: isFront
            ? 1
            : 1 - index * 0.035,

          opacity: isFront && isPhotoShuffling
            ? 0
            : 1,
        }}
        transition={{
          duration: isFront && isPhotoShuffling ? 0.65 : 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    )
  })}
</div>

</div>


      {/* TEXT */}
      <motion.div
        className="workspace-copy"
        initial={{ opacity: 0, x: 70 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.9,
          delay: 0.15,
          ease: [0.22, 1, 0.36, 1]
        }}
      >

        <div className="workspace-copy-label">
          <span />
          OUR APPROACH
        </div>

        <h3>
          Built for the
          <br />
          <em>long term.</em>
        </h3>

        <p>
          We bring together people, ideas, and businesses with a
          shared ambition to create meaningful and sustainable growth.
        </p>

        <p>
          Through thoughtful leadership, collaboration, and a
          long-term perspective, we build businesses that are
          designed to move forward.
        </p>

        <div className="workspace-copy-footer">
          <span>PEOPLE</span>
          <span>PROGRESS</span>
          <span>POSSIBILITY</span>
        </div>

      </motion.div>

    </div>


    {/* FLOATING STATEMENT */}
    <motion.div
      className="workspace-floating"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.8,
        delay: 0.3
      }}
    >
      <span className="workspace-floating-number">
        01
      </span>

      <p>
        One group.
        <br />
        <strong>Multiple possibilities.</strong>
      </p>

      <span className="workspace-floating-arrow">
        ↗
      </span>
    </motion.div>


    {/* DECORATIVE ORBIT */}
    <motion.div
      className="workspace-orbit"
      animate={{
        rotate: 360
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <span />
    </motion.div>

  </div>
</section>

      <FeatureBanner
        image={heroImages[3] || defaultEvents[3]}
        title="People who build progress."
        text="Our work is made possible by the people, partnerships, and communities that move every idea forward."
        isVisible={featureVisible}
        sectionRef={featureBannerRef}
      />

      <section className="workspace-section" id="the-team">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><big>What we do</big></p><h2>{activeCategory}</h2>
          </div>
          <div className="carousel-controls">
            <button className="carousel-arrow" aria-label="Previous category" onClick={() => moveCategory(-1)}>←</button>
            <span>{String(categoryIndex + 1).padStart(2, '0')} / {String(categoryNames.length).padStart(2, '0')}</span>
            <button className="carousel-arrow" aria-label="Next category" onClick={() => moveCategory(1)}>→</button>
          </div>
        </div>
        <div className={`project-grid category-slide ${categoryDirection}`} key={categoryIndex}>
          {visibleCards.map((card, index) => <Card3D className="project-card" key={card.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{card.title}</h3><p>{card.text}</p></Card3D>)}
        </div>
      </section>

      <section className="companies-partners-section">
        <div className="logo-ticker-section">
          <motion.div
  className="partners-mouse-content"
  animate={{
    rotateY: mousePosition.x * 10,
    rotateX: mousePosition.y * -10,
    x: mousePosition.x * 10,
    y: mousePosition.y * 10,
  }}
  transition={{
    type: "spring",
    stiffness: 50,
    damping: 18,
    mass: 0.6,
  }}
  style={{
    transformPerspective: 1000,
    transformStyle: "preserve-3d",
  }}
>
  <p className="logo-ticker-heading">Our Partners</p>

  <p className="logo-ticker-subheading">
    We work closely with trusted partners to deliver meaningful value,
    <br />
    foster sustainable growth, and build long-term
    <br />
    success through strong collaboration and shared goals.
  </p>
</motion.div>
          <div className="logo-ticker-track-wrapper">
            <div className="logo-ticker-track">
              {[...(groupsList.length ? groupsList : defaultGroups), ...(groupsList.length ? groupsList : defaultGroups), ...(groupsList.length ? groupsList : defaultGroups)].map((item, idx) => (
                <div key={idx} className="logo-ticker-item">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </div>
              ))}
            </div>  
          </div>
        </div>
      </section>

     <section className="archive-section" id="mission-vision-values">

  {/* WHAT WE BELIEVE HEADING */}
  <div className="archive-heading" style={{ textAlign: "center" }}>
    <p className="archive-kicker">
      The HP Group / Our foundation
    </p>

    <motion.h2
      animate={{
        rotateY: mousePosition.x * 20,
        rotateX: mousePosition.y * -12,
        x: mousePosition.x * 6,
        y: mousePosition.y * 6,
      }}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 15,
        mass: 0.5,
      }}
      style={{
        transformPerspective: 800,
        transformStyle: "preserve-3d",
        display: "inline-block",
      }}
    >
      What We Believe<span>.</span>
    </motion.h2>
  </div>


  {/* BELIEF CUBES */}
  <div className="belief-cubes">

    {Object.keys(content.archive).map((tab) => {

      const isOpen = archiveTab === tab

      return (
        <motion.div
          key={tab}
          className={`belief-cube ${isOpen ? "open" : ""}`}
          layout
          onClick={() =>
            setArchiveTab(isOpen ? null : tab)
          }
          whileHover={!isOpen ? {
            y: -10,
            rotateX: 4,
            rotateY: -4,
          } : {}}
          whileTap={{ scale: 0.97 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
          style={{
            transformPerspective: 1000,
          }}
        >

          <AnimatePresence mode="wait" initial={false}>

            {/* CLOSED CUBE */}
            {!isOpen ? (

              <motion.div
                key="cube"
                className="belief-cube-face"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.25,
                }}
              >

                <span className="belief-cube-number">
                  {String(
                    Object.keys(content.archive).indexOf(tab) + 1
                  ).padStart(2, "0")}
                </span>

                <h3>
                  {tab}
                </h3>

                <span className="belief-cube-arrow">
                  ↗
                </span>

              </motion.div>

            ) : (

              /* OPEN CONTENT */
              <motion.div
                key="content"
                className="belief-cube-content"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.3,
                }}
              >

                <span className="belief-content-label">
                  {content.archive[tab].label}
                </span>

                <h3>
                  {content.archive[tab].title}
                </h3>

                {content.archive[tab].text.includes(",") ? (

                  <div className="archive-word-scroller-container">
                    <WordScroller
                      text={content.archive[tab].text}
                    />
                  </div>

                ) : (

                  <p>
                    {content.archive[tab].text}
                  </p>

                )}

                <span className="belief-close">
                  Click to close
                </span>

              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>
      )

    })}

  </div>

</section>

      <FloatingCertifications />
      
      <Footer />
    </main>
  )
}

export default App


  