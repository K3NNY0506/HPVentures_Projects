import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import logo from './images/logo.png'
import Footer from './Footer.jsx'
import FloatingCertifications from './FloatingCertifications.jsx'
import careersHeroImage from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'

const valueItems = [
  {
    title: 'Build from the start',
    description:
      'Join a dynamic team where you can roll up your sleeves and create something meaningful with real ownership and impact.',
  },
  {
    title: 'Learn and grow',
    description:
      'Get hands-on experience paired with expert mentorship that develops your skills and accelerates your career in ways that matter.',
  },
  {
    title: 'Work that matters',
    description:
      'Lead strategic initiatives and high-impact projects that shape business outcomes and drive real change for clients and communities.',
  },
  {
    title: 'Life and work balance',
    description:
      'We respect your time and priorities, offering flexibility that lets you deliver great work without sacrificing what matters most.',
  },
]

function Careers() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [scrollStep, setScrollStep] = useState(0)

  /*
   * 0 = nothing
   * 1 = Growing talent
   * 2 = Shaping futures
   * 3 = Card 1
   * 4 = Card 2
   * 5 = Card 3
   * 6 = Card 4
   */

  useEffect(() => {
    window.scrollTo(0, 0)

    const updateHeaderState = () => {
      const heroSection =
        document.querySelector('.careers-hero')

      if (!heroSection) return

      setHeaderScrolled(
        window.scrollY >
          heroSection.offsetTop +
            heroSection.offsetHeight -
            90
      )
    }

    updateHeaderState()

    window.addEventListener(
      'scroll',
      updateHeaderState,
      { passive: true }
    )

    return () => {
      window.removeEventListener(
        'scroll',
        updateHeaderState
      )
    }
  }, [])

  /*
   * ==========================================
   * STICKY SCROLL SEQUENCE
   * ==========================================
   */

