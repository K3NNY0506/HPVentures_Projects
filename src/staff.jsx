import {
	 Fragment,
	 useEffect,
	 useRef,
	 useState,
} from 'react'

import {
	 motion,
	 AnimatePresence,
} from 'framer-motion'

import logo from './images/logo.png'
import Footer from './Footer.jsx'
import FloatingCertifications from './FloatingCertifications.jsx'
import staffHeroImage from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'
import {
	 loadDepartments,
	 loadEmployees,
} from './employeeData.js'

const ease = [0.22, 1, 0.36, 1]

const heroNumber = {
    hidden: {
        opacity: 0,
        y: 20
    },
    visible: {
        opacity: 0.12,
        y: 0
    }
};

const fadeUp = {
	 hidden: {
		 opacity: 0,
		 y: 40,
	 },
	 visible: {
		 opacity: 1,
		 y: 0,
		 transition: {
			 duration: 0.8,
			 ease,
		 },
	 },
	}

const fadeLeft = {
	 hidden: {
		 opacity: 0,
		 x: -50,
	 },
	 visible: {
		 opacity: 1,
		 x: 0,
		 transition: {
			 duration: 0.8,
			 ease,
		 },
	 },
}

const fadeRight = {
	 hidden: {
		 opacity: 0,
		 x: 50,
	 },
	 visible: {
		 opacity: 1,
		 x: 0,
		 transition: {
			 duration: 0.8,
			 ease,
		 },
	 },
}

const heroStagger = {
	 hidden: {},
	 visible: {
		 transition: {
			 staggerChildren: 0.12,
		 },
	 },
}

