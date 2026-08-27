import HPV_LOGO_WHITE from './images/company_events/HPV_LOGO_WHITE.png'

const footerColumns = [
  { title: 'Company', links: ['About us', 'Groups', 'Investors', 'Suppliers', 'Newsroom'] },
  { title: 'Business', links: ['Outsourcing', 'Information Technology', 'Trading & Manufacturing', 'Real Estate', 'Affiliates'] },
  { title: 'Responsibility', links: ['Community', 'Nation Building', 'Environment', 'Governance'] },
  { title: 'Careers', links: ['Join our team', 'Growth mindset', 'Opportunities'] },
]

function Footer() {
  return (
    <footer className="site-footer" id="contacts">
      <div className="footer-sky" />
      <div className="footer-content">
        <div className="footer-brand-column">
          <img className="brand-logo-footer" src={HPV_LOGO_WHITE} alt="HP Ventures" />
          <p>HP Ventures Holding Company</p>
          <a href="mailto:info@hpobladorventures.com">info@hpobladorventures.com</a>
          <small>© 2026 HP Ventures</small>
        </div>
        {footerColumns.map((column) => <div className="footer-column" key={column.title}><h3>{column.title}</h3>{column.links.map((link) => <a href={`#${link.toLowerCase().replaceAll(' ', '-')}`} key={link}>{link}</a>)}</div>)}
      </div>

<div className="ribbon-banner-separator" aria-hidden="true">
        <div className="ribbon-banner-track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="ribbon-banner-content">
              <span>✦ EXCELLENCE &amp; INTEGRITY</span>
              <span className="ribbon-accent">HP VENTURES GROUP</span>
              <span>✦ VALUE &amp; GROWTH</span>
              <span className="ribbon-accent">EST. 2014</span>
              <span>✦ INNOVATION &amp; TEAMWORK</span>
              <span className="ribbon-accent">BUILT ON TRUST</span>
            </div>
          ))}
        </div>
      </div>

    </footer>
  )
}

export default Footer
