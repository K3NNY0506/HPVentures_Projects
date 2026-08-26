import { useEffect, useState } from 'react'
import logo from './images/logo.png'
import Groups from './groups.jsx'
import Staff from './staff.jsx'
import Admin from './Admin.jsx'
import Footer from './Footer.jsx'
import { defaultEvents, loadEvents } from './eventData.js'
import { defaultArchiveEntries, defaultWhatWeDo, loadArchiveEntries, loadWhatWeDo } from './siteContent.js'

const defaultArchive = Object.fromEntries(Object.entries(defaultArchiveEntries).map(([key, entry], index) => [key, { ...entry, image: defaultEvents[index + 7] }]))

function FeatureBanner({ image, title, text, reverse = false }) {
  return (
    <section className={`feature-banner ${reverse ? 'reverse' : ''}`}>
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [heroImages, setHeroImages] = useState(defaultEvents)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [categoryDirection, setCategoryDirection] = useState('next')
  const [archiveTab, setArchiveTab] = useState('VISION')
  const [content, setContent] = useState({ categories: defaultWhatWeDo, archive: defaultArchive })

  if (window.location.pathname === '/groups' || window.location.pathname === '/groups/') {
    return <Groups />
  }

  if (window.location.pathname === '/staff' || window.location.pathname === '/staff/') {
    return <Staff />
  }

  if (window.location.pathname === '/infozadminz' || window.location.pathname === '/infozadminz/') {
    return <Admin />
  }

  useEffect(() => {
    const refreshContent = async () => {
      const [categories, archive] = await Promise.all([loadWhatWeDo(), loadArchiveEntries()])
      setContent({ categories, archive: Object.fromEntries(Object.entries(defaultArchive).map(([key, entry]) => [key, { ...entry, ...archive[key] }])) })
    }
    window.addEventListener('site-content-updated', refreshContent)
    const refreshEvents = async () => setHeroImages(await loadEvents())
    window.addEventListener('events-updated', refreshEvents)
    refreshContent()
    refreshEvents()
    const heroTimer = setInterval(() => setHeroIndex((currentIndex) => (currentIndex + 1) % Math.max(heroImages.length, 1)), 5000)

    return () => {
      clearInterval(heroTimer)
      window.removeEventListener('events-updated', refreshEvents)
      window.removeEventListener('site-content-updated', refreshContent)
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
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
        <button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
        <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {['About us', 'Groups', 'The Team', 'Contacts'].map((item) => <a href={item === 'Groups' ? '/groups' : item === 'The Team' ? '/staff' : `#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>) }
        </div>
        <a className="phone-link" href="tel:(032) 343-9651 "><span aria-hidden="true">☎</span> (032) 343-9651 </a>
      </nav>

      <section className="hero-section" id="#about-us">
        <div className="hero-background" key={heroIndex} style={{ backgroundImage: `url("${heroImages[heroIndex]}")` }} aria-hidden="true" />
        <div className="hero-copy">
          <h1>Emancipating of<br />Quality and Quantifiable Investments<span>.</span></h1>
          <div className="hero-actions">
            <a className="primary-action" href="#contacts">Request a quote</a><a className="secondary-action" href="#the-team">Learn more</a>
          </div>
        </div>
      </section>

      <section className="workspace-section" id="about-us">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><big>About Us</big></p><h2>The HP Group</h2>
          </div>
            <div>
            <p>A Commitment to Value and Excellence</p>
          </div>
        </div>
        <div>
          <p> The Group aims to nurture the key strengths of each individual under the umbrella with the aim to the enhancement and development of each person's skills and capabilities, exudes enough confidence, highlighting each and everyone's worh while valuing the synergy and interoperatability within our key business points.</p>
          
          <p>Our strategy is underlined in our determination to pursue growth from within while exploring the business opportunities under the framework of justice and equity.</p>
          
          <p>We put emphasis in the Value of our people whom we considered our key assets. We invest accordingly with our stakeholders best interest in mind. We put Value in every trust and confidence our stakeholders gave us.</p>
          
          <p>We move towards Excellence in everything we do in a timely and orderly fashion.</p>
        </div>
      </section>

      <FeatureBanner
        image={heroImages[3] || defaultEvents[3]}
        title="People who build progress."
        text="Our work is made possible by the people, partnerships, and communities that move every idea forward."
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

      <section className="archive-section" id="mission-vision-values">
        <div className="archive-heading">
          <p className="archive-kicker">The HP Group / Our foundation</p>
          <h2>What We Believe<span>.</span></h2>
        </div>
        <div className="archive-tabs" role="tablist" aria-label="Mission, vision and core values">
          {Object.keys(content.archive).map((tab) => <button className={archiveTab === tab ? 'active' : ''} role="tab" aria-selected={archiveTab === tab} key={tab} onClick={() => setArchiveTab(tab)}>{tab}</button>)}
        </div>
        <div className="archive-panel">
          <div className="archive-copy">
            <p className="archive-file">{content.archive[archiveTab].label}</p>
            <h3>{content.archive[archiveTab].title}</h3>
            <p>{content.archive[archiveTab].text}</p>
          </div>
          <div className="archive-image" style={{ backgroundImage: `url("${content.archive[archiveTab].image}")` }} role="img" aria-label={archiveTab} />
        </div>
      </section>


      <Footer />
    </main>
  )
}

export default App