function Staff() {
	 const staffDepartments = [
		 'All',
		 ...loadDepartments(),
	 ]

	 const selectorDepartments = [
		 ...staffDepartments,
		 ...staffDepartments,
	 ]

	 const [menuOpen, setMenuOpen] =
		 useState(false)

	 const [selectedDepartment, setSelectedDepartment] =
		 useState('All')

	 const [employees, setEmployees] =
		 useState([])

	 const [selectorOffset, setSelectorOffset] =
		 useState(0)

	 const [selectorVisibleWidth, setSelectorVisibleWidth] =
		 useState(0)

	 const [selectorContentWidth, setSelectorContentWidth] =
		 useState(0)

	 const [headerScrolled, setHeaderScrolled] =
		 useState(false)

	 const [activeEmployee, setActiveEmployee] =
		 useState(null)

	 const selectorRef = useRef(null)
	 const selectorTrackRef = useRef(null)

	 const normalizeEmployees = (list) =>
		 (list || []).map((employee) => ({
			 ...employee,
			 imagePosition: {
				 x: Number(
					 employee?.imagePosition?.x ?? 50
				 ),
				 y: Number(
					 employee?.imagePosition?.y ?? 50
				 ),
			 },
		 }))

	 /* =====================================================
		    LOAD
	 ===================================================== */

	 useEffect(() => {
		 window.scrollTo(0, 0)

		 const refreshEmployees = async () => {
			 try {
				 const loadedEmployees =
					 await loadEmployees()

				 setEmployees(
					 normalizeEmployees(
						 loadedEmployees
					 )
				 )

				 setSelectedDepartment('All')
			 } catch (error) {
				 console.error(
					 'Failed to load employees:',
					 error
				 )
			 }
		 }

		 refreshEmployees()

		 window.addEventListener(
			 'employees-updated',
			 refreshEmployees
		 )

		 const updateHeaderState = () => {
			 const hero =
				 document.querySelector(
					 '.staff-hero'
				 )

			 if (!hero) return

			 setHeaderScrolled(
				 window.scrollY >
					 hero.offsetTop +
						 hero.offsetHeight -
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
				 'employees-updated',
				 refreshEmployees
			 )

			 window.removeEventListener(
				 'scroll',
				 updateHeaderState
			 )
		 }
	 }, [])

	 /* =====================================================
		    SELECTOR
	 ===================================================== */

	 useEffect(() => {
		 if (!selectorRef.current) return

		 const measure = () => {
			 const visibleWidth =
				 selectorRef.current
					 .clientWidth

			 const contentWidth =
				 selectorTrackRef.current
					 ?.scrollWidth || 0

			 setSelectorVisibleWidth(
				 visibleWidth
			 )

			 setSelectorContentWidth(
				 contentWidth
			 )

			 setSelectorOffset((current) =>
				 Math.min(
					 current,
					 Math.max(
						 0,
						 contentWidth -
							 visibleWidth
					 )
				 )
			 )
		 }

		 measure()

		 window.addEventListener(
			 'resize',
			 measure
		 )

		 return () =>
			 window.removeEventListener(
				 'resize',
				 measure
			 )
	 }, [])

	 const maxSelectorOffset =
		 Math.max(
			 0,
			 selectorContentWidth -
				 selectorVisibleWidth
		 )

	 const centerDepartment = (button) => {
		 if (
			 !button ||
			 !selectorVisibleWidth
		 ) {
			 return
		 }

		 const offset =
			 button.offsetLeft +
			 button.offsetWidth / 2 -
			 selectorVisibleWidth / 2

		 setSelectorOffset(
			 Math.max(
				 0,
				 Math.min(
					 offset,
					 maxSelectorOffset
				 )
			 )
		 )

		 setSelectedDepartment(
			 button.textContent
		 )
	 }

	 const scrollDepartmentSelector = (
		 direction
	 ) => {
		 const buttons = Array.from(
			 selectorTrackRef.current?.querySelectorAll(
				 'button'
			 ) || []
		 )

		 if (!buttons.length) return

		 setSelectorOffset((current) => {
			 const center =
				 current +
				 selectorVisibleWidth / 2

			 if (direction > 0) {
				 const next =
					 buttons.find(
						 (button) =>
							 button.offsetLeft +
								 button.offsetWidth /
									 2 >
							 center + 1
					 )

				 if (!next) return 0

				 return Math.max(
					 0,
					 Math.min(
						 next.offsetLeft +
							 next.offsetWidth /
								 2 -
							 selectorVisibleWidth /
								 2,
						 maxSelectorOffset
					 )
				 )
			 }

			 const previous =
				 buttons
					 .filter(
						 (button) =>
							 button.offsetLeft +
								 button.offsetWidth /
									 2 <
							 center - 1
					 )
					 .at(-1)

			 if (!previous) {
				 return maxSelectorOffset
			 }

			 return Math.max(
				 0,
				 Math.min(
					 previous.offsetLeft +
						 previous.offsetWidth /
							 2 -
						 selectorVisibleWidth /
							 2,
					 maxSelectorOffset
				 )
			 )
		 })
	 }

	 const filteredEmployees =
		 employees.filter(
			 (employee) =>
				 selectedDepartment === 'All' ||
				 employee.department ===
					 selectedDepartment
		 )

	 return (
		 <main className="site-shell staff-page">

			 {/* =================================================
				    NAV
			 ================================================= */}

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
					 ].map((item) => (
						 <a
							 key={item}
							 href={
								 item === 'Groups'
									 ? '/groups'
									 : item === 'The Team'
									 ? '/staff'
									 : item === 'Careers'
									 ? '/careers'
									 : '/#about-us'
							 }
							 onClick={() =>
								 setMenuOpen(false)
							 }
						 >
							 {item}
						 </a>
					 ))}
				 </div>

				 <a
					 className="phone-link"
					 href="tel:0323439651"
				 >
					 <span aria-hidden="true">
						 ☎
					 </span>{' '}
					 (032) 343-9651
				 </a>

			 </nav>

			 {/* =================================================
				    HERO
			 ================================================= */}

			 <motion.header
				 className="staff-hero staff-hero-clean"
				 style={{
					 backgroundImage: `
						 linear-gradient(
							 90deg,
							 rgba(6,35,55,.88) 0%,
							 rgba(6,35,55,.58) 50%,
							 rgba(6,35,55,.18) 100%
						 ),
						 url("${staffHeroImage}")
					 `,
				 }}
				 initial="hidden"
				 animate="visible"
				 variants={heroStagger}
			 >

				 <motion.div
					 className="staff-hero-number"
					 variants={heroNumber}
				 >
					 03
				 </motion.div>

				 <motion.div
					 className="staff-hero-meta"
					 variants={fadeUp}
				 >
					 <span>03</span>
					 <span>THE PEOPLE</span>
					 <span>HP VENTURES</span>
				 </motion.div>

				 <div className="staff-hero-content">

					 <motion.p
						 className="eyebrow"
						 variants={fadeLeft}
					 >
						 OUR PEOPLE
					 </motion.p>

					 <motion.h1
						 variants={fadeLeft}
					 >
						 Progress
						 <br />
						 <span>
							 Makers.
						 </span>
					 </motion.h1>

					 <motion.p
						 variants={fadeRight}
					 >
						 Meet the people whose
						 experience, perspective,
						 and commitment move
						 HP Ventures forward.
					 </motion.p>

				 </div>

				 <motion.div
					 className="staff-hero-bottom"
					 variants={fadeUp}
				 >
					 <span>
						 PEOPLE / PURPOSE / PROGRESS
					 </span>

					 <div>
						 <span>
							 MEET THE TEAM
						 </span>

						 <motion.span
							 animate={{
								 y: [0, 6, 0],
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

			 </motion.header>

			 {/* =================================================
				    INTRO
			 ================================================= */}

			 <section className="staff-intro staff-intro-clean">

				 <motion.div
					 className="staff-intro-number"
					 initial={{
						 opacity: 0,
						 y: 25,
					 }}
					 whileInView={{
						 opacity: 0.05,
						 y: 0,
					 }}
					 viewport={{
						 once: true,
					 }}
					 transition={{
						 duration: 0.7,
						 ease,
					 }}
				 >
					 01
				 </motion.div>

				 <motion.div
					 className="staff-intro-heading"
					 initial={{
						 opacity: 0,
						 x: -60,
					 }}
					 whileInView={{
						 opacity: 1,
						 x: 0,
					 }}
					 viewport={{
						 once: true,
						 amount: 0.25,
					 }}
					 transition={{
						 duration: 0.9,
						 ease,
					 }}
				 >

					 <p className="eyebrow">
						 MORE THAN A TEAM
					 </p>

					 <h2>
						 Different
						 <br />
						 <span>
							 perspectives.
						 </span>
					 </h2>

				 </motion.div>

				 <motion.div
					 className="staff-intro-side"
					 initial={{
						 opacity: 0,
						 x: 60,
					 }}
					 whileInView={{
						 opacity: 1,
						 x: 0,
					 }}
					 viewport={{
						 once: true,
						 amount: 0.25,
					 }}
					 transition={{
						 duration: 0.9,
						 delay: 0.1,
						 ease,
					 }}
				 >

					 <h3>
						 One direction.
					 </h3>

					 <p>
						 Our people bring together
						 different experiences,
						 disciplines, and ideas.
						 Together, they create the
						 perspective needed to build
						 businesses that keep moving
						 forward.
					 </p>

				 </motion.div>

			 </section>

			 {/* =================================================
				    TEAM DIRECTORY
			 ================================================= */}

			 <section
				 className="staff-content staff-content-clean"
				 aria-labelledby="staff-heading"
			 >

				 <motion.div
					 className="staff-directory-header"
					 initial={{
						 opacity: 0,
						 y: 40,
					 }}
					 whileInView={{
						 opacity: 1,
						 y: 0,
					 }}
					 viewport={{
						 once: true,
						 amount: 0.2,
					 }}
					 transition={{
						 duration: 0.8,
						 ease,
					 }}
				 >

					 <div>

						 <span className="staff-section-number">
							 02
						 </span>

						 <p className="eyebrow">
							 THE TEAM
						 </p>

						 <h2 id="staff-heading">
							 MEET THE
							 <br />
							 PEOPLE.
						 </h2>

					 </div>

					 <div className="staff-count">

						 <span>
							 {String(
								 filteredEmployees.length
							 ).padStart(2, '0')}
						 </span>

						 <p>
							 {filteredEmployees.length ===
							 1
								 ? 'PERSON'
								 : 'PEOPLE'}
							 <br />
							 IN THIS VIEW
						 </p>

					 </div>

				 </motion.div>

				 {/* FILTER */}

				 <div className="staff-filter-row">

					 <span>
						 FILTER BY
					 </span>

					 <div className="category-selector-wrap">

						 {staffDepartments.length > 5 && (
							 <button
								 type="button"
								 className="category-selector-arrow left"
								 aria-label="Previous departments"
								 onClick={() =>
									 scrollDepartmentSelector(
										 -1
									 )
								 }
							 >
								 ‹
							 </button>
						 )}

						 <div
							 className="category-selector staff-selector"
							 ref={selectorRef}
							 role="tablist"
							 aria-label="Staff departments"
						 >

							 <div
								 className="category-selector-track"
								 ref={selectorTrackRef}
								 style={{
									 transform: `translateX(-${selectorOffset}px)`,
								 }}
							 >

								 {selectorDepartments.map(
									 (
										 department,
										 index
									 ) => (
										 <button
											 key={`${department}-${index}`}
											 className={
												 selectedDepartment ===
												 department
													 ? 'active'
													 : ''
											 }
											 role="tab"
											 aria-selected={
												 selectedDepartment ===
												 department
											 }
											 onClick={(
												 event
											 ) =>
												 centerDepartment(
													 event.currentTarget
												 )
											 }
											 type="button"
										 >
											 {department}
										 </button>
									 )
								 )}

							 </div>

						 </div>

						 {staffDepartments.length > 5 && (
							 <button
								 type="button"
								 className="category-selector-arrow right"
								 aria-label="Next departments"
								 onClick={() =>
									 scrollDepartmentSelector(
										 1
									 )
								 }
							 >
								 ›
							 </button>
						 )}

					 </div>

				 </div>

				 {/* EMPLOYEE GRID */}

				 <motion.div
					 className="employee-grid employee-grid-clean"
					 layout
				 >

					 <AnimatePresence
						 mode="popLayout"
					 >

						 {filteredEmployees.map(
							 (
								 employee,
								 index
							 ) => {

								 const posX =
									 employee
										 .imagePosition
										 ?.x ?? 50

								 const posY =
									 employee
										 .imagePosition
										 ?.y ?? 50

								 const positionValue =
									 `${posX}% ${posY}%`

								 const employeeKey =
									 employee.id ||
									 `${employee.name}-${index}`

								 const active =
									 activeEmployee ===
									 employeeKey

								 return (
									 <motion.article
										 key={
											 employeeKey
										 }
										 className="employee-card employee-card-clean"
										 layout
										 initial={{
											 opacity: 0,
											 y: 35,
										 }}
										 animate={{
											 opacity: 1,
											 y: 0,
										 }}
										 exit={{
											 opacity: 0,
											 y: 20,
										 }}
										 transition={{
											 duration:
												 0.55,
											 delay:
												 Math.min(
													 index *
														 0.04,
													 0.28
												 ),
											 ease,
											 layout: {
												 duration:
													 0.4,
											 },
										 }}
										 onMouseEnter={() =>
											 setActiveEmployee(
												 employeeKey
											 )
										 }
										 onMouseLeave={() =>
											 setActiveEmployee(
												 null
											 )
										 }
									 >

										 <div
											 className="employee-card-image"
											 style={
												 employee.image
													 ? {
															 backgroundImage: `url("${employee.image}")`,
															 backgroundPosition:
																 positionValue,
														 }
													 : undefined
											 }
										 />

										 <div className="employee-card-gradient" />

										 <div className="employee-card-top">
											 <span>
												 {String(
													 index +
														 1
												 ).padStart(
													 2,
													 '0'
												 )}
											 </span>

											 <motion.span
												 animate={{
													 rotate:
														 active
															 ? 45
															 : 0,
												 }}
											 >
												 ↗
											 </motion.span>
										 </div>

										 <motion.div
											 className="employee-card-info"
											 animate={{
												 y: active
													 ? -4
													 : 0,
											 }}
										 >

											 <h3>
												 {
													 employee.name
												 }
											 </h3>

											 <span className="employee-role">
												 {
													 employee.role
												 }
											 </span>

											 <AnimatePresence>
												 {active &&
													 employee.description && (
														 <motion.p
															 initial={{
																 opacity: 0,
																 height: 0,
																 y: 10,
															 }}
															 animate={{
																 opacity: 1,
																 height:
																	 'auto',
																 y: 0,
															 }}
															 exit={{
																 opacity: 0,
																 height: 0,
																 y: 10,
															 }}
															 transition={{
																 duration:
																	 0.3,
															 }}
														 >
															 {
																 employee.description
															 }
														 </motion.p>
													 )}
											 </AnimatePresence>

										 </motion.div>

									 </motion.article>
								 )
							 }
						 )}

					 </AnimatePresence>

					 {filteredEmployees.length ===
						 0 && (
						 <div className="staff-empty">
							 No team members found
							 in this department.
						 </div>
					 )}

				 </motion.div>

			 </section>

			 {/* =================================================
				    CLOSING
			 ================================================= */}

			 <section className="staff-closing staff-closing-clean">

				 <div className="staff-closing-word">
					 PEOPLE
				 </div>

				 <motion.div
					 className="staff-closing-content"
					 initial={{
						 opacity: 0,
						 y: 60,
					 }}
					 whileInView={{
						 opacity: 1,
						 y: 0,
					 }}
					 viewport={{
						 once: true,
						 amount: 0.3,
					 }}
					 transition={{
						 duration: 0.9,
						 ease,
					 }}
				 >

					 <p className="eyebrow">
						 03 / THE PEOPLE
					 </p>

					 <h2>
						 Great businesses
						 <br />
						 are built by
						 <span>
							 great people.
						 </span>
					 </h2>

				 </motion.div>

			 </section>

			 <FloatingCertifications />

			 <Footer />

		 </main>
	 )
}

export default Staff