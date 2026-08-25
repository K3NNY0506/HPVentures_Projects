import { useEffect, useState } from 'react'
import logo from './images/logo.png'

function Staff() {

	const [menuOpen, setMenuOpen] = useState(false)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<main className="site-shell staff-page">
			<nav className="topbar" aria-label="Primary navigation">
				<a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
				<button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
				<div className={menuOpen ? 'nav-links open' : 'nav-links'}>
					{['About us', 'Groups', 'Services', 'Projects', 'Contacts'].map((item) => <a href={item === 'Groups' ? '/groups' : `/#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}
				</div>
				<a className="phone-link" href="tel:(032) 343-9651"><span aria-hidden="true">☎</span> (032) 343-9651</a>
			</nav>
			<header className="staff-hero">
				<p className="eyebrow">Our people</p>
				<h1>People behind<br /><span>the progress.</span></h1>
				<p>Meet the people whose experience, care, and commitment move HP Ventures forward.</p>
			</header>
			<section className="staff-content"><p className="eyebrow">Staff</p><h2>A team with purpose.</h2></section>
			<footer className="footer"><span>HP Ventures Holding Company</span><a href="mailto:info@hpobladorventures.com">info@hpobladorventures.com</a></footer>
		</main>
	)
}

export default Staff

