import { useState } from 'react'
import logo from './images/logo.png'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

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
            <p className="eyebrow"><big>What we do</big></p><h2>Built for what comes next.</h2>
          </div>
          <a className="add-button" href="#projects">View our work <span>→</span></a>
        </div>
        <div className="project-grid" id="projects">
          <article className="project-card"><span>01</span><h3>Financial Study</h3><p>HP Ventures, Inc. is a growing investment holding company focused on building a diverse and profitable portfolio through strategic investments, prudent risk management, and sustainable growth. Its businesses span outsourcing, IT, trading and manufacturing, and real estate, with its affiliates managed by Globalus Management Services. The company aims to become a leading and respected investment entity while contributing to society, nation-building, and environmental initiatives.</p></article>
          <article className="project-card"><span>02</span><h3>Corporate Trends</h3><p>HP Ventures, Inc. has various exposures in the local outsourcing services industry, with its 95% stake in an industry leading company, Infovision Research Systems, Inc. other investments in this field includes, Jobsvision Human Capital Resources Services, Link2Info Outsourcing Services and a growing IT firm, the InfoZ IT Works. It is now expanding its base to Trading & Manufacturing of key products initially within Cebu market through Infotrade Resources and High Power Traders. HP Ventures, Inc. also owned the Henzplace@Sea Residences- a condo leasing entity in Manila. All of the companies under the HP Ventures, Inc. is being managed by Globalus Management Services, a management firm tasked to oversee and ensure affiliates are aligned within the goals towards achieving a profitable operations. It also understands that as a growing investment company comes with its social responsibility, to nurture society and its people, participate in nation building activities and caring for the environment. HP Ventures, Inc. commits to actively participate in collective activities aligned on these endeavors.</p></article>
          <article className="project-card"><span>03</span><h3>Banks</h3><p>HP Ventures, Inc. has investments across outsourcing, IT, trading and manufacturing, and real estate. Its portfolio includes a 95% stake in Infovision Research Systems, Inc., as well as Jobsvision, Link2Info, InfoZ IT Works, Infotrade Resources, High Power Traders, and Henzplace@Sea Residences. Its affiliated companies are managed by Globalus Management Services to ensure profitable and aligned operations. Beyond business growth, HP Ventures is also committed to social responsibility, nation-building, and environmental initiatives.</p></article>
        </div>
      </section>

      <footer className="footer" id="contacts"><span>HP Ventures Holding Company</span><a href="mailto:hcp@hpobladorventures.com">hcp@hpobladorventures.com</a></footer>
    </main>
  )
}

export default App