useEffect(() => {
  const handleScroll = () => {
    const section = document.querySelector(
      '.careers-scroll-section'
    )

    if (!section) return

    const rect = section.getBoundingClientRect()

    /*
     * Start the animation BEFORE the white section
     * reaches the top of the screen.
     *
     * rect.top tells us how far the section is
     * from the top of the viewport.
     */

    let step = 0

    // Growing talent
    if (rect.top < window.innerHeight * 0.65) {
      step = 1
    }

    // Shaping futures
    if (rect.top < window.innerHeight * 0.45) {
      step = 2
    }

    // Card 1
    if (rect.top < window.innerHeight * 0.25) {
      step = 3
    }

    // Card 2
    if (rect.top < 0) {
      step = 4
    }

    // After entering the sticky section,
    // continue using scroll progress
    const totalHeight =
      section.offsetHeight - window.innerHeight

    if (totalHeight > 0) {
      let progress = -rect.top / totalHeight

      progress = Math.max(
        0,
        Math.min(1, progress)
      )

      if (rect.top < 0) {
        if (progress > 0.20) step = 5
        if (progress > 0.40) step = 6
      }
    }

    setScrollStep(step)
  }

  window.addEventListener(
    'scroll',
    handleScroll,
    { passive: true }
  )

  handleScroll()

  return () => {
    window.removeEventListener(
      'scroll',
      handleScroll
    )
  }
}, [])

  return (
    <main className="site-shell careers-page">

      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <nav
        className={`topbar ${
          headerScrolled
            ? 'scrolled'
            : 'transparent'
        }`}
        aria-label="Primary navigation"
      >
        <a
          className="brand"
          href="/"
          aria-label="HP Ventures home"
        >
          <img
            className="brand-logo"
            src={logo}
            alt="HP Ventures"
          />
        </a>

        <button
          className="menu-toggle"
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={
            menuOpen
              ? 'nav-links open'
              : 'nav-links'
          }
        >
          {[
            'About us',
            'Groups',
            'The Team',
            'Careers',
          ].map((navItem) => (
            <a
              href={
                navItem === 'About us'
                  ? '/#about-us'
                  : navItem === 'Groups'
                  ? '/groups'
                  : navItem === 'The Team'
                  ? '/staff'
                  : '/careers'
              }
              key={navItem}
              onClick={() =>
                setMenuOpen(false)
              }
            >
              {navItem}
            </a>
          ))}
        </div>

        <a
          className="phone-link"
          href="#"
        >
          <span aria-hidden="true">
            ☎
          </span>{' '}
          (032) 343-9651
        </a>
      </nav>

      {/* ==========================================
          HERO
      ========================================== */}

      <header
        className="careers-hero"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              #062337dd 0%,
              #06233799 52%,
              #06233744
            ),
            url("${careersHeroImage}")
          `,
        }}
      >
        <p className="eyebrow"></p>

        <h1>
          Build your
          <br />
          <span>career.</span>
        </h1>

        <p>
          We’re looking for people who are curious,
          driven, and ready to contribute to a growing
          organization shaped by strong values.
        </p>
      </header>

      {/* ==========================================
          STICKY SCROLL SECTION
      ========================================== */}

      <section className="careers-scroll-section">

        <div
          className="careers-content careers-sticky-content"
        >

          {/* ========================================
              GROWING TALENT
          ======================================== */}

          <div className="careers-value-hero">

            <h2>

              <motion.span
                initial={{
                  opacity: 0,
                  x: -80,
                }}
                animate={{
                  opacity:
                    scrollStep >= 1 ? 1 : 0,
                  x:
                    scrollStep >= 1
                      ? 0
                      : -80,
                }}
                transition={{
                  duration: 0.8,
                  ease: [
                    0.25,
                    0.1,
                    0.25,
                    1,
                  ],
                }}
              >
                Growing talent,
              </motion.span>

              <br />

              <motion.span
                initial={{
                  opacity: 0,
                  x: 80,
                }}
                animate={{
                  opacity:
                    scrollStep >= 2 ? 1 : 0,
                  x:
                    scrollStep >= 2
                      ? 0
                      : 80,
                }}
                transition={{
                  duration: 0.8,
                  ease: [
                    0.25,
                    0.1,
                    0.25,
                    1,
                  ],
                }}
              >
                shaping futures
              </motion.span>

            </h2>

          </div>

          {/* ========================================
              HORIZONTAL CARDS
          ======================================== */}

          <div className="careers-value-grid">

            {valueItems.map(
              (value, index) => {

                const cardStep =
                  index + 3

                const visible =
                  scrollStep >= cardStep

                return (
                  <motion.div
                    className="career-value-item"
                    key={value.title}

                    initial={{
                      opacity: 0,
                      x: -100,
                    }}

                    animate={{
                      opacity:
                        visible ? 1 : 0,

                      x:
                        visible
                          ? 0
                          : -100,
                    }}

                    transition={{
                      duration: 0.8,
                      ease: [
                        0.25,
                        0.1,
                        0.25,
                        1,
                      ],
                    }}
                  >
                    <h3>
                      {value.title}
                    </h3>

                    <p>
                      {value.description}
                    </p>
                  </motion.div>
                )
              }
            )}

          </div>

        </div>

      </section>

      {/* ==========================================
          WHERE YOU CAN THRIVE
      ========================================== */}

      <section className="careers-showcase-section">

        <div className="careers-showcase">

          <motion.div
            className="careers-copy-block"

            initial={{
              opacity: 0,
              x: -100,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: false,
              amount: 0.25,
            }}

            transition={{
              duration: 1,
              ease: [
                0.25,
                0.1,
                0.25,
                1,
              ],
            }}
          >

            <div
              className="careers-mini-mark"
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
              <span />
            </div>

            <h2>
              Where You
              <br />
              Can Thrive
            </h2>

            <p>
              We're building a venture company
              that brings together ambitious,
              curious people to solve meaningful
              problems and create lasting impact.
              You'll work alongside sharp
              collaborators on projects that
              matter, while growing your skills
              and staying connected to what's
              important.
            </p>

          </motion.div>

          <motion.div
            className="careers-image-panel"

            initial={{
              opacity: 0,
              x: 100,
            }}

            whileInView={{
              opacity: 1,
              x: 0,
            }}

            viewport={{
              once: false,
              amount: 0.25,
            }}

            transition={{
              duration: 1,
              delay: 0.15,
              ease: [
                0.25,
                0.1,
                0.25,
                1,
              ],
            }}
          >
            <div className="careers-portrait" />
          </motion.div>

        </div>

      </section>

      <FloatingCertifications />

      <Footer />

    </main>
  )
}

export default Careers

