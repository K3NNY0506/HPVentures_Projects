
import HPV_LOGO_WHITE from './images/logo.png'
function Footer() {
  return (
    <footer className="site-footer" id="contacts">

      {/* Main CTA */}
      <div className="footer-hero">

        <div className="footer-section-number">
          05
        </div>

        <div className="footer-hero-content">
          <span className="footer-eyebrow">
            KEEP IN TOUCH
          </span>

          <h2>
            LET'S BUILD
            <br />
            WHAT'S NEXT<span>.</span>
          </h2>

          <a href="mailto:info@hpventures.com" className="footer-cta">
            <span>START A CONVERSATION</span>
            <span className="footer-cta-arrow">↗</span>
          </a>
        </div>

        <div className="footer-bg-word" aria-hidden="true">
          VENTURES
        </div>

      </div>


      {/* Navigation / Information */}
      <div className="footer-content">

        <div className="footer-brand-column">

          <img
            className="brand-logo-footer"
            src={HPV_LOGO_WHITE}
            alt="HP Ventures"
          />

          <p className="footer-tagline">
            Investing in ideas.
            <br />
            Building what's next.
          </p>

          <p className="footer-address">
            HPV Corporate Center,
            <br />
            A.S. Fortuna St. Bakilid,
            <br />
            Mandaue City
          </p>

          <a
            href="mailto:info@hpventures.com"
            className="footer-email"
          >
            info@hpventures.com
          </a>

        </div>


        <div className="footer-column">
          <span className="footer-column-number">01</span>
          <h3>Explore</h3>

          <a href="#about-us">About Us</a>
          <a href="#groups">Groups</a>
          <a href="#team">The Team</a>
          <a href="#careers">Careers</a>
        </div>


        <div className="footer-column">
          <span className="footer-column-number">02</span>
          <h3>Business</h3>

          <a href="#business">Outsourcing</a>
          <a href="#business">Information Technology</a>
          <a href="#business">Trading & Manufacturing</a>
          <a href="#business">Real Estate</a>
        </div>


        <div className="footer-column">
          <span className="footer-column-number">03</span>
          <h3>Connect</h3>

          <a href="#contacts">Contact Us</a>
          <a href="#careers">Join Our Team</a>

        </div>


        <div className="footer-column footer-back-top-column">
          <button
            className="footer-back-top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <span>BACK TO TOP</span>
            <span className="footer-top-arrow">↑</span>
          </button>
        </div>

      </div>


      {/* Bottom bar */}
      <div className="footer-bottom">

        <span>
          © 2026 HP Ventures
        </span>

        <span>
          EST. 2014
        </span>

        <span>
          BUILT ON TRUST
        </span>

      </div>


      {/* Existing moving ribbon */}
      <div className="ribbon-banner-separator" aria-hidden="true">
        <div className="ribbon-banner-track">

          {[...Array(6)].map((_, i) => (
            <div key={i} className="ribbon-banner-content">

              <span>✦ EXCELLENCE &amp; INTEGRITY</span>

              <span className="ribbon-accent">
                HP VENTURES GROUP
              </span>

              <span>✦ VALUE &amp; GROWTH</span>

              <span className="ribbon-accent">
                EST. 2014
              </span>

              <span>✦ INNOVATION &amp; TEAMWORK</span>

              <span className="ribbon-accent">
                BUILT ON TRUST
              </span>

            </div>
          ))}

        </div>
      </div>

    </footer>
  )
}

export default Footer