import { Fragment, useEffect, useRef, useState } from 'react'
import logo from './images/logo.png'
import Footer from './Footer.jsx'
import FloatingCertifications from './FloatingCertifications.jsx'
import { loadDepartments, loadEmployees } from './employeeData.js'

function Staff() {
	const staffDepartments = ['All', ...loadDepartments()]
	const selectorDepartments = [...staffDepartments, ...staffDepartments]

	const [menuOpen, setMenuOpen] = useState(false)
	const [selectedDepartment, setSelectedDepartment] = useState('All')
	const [employees, setEmployees] = useState([])
	const [selectorOffset, setSelectorOffset] = useState(0)
	const [selectorVisibleWidth, setSelectorVisibleWidth] = useState(0)
	const [selectorContentWidth, setSelectorContentWidth] = useState(0)
	const [headerScrolled, setHeaderScrolled] = useState(false)
	const selectorRef = useRef(null)
	const selectorTrackRef = useRef(null)

	useEffect(() => {
		window.scrollTo(0, 0)
		setSelectedDepartment('All')
		const refreshEmployees = async () => {
			const loadedEmployees = await loadEmployees()
			setEmployees(loadedEmployees)
			setSelectedDepartment('All')
		}
		refreshEmployees()
		window.addEventListener('employees-updated', refreshEmployees)

		const updateHeaderState = () => {
			const heroSection = document.querySelector('.staff-hero')
			if (!heroSection) return
			setHeaderScrolled(window.scrollY > heroSection.offsetTop + heroSection.offsetHeight - 90)
		}

		updateHeaderState()
		window.addEventListener('scroll', updateHeaderState, { passive: true })
		return () => {
			window.removeEventListener('employees-updated', refreshEmployees)
			window.removeEventListener('scroll', updateHeaderState)
		}
	}, [])

	useEffect(() => {
		if (!selectorRef.current) return
		const measure = () => {
			const visibleWidth = selectorRef.current.clientWidth
			setSelectorVisibleWidth(visibleWidth)
			setSelectorContentWidth(selectorTrackRef.current?.scrollWidth || 0)
			setSelectorOffset((currentOffset) => Math.min(currentOffset, Math.max(0, (selectorTrackRef.current?.scrollWidth || 0) - visibleWidth)))
		}
		measure()
		window.addEventListener('resize', measure)
		return () => window.removeEventListener('resize', measure)
	}, [])

	const maxSelectorOffset = Math.max(0, selectorContentWidth - selectorVisibleWidth)
	const centerDepartment = (button) => {
		if (!button || !selectorVisibleWidth) return
		const targetOffset = button.offsetLeft + (button.offsetWidth / 2) - (selectorVisibleWidth / 2)
		setSelectorOffset(Math.max(0, Math.min(targetOffset, maxSelectorOffset)))
		setSelectedDepartment(button.textContent)
	}

	const scrollDepartmentSelector = (direction) => {
		const buttons = Array.from(selectorTrackRef.current?.querySelectorAll('button') || [])
		setSelectorOffset((currentOffset) => {
			if (direction > 0) {
				const currentCenter = currentOffset + (selectorVisibleWidth / 2)
				const nextButton = buttons.find((button) => button.offsetLeft + (button.offsetWidth / 2) > currentCenter + 1)
				if (!nextButton) return 0
				const nextOffset = nextButton.offsetLeft + (nextButton.offsetWidth / 2) - (selectorVisibleWidth / 2)
				return Math.max(0, Math.min(nextOffset, maxSelectorOffset))
			}

			const currentCenter = currentOffset + (selectorVisibleWidth / 2)
			const previousButtons = buttons.filter((button) => button.offsetLeft + (button.offsetWidth / 2) < currentCenter - 1)
			const previousButton = previousButtons.at(-1)
			if (!previousButton) return maxSelectorOffset
			const previousOffset = previousButton.offsetLeft + (previousButton.offsetWidth / 2) - (selectorVisibleWidth / 2)
			return Math.max(0, Math.min(previousOffset, maxSelectorOffset))
		})
	}

	useEffect(() => {
		const buttons = Array.from(selectorTrackRef.current?.querySelectorAll('button') || [])
		if (!selectorVisibleWidth || !buttons.length) return

		if (selectedDepartment === 'All') {
			setSelectorOffset(0)
			return
		}

		const center = selectorOffset + (selectorVisibleWidth / 2)
		const centeredButton = buttons.reduce((closest, button) => {
			const distance = Math.abs(button.offsetLeft + (button.offsetWidth / 2) - center)
			return !closest || distance < closest.distance ? { button, distance } : closest
		}, null)
		if (centeredButton && centeredButton.button.textContent !== selectedDepartment) setSelectedDepartment(centeredButton.button.textContent)
	}, [selectorOffset, selectorVisibleWidth, selectedDepartment])

	const filteredEmployees = employees.filter((employee) => selectedDepartment === 'All' || employee.department === selectedDepartment)

	const employeeRows = Array.from({ length: Math.ceil(filteredEmployees.length / 5) }, (_, rowIndex) => {
		const rowEmployees = filteredEmployees.slice(rowIndex * 5, rowIndex * 5 + 5).map((employee, offset) => ({ employee, index: rowIndex * 5 + offset }))
		return rowEmployees
	})

	return (
		<main className="site-shell staff-page">
			<nav className={`topbar ${headerScrolled ? 'scrolled' : 'transparent'}`} aria-label="Primary navigation">
				<a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
				<button className="menu-toggle" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /> <span /> <span /></button>
				<div className={menuOpen ? 'nav-links open' : 'nav-links'}>
					{['About us', 'Groups', 'The Team', 'Careers'].map((item) => <a href={item === 'Groups' ? '/groups' : item === 'The Team' ? '/staff' : item === 'Careers' ? '/careers' : `/#${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => setMenuOpen(false)}>{item}</a>)}
				</div>
				<a className="phone-link" href="#"><span aria-hidden="true">☎</span> (032) 343-9651</a>
			</nav>
			<header className="staff-hero">
				<p className="eyebrow">Our people</p>
				<h1>People behind<br /><span>the progress.</span></h1>
				<p>Meet the people whose experience, care, and commitment move HP Ventures forward.</p>
			</header>
			<section className="staff-content">
				<div className="staff-section-heading">
				</div>
				<div className="category-selector-wrap">
					{staffDepartments.length > 5 && <button type="button" className="category-selector-arrow left" aria-label="Previous departments" onClick={() => scrollDepartmentSelector(-1)} disabled={selectorOffset === 0}>‹</button>}
					<div className="category-selector" ref={selectorRef} role="tablist" aria-label="Staff departments">
						<div className="category-selector-track" ref={selectorTrackRef} style={{ transform: `translateX(-${selectorOffset}px)` }}>
							{selectorDepartments.map((department, departmentIndex) => <button className={selectedDepartment === department ? 'active' : ''} role="tab" aria-selected={selectedDepartment === department} key={`${department}-${departmentIndex}`} onClick={(event) => centerDepartment(event.currentTarget)}>{department}</button>)}
						</div>
					</div>
					{staffDepartments.length > 5 && <button type="button" className="category-selector-arrow right" aria-label="Next departments" onClick={() => scrollDepartmentSelector(1)}>›</button>}
				</div>
				<div className="staff-layout">
					<div className="employee-grid">
						{employeeRows.map((row, rowIndex) => <div className="employee-row" key={rowIndex}>
							{row.map(({ employee, index }) => <Fragment key={`${employee.name}-${index}`}>
								<div className="employee-card" data-column={index % 5} data-mobile-column={index % 2} style={employee.image ? { backgroundImage: `url("${employee.image}")` } : undefined}>
									<div className="employee-card-info">
										<span className="employee-name">{employee.name}</span>
										<span className="employee-role">{employee.role}</span>
										<span className="employee-description">{employee.description}</span>
									</div>
								</div>
							</Fragment>)}
						</div>)}
					</div>
				</div>
			</section>
			<FloatingCertifications />
			<Footer />
		</main>
	)
}

export default Staff

