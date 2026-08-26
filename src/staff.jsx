import { useEffect, useState } from 'react'
import logo from './images/logo.png'
import Footer from './Footer.jsx'

const employees = [
	{ name: 'Name Test', role: 'Chairman', description: 'Guides the group with a long-term view of responsible growth, strong partnerships, and meaningful value creation.' },
	{ name: 'Name Test', role: 'President', description: 'Leads the company culture and day-to-day direction, keeping every business focused, agile, and people-first.' },
	{ name: 'Name Test', role: 'Chief Operating Officer', description: 'Connects teams and operations so that good ideas become dependable, measurable results.' },
	{ name: 'Name Test', role: 'Chief Financial Officer', description: 'Brings clarity and discipline to financial planning, risk management, and sustainable portfolio growth.' },
	{ name: 'Name Test', role: 'Business Development', description: 'Builds relationships and explores opportunities that strengthen the group and its business interests.' },
	{ name: 'Name Test', role: 'People & Culture', description: 'Creates an environment where people can do thoughtful work, grow their skills, and feel part of the mission.' },
	{ name: 'Name Test', role: 'Technology', description: 'Helps the group use practical technology to work smarter, stay connected, and prepare for what is next.' },
	{ name: 'Name Test', role: 'Corporate Affairs', description: 'Supports trusted relationships with stakeholders and helps the group show up with integrity.' },
	{ name: 'Name Test', role: 'Investments', description: 'Studies markets and opportunities with patience, care, and a clear eye for long-term potential.' },
	{ name: 'Name Test', role: 'Administration', description: 'Keeps the details moving smoothly and makes space for every team to do its best work.' },
]

function Staff() {

	const [menuOpen, setMenuOpen] = useState(false)
	const [selectedEmployee, setSelectedEmployee] = useState(null)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<main className="site-shell staff-page">
			<nav className="topbar" aria-label="Primary navigation">
				<a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
				<button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
				<div className={menuOpen ? 'nav-links open' : 'nav-links'}>
					{['About us', 'Groups', 'The Team', 'Projects', 'Contacts'].map((item) => <a href={item === 'Groups' ? '/groups' : item === 'The Team' ? '/staff' : `/#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}
				</div>
				<a className="phone-link" href="tel:(032) 343-9651"><span aria-hidden="true">☎</span> (032) 343-9651</a>
			</nav>
			<header className="staff-hero">
				<p className="eyebrow">Our people</p>
				<h1>People behind<br /><span>the progress.</span></h1>
				<p>Meet the people whose experience, care, and commitment move HP Ventures forward.</p>
			</header>
			<section className="staff-content">
				<div className="staff-section-heading">
					<div><p className="eyebrow">Staff</p><h2>A team with purpose.</h2></div>
					<p>Click a profile to learn more about the people shaping our work.</p>
				</div>
				<div className="staff-layout">
					<div className="employee-grid">
						{employees.map((employee, index) => <button className={`employee-card ${selectedEmployee?.name === employee.name ? 'selected' : ''}`} key={employee.name} onClick={() => setSelectedEmployee(employee)} aria-pressed={selectedEmployee?.name === employee.name}>
							<span className="employee-number">{String(index + 1).padStart(2, '0')}</span>
							<strong>{employee.name}</strong>
							<span>{employee.role}</span>
						</button>)}
					</div>
					<div className={`employee-detail ${selectedEmployee ? 'visible' : ''}`} aria-live="polite">
						{selectedEmployee ? <><p className="eyebrow">Profile {String(employees.indexOf(selectedEmployee) + 1).padStart(2, '0')}</p><h3>{selectedEmployee.name}</h3><p className="detail-role">{selectedEmployee.role}</p><p>{selectedEmployee.description}</p></> : <p className="detail-placeholder">Select a profile to view their story.</p>}
					</div>
				</div>
			</section>
			<Footer />
		</main>
	)
}

export default Staff

