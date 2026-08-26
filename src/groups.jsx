import { useEffect, useState } from 'react'
import logo from './images/logo.png'
import Footer from './Footer.jsx'
import groupsHeroImage from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'
import infovisionLogo from './images/logos/infovision.png'
import Link2InfoLogo from './images/logos/link2info.png'
import InfozLogo from './images/logos/infoz.png'
import infotrade from './images/logos/infotrade.png'	
import henzplace from './images/logos/henzplace.png'

const groupItems = [
	{ number: '01', name: 'Infovision Research Systems', logo: infovisionLogo, url: 'https://www.infovisionresearch.com/home/', category: 'OUTSOURCING SERVICES', description: 'A leading provider of research and business process solutions built around dependable service.' },
	{ number: '02', name: 'Jobsvision Human Capital', category: 'HR', description: 'Connecting organizations with the people and capabilities they need to grow.' },
	{ number: '03', name: 'Link2Info Outsourcing', logo: Link2InfoLogo, url: 'https://link2info-outsourcing.com/', category: 'OUTSOURCING SERVICES', description: 'Practical outsourcing support that helps businesses work smarter and serve better.' },
	{ number: '04', name: 'InfoZ IT Works', logo: InfozLogo, url: 'https://www.infozitworks.com/', category: 'IT', description: 'Technology solutions that help modern businesses become more connected and capable.' },
	{ number: '05', name: 'Infotrade Resources', logo: infotrade, url: 'https://www.facebook.com/infotraderesources/', category: 'TRADING & MANUFACTURING', description: 'Building a growing presence in trade through products, partnerships, and local insight.' },
	{ number: '06', name: 'Henzplace@Sea Residences', logo: henzplace, url: 'https://www.facebook.com/HenzplaceSeaResidences/', category: 'REAL ESTATE', description: 'A property and leasing business focused on useful, well-managed spaces.' },
]

function Groups() {
	const [menuOpen, setMenuOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState('ALL GROUPS')
	const categories = ['ALL GROUPS', ...new Set(groupItems.map((group) => group.category))]
	const visibleGroups = selectedCategory === 'ALL GROUPS' ? groupItems : groupItems.filter((group) => group.category === selectedCategory)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<main className="site-shell groups-page">
			<nav className="topbar" aria-label="Primary navigation">
				<a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
				<button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
				<div className={menuOpen ? 'nav-links open' : 'nav-links'}>
					{['About us', 'Groups', 'The Team', 'Contacts'].map((item) => <a href={item === 'About us' ? '/#about-us' : item === 'Groups' ? '/groups' : item === 'The Team' ? '/staff' : `#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>) }
				</div>
				<a className="phone-link" href="tel:(032) 343-9651"><span aria-hidden="true">☎</span> (032) 343-9651</a>
			</nav>

			<header className="groups-hero" style={{ backgroundImage: `linear-gradient(90deg, #062337dd 0%, #06233799 52%, #06233744), url("${groupsHeroImage}")` }}>
				<p className="eyebrow">Our portfolio</p>
				<h1>The HP <span>Groups.</span></h1>
				<p>Businesses working together with a shared commitment to value, excellence, and sustainable growth.</p>
			</header>

			<section className="groups-list" aria-labelledby="groups-heading">
				<div className="groups-heading"><p className="eyebrow">Our affiliates</p><h2 id="groups-heading">Built around possibility.</h2></div>
				<div className="group-category-selector" role="tablist" aria-label="Group categories">
					{categories.map((category) => <button className={selectedCategory === category ? 'active' : ''} role="tab" aria-selected={selectedCategory === category} key={category} onClick={() => setSelectedCategory(category)}>{category}</button>)}
				</div>
				<div className="groups-grid">
					{visibleGroups.map((group) => <article className="group-item" key={group.number}><span className="group-number">{group.number}</span><div><p className="group-type">{group.category}</p><h3 className="group-name"><a className="group-link" href={group.url} target="_blank" rel="noreferrer">{group.name}</a></h3><p className="group-description">{group.description}</p></div>{group.logo && <img className="group-logo" src={group.logo} alt={`${group.name} logo`} />}<a className="group-arrow" href={group.url} target="_blank" rel="noreferrer" aria-label={`Visit ${group.name}`}>↗</a></article>)}
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default Groups
