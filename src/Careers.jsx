import { useEffect, useRef, useState } from 'react'
import logo from './images/logo.png'
import Footer from './Footer.jsx'
import careersHeroImage from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'

function Careers() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    const updateHeaderState = () => {
      const heroSection = document.querySelector('.careers-hero')
      if (!heroSection) return
      setHeaderScrolled(window.scrollY > heroSection.offsetTop + heroSection.offsetHeight - 90)
    }

    const contentObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setContentVisible(true)
      },
      { threshold: 0.2 }
    )

    if (contentRef.current) {
      contentObserver.observe(contentRef.current)
    }

    updateHeaderState()
    window.addEventListener('scroll', updateHeaderState, { passive: true })

    return () => {
      contentObserver.disconnect()
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [])

  return (
    <main className="site-shell careers-page">
      <nav className={`topbar ${headerScrolled ? 'scrolled' : 'transparent'}`} aria-label="Primary navigation">
        <a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
        <button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
        <div className={menuOpen ? 'nav-links open' : 'nav-links'}>
          {['About us', 'Groups', 'The Team', 'Careers'].map((item) => <a href={item === 'About us' ? '/#about-us' : item === 'Groups' ? '/groups' : item === 'The Team' ? '/staff' : '/careers'} key={item} onClick={() => setMenuOpen(false)}>{item}</a>) }
        </div>
        <a className="phone-link" href="#"><span aria-hidden="true">☎</span> (032) 343-9651</a>
      </nav>

      <header className="careers-hero" style={{ backgroundImage: `linear-gradient(90deg, #062337dd 0%, #06233799 52%, #06233744), url("${careersHeroImage}")` }}>
        <p className="eyebrow"></p>
        <h1>Build your<br /><span>career.</span></h1>
        <p>We’re looking for people who are curious, driven, and ready to contribute to a growing organization shaped by strong values.</p>
      </header>

      <section ref={contentRef} className={`careers-content ${contentVisible ? 'is-visible' : ''}`}>
        <div className="careers-value-hero">
          <h2>Growing talent,<br />shaping futures</h2>
        </div>

        <div className="careers-value-grid">
          <div className="career-value-item">
            <h3>Entrepreneurial culture</h3>
            <p>Work in a fast-moving environment where you can help build something meaningful from the ground up.</p>
          </div>

          <div className="career-value-item">
            <h3>Practical learning and coaching</h3>
            <p>Develop your skills through structured mentorship, peer guidance, and tailored growth opportunities.</p>
          </div>

          <div className="career-value-item">
            <h3>Engaging, high-impact work</h3>
            <p>Take part in strategic conversations and meaningful projects that influence major business decisions.</p>
          </div>

          <div className="career-value-item">
            <h3>Healthy work-life rhythm</h3>
            <p>Enjoy a flexible, respectful approach that helps you stay connected to your life outside work.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Careers
