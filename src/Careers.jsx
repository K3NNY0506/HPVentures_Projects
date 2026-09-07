import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import logo from './images/logo.png'
import Footer from './Footer.jsx'
import FloatingCertifications from './FloatingCertifications.jsx'
import careersHeroImage from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'

const valueItems = [
  {
    number: '01',
    title: 'Build from the start',
    description:
      'Join a dynamic team where you can roll up your sleeves and create something meaningful with real ownership and impact.',
  },
  {
    number: '02',
    title: 'Learn and grow',
    description:
      'Get hands-on experience paired with expert mentorship that develops your skills and accelerates your career in ways that matter.',
  },
  {
    number: '03',
    title: 'Work that matters',
    description:
      'Lead strategic initiatives and high-impact projects that shape business outcomes and drive real change for clients and communities.',
  },
  {
    number: '04',
    title: 'Life and work balance',
    description:
      'We respect your time and priorities, offering flexibility that lets you deliver great work without sacrificing what matters most.',
  },
]

function Careers() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [scrollStep, setScrollStep] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)

    const updateHeaderState = () => {
      const heroSection = document.querySelector('.careers-hero')

      if (!heroSection) return

      setHeaderScrolled(
        window.scrollY >
          heroSection.offsetTop +
            heroSection.offsetHeight -
            90
      )
    }

    updateHeaderState()

    window.addEventListener('scroll', updateHeaderState, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', updateHeaderState)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector(
        '.careers-scroll-section'
      )

      if (!section) return

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      let step = 0

      /*
       * Intro text begins before the sticky section
       */
      if (rect.top < viewportHeight * 0.72) {
        step = 1
      }

      if (rect.top < viewportHeight * 0.50) {
        step = 2
      }

      /*
       * Sticky section card progression
       */
      const totalHeight =
        section.offsetHeight - viewportHeight

      if (totalHeight > 0) {
        let progress = -rect.top / totalHeight

        progress = Math.max(
          0,
          Math.min(1, progress)
        )

        if (rect.top < 0) {
          if (progress > 0.10) step = 3
          if (progress > 0.32) step = 4
          if (progress > 0.54) step = 5
          if (progress > 0.76) step = 6
        }
      }

      setScrollStep(step)
    }

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <main className="site-shell careers-page">

      {/* =====================================================
          NAV
      ===================================================== */}

      <nav
        className={`topbar ${
          headerScrolled ? 'scrolled' : 'transparent'
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
          onClick={() => setMenuOpen(!menuOpen)}
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
              onClick={() => setMenuOpen(false)}
            >
              {navItem}
            </a>
          ))}
        </div>

        <a
          className="phone-link"
          href="tel:+63323439651"
        >
          <span aria-hidden="true">☎</span>{' '}
          (032) 343-9651
        </a>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <header
        className="careers-hero careers-hero-new"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              rgba(6,35,55,0.96) 0%,
              rgba(6,35,55,0.72) 48%,
              rgba(6,35,55,0.18) 100%
            ),
            url("${careersHeroImage}")
          `,
        }}
      >

        <motion.div
          className="careers-hero-number"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 0.22, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.1,
          }}
        >
          05
        </motion.div>

        <motion.div
          className="careers-hero-meta"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
          }}
        >
          <span>CAREERS</span>
          <span>HP VENTURES</span>
        </motion.div>

        <div className="careers-hero-content">

          <motion.h1
            initial={{
              opacity: 0,
              y: 90,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Build your
            <br />
            <span>career.</span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            We’re looking for curious, driven people
            ready to contribute, grow, and help shape
            what comes next.
          </motion.p>

        </div>

        <motion.div
          className="careers-hero-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.9,
          }}
        >
          <span>PEOPLE / POSSIBILITY / PROGRESS</span>

          <div className="careers-hero-scroll">
            <span>SCROLL TO EXPLORE</span>

            <motion.span
              animate={{
                y: [0, 7, 0],
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ↓
            </motion.span>
          </div>
        </motion.div>

      </header>

      {/* =====================================================
          STICKY VALUE SECTION
      ===================================================== */}

      <section className="careers-scroll-section">

        <div className="careers-content careers-sticky-content">

          <div className="careers-value-top">

            <motion.div
              className="careers-value-index"
              animate={{
                opacity: scrollStep >= 1 ? 1 : 0,
                y: scrollStep >= 1 ? 0 : 25,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              01
            </motion.div>

            <motion.p
              className="eyebrow"
              animate={{
                opacity: scrollStep >= 1 ? 1 : 0,
                x: scrollStep >= 1 ? 0 : -30,
              }}
              transition={{
                duration: 0.6,
              }}
            >
              GROWING TALENT
            </motion.p>

          </div>

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
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Growing talent,
              </motion.span>

              <br />

              <motion.span
                className="careers-accent"
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
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                shaping futures.
              </motion.span>

            </h2>

            <motion.p
              className="careers-value-subtitle"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity:
                  scrollStep >= 2 ? 1 : 0.35,
                y:
                  scrollStep >= 2
                    ? 0
                    : 25,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              A place where ambition gets room to grow.
            </motion.p>

          </div>

          {/* =================================================
              VALUE CARDS
          ================================================= */}

          <div className="careers-value-grid">

            {valueItems.map((value, index) => {

              const cardStep = index + 3
              const visible =
                scrollStep >= cardStep

              const directions = [
                -80,
                80,
                -80,
                80,
              ]

              return (
                <motion.article
                  className="career-value-item"
                  key={value.title}
                  initial={{
                    opacity: 0,
                    x: directions[index],
                    y: 30,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: visible ? 1 : 0,
                    x: visible ? 0 : directions[index],
                    y: visible ? 0 : 30,
                    scale: visible ? 1 : 0.96,
                  }}
                  transition={{
                    duration: 0.75,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >

                  <div className="career-value-number">
                    {value.number}
                  </div>

                  <div className="career-value-content">

                    <h3>
                      {value.title}
                    </h3>

                    <p>
                      {value.description}
                    </p>

                  </div>

                  <motion.div
                    className="career-value-arrow"
                    whileHover={{
                      x: 6,
                    }}
                  >
                    ↗
                  </motion.div>

                </motion.article>
              )
            })}

          </div>

        </div>

      </section>

      {/* =====================================================
          WHERE YOU CAN THRIVE
      ===================================================== */}

      <section className="careers-showcase-section">

        <div className="careers-showcase-bg">
          THRIVE
        </div>

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
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <div className="careers-section-marker">
              <span>02</span>
              <span>WHERE YOU CAN THRIVE</span>
            </div>

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
              <span>Can Thrive.</span>
            </h2>

            <p>
              We're building a venture company
              that brings together ambitious,
              curious people to solve meaningful
              problems and create lasting impact.
            </p>

            <p>
              You'll work alongside sharp
              collaborators on projects that
              matter, while growing your skills
              and staying connected to what
              matters outside of work.
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
              ease: [0.22, 1, 0.36, 1],
            }}
          >

            <div className="careers-portrait">

              <div className="careers-image-overlay">
                <span>HP VENTURES</span>
                <span>PEOPLE FIRST</span>
              </div>

            </div>

          </motion.div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="careers-final-cta">

        <motion.div
          className="careers-final-number"
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 0.08,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 1,
          }}
        >
          03
        </motion.div>

        <div className="careers-final-content">

          <motion.p
            className="eyebrow"
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            YOUR NEXT MOVE
          </motion.p>

          <motion.h2
            initial={{
              opacity: 0,
              y: 70,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Do work that
            <br />
            <span>moves people forward.</span>
          </motion.h2>

          <motion.a
            href="mailto:careers@hpventures.com"
            className="careers-cta-button"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            whileHover={{
              x: 8,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
          >
            <span>EXPLORE OPPORTUNITIES</span>
            <span>↗</span>
          </motion.a>

        </div>

      </section>

      <FloatingCertifications />

      <Footer />

    </main>
  )
}

export default Careers