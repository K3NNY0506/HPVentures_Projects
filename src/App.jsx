import { useState } from 'react'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="Great House home"><span className="brand-mark" aria-hidden="true">▰</span><span><strong><big>HP VENTURES</big></strong><medium>HOLDING COMPANY</medium></span></a>
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
            <p className="eyebrow"><big>What we do</big></p><h2>Built for what comes next.</h2>
          </div>
          <a className="add-button" href="#projects">View our work <span>→</span></a>
        </div>
        <div className="project-grid" id="projects">
          <article className="project-card"><span>01</span><h3>Construction</h3><p>From concept to completion, we make complex builds feel simple.</p></article>
          <article className="project-card"><span>02</span><h3>Infrastructure</h3><p>Smart, durable systems designed around the people who use them.</p></article>
          <article className="project-card"><span>03</span><h3>Consulting</h3><p>Clear thinking and technical expertise at every stage.</p></article>
        </div>
      </section>

      <footer className="footer" id="contacts"><span>HP Ventures Holding Company</span><a href="mailto:hcp@hpobladorventures.com">hcp@hpobladorventures.com</a></footer>
    </main>
  )
}

export default App
