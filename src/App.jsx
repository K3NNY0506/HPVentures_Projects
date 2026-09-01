import { useEffect, useRef, useState } from 'react'
import logo from './images/logo.png'
import ceoImage from './images/leadership/CEO_CROPPED (2).png'
import Groups from './groups.jsx'
import Staff from './staff.jsx'
import Careers from './Careers.jsx'
import Admin from './Admin.jsx'
import Footer from './Footer.jsx'
import { defaultEvents, loadEvents } from './eventData.js'
import { defaultArchiveEntries, defaultGroups, defaultWhatWeDo, loadArchiveEntries, loadGroups, loadWhatWeDo } from './siteContent.js'

const defaultArchive = Object.fromEntries(Object.entries(defaultArchiveEntries).map(([key, entry], index) => [key, { ...entry, image: defaultEvents[index + 7] }]))

function FeatureBanner({ image, title, text, reverse = false, isVisible = false, sectionRef }) {
  return (
    <section ref={sectionRef} className={`feature-banner ${reverse ? 'reverse' : ''} ${isVisible ? 'is-visible' : ''}`}>
      <div className="feature-image" style={{ backgroundImage: `url("${image}")` }} role="img" aria-label={title} />
      <div className="feature-panel">
        <p className="eyebrow">Featured</p>
        <h2>{title}</h2>
        <p>{text}</p>
        <a className="feature-link" href="/staff">Discover more <span>→</span></a>
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroImages, setHeroImages] = useState(defaultEvents)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [categoryDirection, setCategoryDirection] = useState('next')
  const [archiveTab, setArchiveTab] = useState('VISION')
  const [content, setContent] = useState({ categories: defaultWhatWeDo, archive: defaultArchive })
  const [groupsList, setGroupsList] = useState(defaultGroups)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [aboutVisible, setAboutVisible] = useState(false)
  const [featureVisible, setFeatureVisible] = useState(false)
  const aboutSectionRef = useRef(null)
  const featureBannerRef = useRef(null)

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
      const [categories, archive, loadedGroups] = await Promise.all([loadWhatWeDo(), loadArchiveEntries(), loadGroups()])
      setContent({ categories, archive: Object.fromEntries(Object.entries(defaultArchive).map(([key, entry]) => [key, { ...entry, ...archive[key] }])) })
      if (loadedGroups && loadedGroups.length) {
        setGroupsList(loadedGroups)
      }
    }
    window.addEventListener('site-content-updated', refreshContent)
    const refreshEvents = async () => setHeroImages(await loadEvents())
    window.addEventListener('events-updated', refreshEvents)
    refreshContent()
    refreshEvents()
    const heroTimer = setInterval(() => setHeroIndex((currentIndex) => (currentIndex + 1) % Math.max(heroImages.length, 1)), 5000)

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
      aboutObserver.disconnect()
      featureObserver.disconnect()
      window.removeEventListener('events-updated', refreshEvents)
      window.removeEventListener('site-content-updated', refreshContent)
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [heroImages.length])

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

      <section className="hero-section" id="#about-us">
        <div className="hero-background" key={heroIndex} style={{ backgroundImage: `url("${heroImages[heroIndex]}")` }} aria-hidden="true" />
        <div className="hero-copy">
          <h1>Emancipating of<br />Quality and Quantifiable Investments<span>.</span></h1>
          <div className="hero-actions">
            <a className="primary-action" href="#Careers">Request a quote</a><a className="secondary-action" href="#the-team">Learn more</a>
          </div>
        </div>
      </section>

      <section className="workspace-section" id="about-us" ref={aboutSectionRef}>
        <div className="about-orange-shape" aria-hidden="true" />
        <div className={`about-container ${aboutVisible ? 'is-visible' : ''}`}>
          <div className="about-copy">
            <div className="section-heading">
              <div>
                <p className="eyebrow"><big>About Us</big></p>
                <h2>The HP Group</h2>
              </div>
              <div>
                <p className="about-subheading">A Commitment to Value and Excellence</p>
              </div>
            </div>
            <div className="about-text">
              <p style={{ textAlign: "justify" }}>The Group aims to nurture the key strengths of each individual under the umbrella with the aim to the enhancement and development of each person's skills and capabilities, exudes enough confidence, highlighting each and everyone's worth while valuing the synergy and interoperability within our key business points.</p>
              
              <p style={{ textAlign: "justify" }}>Our strategy is underlined in our determination to pursue growth from within while exploring the business opportunities under the framework of justice and equity.</p>
              
              <p style={{ textAlign: "justify" }}>We put emphasis in the <strong>Value of our people</strong> whom we considered our key assets. We invest accordingly with our stakeholders' best interest in mind. We put <strong>Value</strong> in every trust and confidence our stakeholders gave us.</p>
              
              <p style={{ textAlign: "justify" }}>We move towards <strong>Excellence</strong> in everything we do in a timely and orderly fashion.</p>
            </div>
          </div>
          <div className="about-ceo-wrapper">
            <img src={ceoImage} alt="HP Group Leadership" className="about-ceo-image" />
          </div>
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
          {visibleCards.map((card, index) => <article className="project-card" key={card.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}
        </div>
      </section>

      <section className="companies-partners-section">
        <div className="logo-ticker-section">
          <p className="logo-ticker-heading">Our Partners</p>
          <p className="logo-ticker-subheading">We work closely with trusted partners to deliver meaningful value,<br></br> foster sustainable growth, and build long-term <br></br> success through strong collaboration and shared goals.</p>
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
        <div className="archive-heading">
          <p className="archive-kicker">The HP Group / Our foundation</p>
          <h2>What We Believe<span>.</span></h2>
        </div>
        <div className="archive-tabs" role="tablist" aria-label="Mission, vision and core values">
          {Object.keys(content.archive).map((tab) => <button className={archiveTab === tab ? 'active' : ''} role="tab" aria-selected={archiveTab === tab} key={tab} onClick={() => setArchiveTab(tab)}>{tab}</button>)}
        </div>
        <div className="archive-panel" key={archiveTab}>
          <div className="archive-copy">
            <p className="archive-file">{content.archive[archiveTab].label}</p>
            <h3>{content.archive[archiveTab].title}</h3>

            {content.archive[archiveTab].text.includes(',') ? (
              <div className="archive-word-scroller-container">
                <WordScroller text={content.archive[archiveTab].text} />
              </div>
            ) : (
              <p>{content.archive[archiveTab].text}</p>
            )}
          </div>
          <div className="archive-image" style={{ backgroundImage: `url("${content.archive[archiveTab].image}")` }} role="img" aria-label={archiveTab} />
        </div>
      </section>

      
      <Footer />
    </main>
  )
}

export default App


  