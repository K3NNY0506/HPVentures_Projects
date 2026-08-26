import { Fragment, useEffect, useState } from 'react'
import logo from './images/logo.png'
import Footer from './Footer.jsx'
import employeeImageOne from './images/171-Enhanced-NR.jpg'
import employeeImageTwo from './images/187-Enhanced-NR.jpg'
import employeeImageThree from './images/268-Enhanced-NR.jpg'
import employeeImageFour from './images/280-Enhanced-NR.jpg'
import employeeImageFive from './images/491222308_1139710681502200_736987314008467945_n.jpg'
import employeeImageSix from './images/491339986_1139565998183335_2328618360663044858_n.jpg'
import employeeImageSeven from './images/492124794_1140941494712452_1302670891728671341_n.jpg'
import employeeImageEight from './images/8006541_DSC_0043.JPG'
import employeeImageNine from './images/8006541_DSC_0049_high.JPG'
import employeeImageTen from './images/dji_fly_20250901_114622_0014_1756701711042_photo.jpg'

const employeeImages = [employeeImageOne, employeeImageTwo, employeeImageThree, employeeImageFour, employeeImageFive, employeeImageSix, employeeImageSeven, employeeImageEight, employeeImageNine, employeeImageTen]

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

	const employeeRows = Array.from({ length: Math.ceil(employees.length / 5) }, (_, rowIndex) => {
		const rowEmployees = employees.slice(rowIndex * 5, rowIndex * 5 + 5).map((employee, offset) => ({ employee, index: rowIndex * 5 + offset }))
		const selectedInRow = rowEmployees.find(({ index }) => index === selectedEmployee)
		return selectedInRow ? [selectedInRow, ...rowEmployees.filter(({ index }) => index !== selectedEmployee)] : rowEmployees
	})

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
						{employeeRows.map((row, rowIndex) => <div className={`employee-row ${selectedEmployee !== null && Math.floor(selectedEmployee / 5) === rowIndex ? 'has-selection' : ''}`} key={rowIndex}>
							{row.map(({ employee, index }) => <Fragment key={`${employee.name}-${index}`}>
								<button className={`employee-card ${selectedEmployee === index ? 'selected' : ''}`} style={{ backgroundImage: `url("${employeeImages[index]}")` }} onClick={() => setSelectedEmployee(selectedEmployee === index ? null : index)} aria-pressed={selectedEmployee === index}>
									<span className="employee-number">{String(index + 1).padStart(2, '0')}</span>
									<strong>{employee.name}</strong>
									<span>{employee.role}</span>
								</button>
								{selectedEmployee === index && <div className="employee-detail visible" aria-live="polite">
								<p className="eyebrow">Profile {String(selectedEmployee + 1).padStart(2, '0')}</p>
								<h3>{employees[selectedEmployee].name}</h3>
								<p className="detail-role">{employees[selectedEmployee].role}</p>
								<p>{employees[selectedEmployee].description}</p>
								</div>}
							</Fragment>)}
						</div>)}
					</div>
				</div>
			</section>
			<Footer />
		</main>
	)
}

export default Staff

