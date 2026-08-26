import { useEffect, useState } from 'react'
import logo from './images/logo.png'
import Groups from './groups.jsx'
import Staff from './staff.jsx'
import Footer from './Footer.jsx'
import heroImageOne from './images/company_events/171-Enhanced-NR.jpg'
import heroImageTwo from './images/company_events/187-Enhanced-NR.jpg'
import heroImageThree from './images/company_events/268-Enhanced-NR.jpg'
import heroImageFour from './images/company_events/280-Enhanced-NR.jpg'
import heroImageFive from './images/company_events/491222308_1139710681502200_736987314008467945_n.jpg'
import heroImageSix from './images/company_events/491339986_1139565998183335_2328618360663044858_n.jpg'
import heroImageSeven from './images/company_events/492124794_1140941494712452_1302670891728671341_n.jpg'
import heroImageEight from './images/company_events/8006541_DSC_0043.JPG'
import heroImageNine from './images/company_events/8006541_DSC_0049_high.JPG'
import heroImageTen from './images/company_events/dji_fly_20250901_114622_0014_1756701711042_photo.jpg'
import heroImageEleven from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'

const heroImages = [
  heroImageOne, heroImageTwo, heroImageThree, heroImageFour, heroImageFive,
  heroImageSix, heroImageSeven, heroImageEight, heroImageNine, heroImageTen, heroImageEleven,
]

const categories = {
  'Investors Relations': [
    { title: 'Financial Study', text: 'HP Ventures, Inc. is a growing investment holding company focused on building a diverse and profitable portfolio through strategic investments, prudent risk management, and sustainable growth.' },
    { title: 'Corporate Trends', text: 'HP Ventures, Inc. has various exposures in the local outsourcing services industry, while expanding into trading, manufacturing, IT, and real estate through its growing portfolio.' },
    { title: 'Banks', text: 'HP Ventures, Inc. has investments across outsourcing, IT, trading and manufacturing, and real estate, with affiliates managed for aligned and profitable operations.' },
    { title: 'Portfolio Growth', text: 'A measured approach to expanding our portfolio, creating long-term value through thoughtful investment and responsible management.' },
    { title: 'Risk Management', text: 'We balance opportunity with discipline, using clear analysis and prudent decision-making to protect the future of every investment.' },
  ],
  'Business Interest': [
    { title: 'Outsourcing', text: 'Building dependable service businesses that help organizations operate with greater focus, speed, and confidence.' },
    { title: 'Information Technology', text: 'Supporting practical technology solutions that make businesses more connected, capable, and ready for change.' },
    { title: 'Trading & Manufacturing', text: 'Growing our presence in the trading and manufacturing space through reliable products and local market knowledge.' },
    { title: 'Real Estate', text: 'Investing in places and properties that serve people well and create durable value over time.' },
    { title: 'New Opportunities', text: 'We stay curious about new markets, partners, and ideas that fit our values and strengthen our portfolio.' },
  ],
  'Social Responsibility': [
    { title: 'Community', text: 'We participate in initiatives that nurture people, strengthen communities, and support a more inclusive future.' },
    { title: 'Nation Building', text: 'Our work contributes to the growth of the communities and local economies where our businesses operate.' },
    { title: 'Environment', text: 'We believe responsible growth includes caring for the environment and making thoughtful choices today.' },
    { title: 'Collective Action', text: 'Partnership and shared effort help turn good intentions into meaningful, lasting outcomes.' },
    { title: 'People First', text: 'We value the people behind every business and seek to create opportunities for them to thrive.' },
  ],
  Careers: [
    { title: 'Join Our Team', text: 'Bring your perspective, expertise, and ambition to a growing group of businesses with room to make an impact.' },
    { title: 'Growth Mindset', text: 'We support people who stay curious, take ownership, and keep looking for better ways forward.' },
    { title: 'Shared Values', text: 'Integrity, accountability, and respect shape how we work with our colleagues, partners, and communities.' },
    { title: 'Make An Impact', text: 'Your work can reach beyond a single role, contributing to businesses and initiatives that matter.' },
    { title: 'Our Culture', text: 'We are building a culture that is collaborative, practical, and open to new ideas.' },
  ],
}

const categoryNames = Object.keys(categories)

const archiveEntries = {
  VISION: {
    label: '#1',
    title: 'WHAT WE ENVISION.',
    text: 'We envisioned a Highly Valuable entity providing Excellent products and services to all our customers in all our business segments.',
    image: heroImageEight,
  },
  MISSION: {
    label: '#2',
    title: 'WHAT WE STRIVE FOR.',
    text: 'Our Mission is embedded well within the goals and aspirations of all our business entities as they progress on their day to day business.',
    image: heroImageNine,
  },
  'CORE VALUES': {
    label: '#3',
    title: 'WHAT STICKS US TOGETHER.',
    text: 'Innovation, Teamwork, Customer Service, Calculated Risk, Growth Oriented, Hard Work, Perseverance.',
    image: heroImageTen,
  },
}

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
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [categoryDirection, setCategoryDirection] = useState('next')
  const [archiveTab, setArchiveTab] = useState('VISION')

  if (window.location.pathname === '/groups' || window.location.pathname === '/groups/') {
    return <Groups />
  }

  if (window.location.pathname === '/staff' || window.location.pathname === '/staff/') {
    return <Staff />
  }

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setHeroIndex((currentIndex) => (currentIndex + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(heroTimer)
  }, [])

  const activeCategory = categoryNames[categoryIndex]
  const visibleCards = categories[activeCategory]

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
        image={heroImageFour}
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
          {Object.keys(archiveEntries).map((tab) => <button className={archiveTab === tab ? 'active' : ''} role="tab" aria-selected={archiveTab === tab} key={tab} onClick={() => setArchiveTab(tab)}>{tab}</button>)}
        </div>
        <div className="archive-panel">
          <div className="archive-copy">
            <p className="archive-file">{archiveEntries[archiveTab].label}</p>
            <h3>{archiveEntries[archiveTab].title}</h3>
            <p>{archiveEntries[archiveTab].text}</p>
          </div>
          <div className="archive-image" style={{ backgroundImage: `url("${archiveEntries[archiveTab].image}")` }} role="img" aria-label={archiveTab} />
        </div>
      </section>


      <Footer />
    </main>
  )
}

export default App
