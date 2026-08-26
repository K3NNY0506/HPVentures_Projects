import { Fragment, useEffect, useState } from 'react'
import logo from './images/logo.png'
import Footer from './Footer.jsx'
import { departments, loadEmployees } from './employeeData.js'

const staffDepartments = ['ALL DEPARTMENTS', ...departments]


function Staff() {

	const [menuOpen, setMenuOpen] = useState(false)
	const [selectedEmployee, setSelectedEmployee] = useState(null)
	const [selectedDepartment, setSelectedDepartment] = useState('ALL DEPARTMENTS')
	const [employees, setEmployees] = useState([])

	useEffect(() => {
		window.scrollTo(0, 0)
		const refreshEmployees = async () => setEmployees(await loadEmployees())
		refreshEmployees()
		window.addEventListener('employees-updated', refreshEmployees)
		return () => window.removeEventListener('employees-updated', refreshEmployees)
	}, [])

	const filteredEmployees = employees.filter((employee) => selectedDepartment === 'ALL DEPARTMENTS' || employee.department === selectedDepartment)

	const employeeRows = Array.from({ length: Math.ceil(filteredEmployees.length / 5) }, (_, rowIndex) => {
		const rowEmployees = filteredEmployees.slice(rowIndex * 5, rowIndex * 5 + 5).map((employee, offset) => ({ employee, index: rowIndex * 5 + offset }))
		return rowEmployees
	})

	return (
		<main className="site-shell staff-page">
			<nav className="topbar" aria-label="Primary navigation">
				<a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
				<button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
				<div className={menuOpen ? 'nav-links open' : 'nav-links'}>
					{['About us', 'Groups', 'The Team', 'Contacts'].map((item) => <a href={item === 'Groups' ? '/groups' : item === 'The Team' ? '/staff' : `/#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}
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
					<div><p className="eyebrow">Our Staff</p><h2>A Team With purpose.</h2></div>
				</div>
				<div className="category-selector" role="tablist" aria-label="Staff departments">
					{staffDepartments.map((department) => <button className={selectedDepartment === department ? 'active' : ''} role="tab" aria-selected={selectedDepartment === department} key={department} onClick={() => { setSelectedDepartment(department); setSelectedEmployee(null) }}>{department}</button>)}
				</div>
				<div className="staff-layout">
					<div className="employee-grid">
						{employeeRows.map((row, rowIndex) => <div className={`employee-row ${selectedEmployee !== null && Math.floor(selectedEmployee / 5) === rowIndex ? 'has-selection' : ''}`} key={rowIndex}>
							{row.map(({ employee, index }) => <Fragment key={`${employee.name}-${index}`}>
								<button className={`employee-card ${selectedEmployee === index ? 'selected' : ''}`} data-column={index % 5} data-mobile-column={index % 2} style={employee.image ? { backgroundImage: `url("${employee.image}")` } : undefined} onClick={() => setSelectedEmployee(selectedEmployee === index ? null : index)} aria-pressed={selectedEmployee === index}>
									<span className="employee-number">{String(index + 1).padStart(2, '0')}</span>
									<strong>{employee.name}</strong>
									<span>{employee.role}</span>
								</button>
								{selectedEmployee === index && <div className="employee-detail visible" data-column={index % 5} aria-live="polite">
								<p className="eyebrow">Profile {String(selectedEmployee + 1).padStart(2, '0')}</p>
								<h3>{employee.name}</h3>
								<p className="detail-role">{employee.role}</p>
								<p>{employee.description}</p>
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

