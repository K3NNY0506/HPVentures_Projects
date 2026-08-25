import { useState } from 'react'
import logo from './images/logo.png'

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

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoryIndex, setCategoryIndex] = useState(0)
  const [categoryDirection, setCategoryDirection] = useState('next')

  const activeCategory = categoryNames[categoryIndex]
  const visibleCards = categories[activeCategory]

  const moveCategory = (direction) => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setCategoryDirection(direction > 0 ? 'next' : 'previous')
    setCategoryIndex((currentIndex) => (currentIndex + direction + categoryNames.length) % categoryNames.length)
  }

  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
        <button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
        <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {['About us', 'Sectors', 'Services', 'Projects', 'Contacts'].map((item) => <a href={`#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}
        </div>
        <a className="phone-link" href="tel:(032) 343-9651 "><span aria-hidden="true">☎</span> (032) 343-9651 </a>
      </nav>

      <section className="hero-section" id="about-us">
        <div className="hero-copy">
          <h1>Emancipating of<br />Quality and Quantifiable Investments<span>.</span></h1>
          <div className="hero-actions">
            <a className="primary-action" href="#contacts">Request a quote</a><a className="secondary-action" href="#services">Learn more</a>
          </div>
        </div>
      </section>

      <section className="workspace-section" id="services">
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
        <div className={`project-grid category-slide ${categoryDirection}`} id="projects" key={categoryIndex}>
          {visibleCards.map((card, index) => <article className="project-card" key={card.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{card.title}</h3><p>{card.text}</p></article>)}
        </div>
        
      </section>


      <footer className="footer" id="contacts"><span>HP Ventures Holding Company</span><a href="mailto:hcp@hpobladorventures.com">info@hpobladorventures.com</a></footer>
    </main>
  )
}

export default App
