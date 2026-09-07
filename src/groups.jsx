import { useEffect, useState } from 'react'
import {
	motion,
	useScroll,
	useTransform,
} from 'framer-motion'

import logo from './images/logo.png'
import Footer from './Footer.jsx'
import FloatingCertifications from './FloatingCertifications.jsx'
import groupsHeroImage from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'
import { loadGroups } from './siteContent.js'


/* =========================================================
   ANIMATION VARIANTS
========================================================= */

const fadeUp = {
	hidden: {
		opacity: 0,
		y: 60,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: [0.22, 1, 0.36, 1],
		},
	},
}

const staggerContainer = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.12,
		},
	},
}

const introStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
}

const heroText = {
	hidden: {
		opacity: 0,
		y: 80,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 1,
			ease: [0.22, 1, 0.36, 1],
		},
	},
}

const portfolioItem = {
	hidden: {
		opacity: 0,
		y: 45,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: [0.22, 1, 0.36, 1],
		},
	},
}


/* =========================================================
   GROUPS
========================================================= */

function Groups() {

	const [menuOpen, setMenuOpen] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState('ALL GROUPS')
	const [groupItems, setGroupItems] = useState([])
	const [headerScrolled, setHeaderScrolled] = useState(false)
	const [activeGroup, setActiveGroup] = useState(null)


	/* =====================================================
	   SCROLL ANIMATIONS
	===================================================== */

	const { scrollYProgress } = useScroll()

	const heroNumberY = useTransform(
		scrollYProgress,
		[0, 0.35],
		[0, 180]
	)

	const ctaBackgroundX = useTransform(
		scrollYProgress,
		[0.65, 1],
		['0%', '-8%']
	)


	/* =====================================================
	   GROUP DATA
	===================================================== */

	const categories = [
		'ALL GROUPS',
		...new Set(
			groupItems.map((group) => group.category)
		),
	]

	const visibleGroups =
		selectedCategory === 'ALL GROUPS'
			? groupItems
			: groupItems.filter(
					(group) =>
						group.category === selectedCategory
			  )


	/* =====================================================
	   LOAD GROUPS
	===================================================== */

	useEffect(() => {

		window.scrollTo(0, 0)

		const refreshGroups = async () => {

			const loadedGroups = await loadGroups()

			setGroupItems(loadedGroups)

			setSelectedCategory('ALL GROUPS')
		}


		refreshGroups()

		window.addEventListener(
			'site-content-updated',
			refreshGroups
		)


		const updateHeaderState = () => {

			const heroSection =
				document.querySelector(
					'.groups-hero-new'
				)

			if (!heroSection) return

			setHeaderScrolled(
				window.scrollY >
					heroSection.offsetTop +
						heroSection.offsetHeight -
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
				'site-content-updated',
				refreshGroups
			)

			window.removeEventListener(
				'scroll',
				updateHeaderState
			)
		}

	}, [])


	return (

		<main className="site-shell groups-page">


			{/* =================================================
			    NAVIGATION
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
							href={
								item === 'About us'
									? '/#about-us'
									: item === 'Groups'
									? '/groups'
									: item === 'The Team'
									? '/staff'
									: item === 'Careers'
									? '/careers'
									: '#'
							}
							key={item}
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
					</span>

					(032) 343-9651

				</a>

			</nav>



			{/* =================================================
			    HERO
			================================================= */}

			<motion.header
				className="groups-hero-new"
				style={{
					backgroundImage: `
						linear-gradient(
							90deg,
							rgba(6,35,55,.96) 0%,
							rgba(6,35,55,.76) 42%,
							rgba(6,35,55,.25) 100%
						),
						url("${groupsHeroImage}")
					`,
				}}
				initial="hidden"
				animate="visible"
			>


				<motion.div
					className="groups-hero-number"
					aria-hidden="true"
					style={{
						y: heroNumberY,
					}}
				>
					02
				</motion.div>


				<motion.div
					className="groups-hero-content"
					variants={staggerContainer}
				>

					<motion.div
						className="groups-hero-meta"
						variants={heroText}
					>

						<span>02</span>

						<span>
							OUR PORTFOLIO
						</span>

					</motion.div>


					<motion.h1 variants={heroText}>

						THE HP

						<br />

						<span>
							GROUPS.
						</span>

					</motion.h1>


					<motion.div
						className="groups-hero-bottom"
						variants={heroText}
					>

						<p>
							A collective of
							businesses working
							together to create
							long-term value,
							meaningful growth,
							and lasting impact.
						</p>


						<div className="groups-scroll-indicator">

							<span>
								SCROLL TO EXPLORE
							</span>


							<motion.div
								className="groups-scroll-line"
								animate={{
									scaleX: [
										0,
										1,
										0,
									],
								}}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							/>

						</div>

					</motion.div>

				</motion.div>

			</motion.header>



			{/* =================================================
			    INTRO
			================================================= */}

			<motion.section
  className="groups-intro"
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {/* Giant background word */}
  <motion.div
    className="groups-intro-bg-word"
    initial={{ opacity: 0, x: -100 }}
    whileInView={{ opacity: 0.045, x: 0 }}
    viewport={{ once: true }}
    transition={{
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    }}
  >
    BUILD
  </motion.div>

  <div className="groups-intro-top">
    <motion.div
      className="groups-intro-number"
      variants={fadeUp}
    >
      01
    </motion.div>

    <motion.p
      className="eyebrow"
      variants={fadeUp}
    >
      BUILD AROUND POSSIBILITY
    </motion.p>

    <motion.span
      className="groups-intro-line"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 1,
        delay: 0.2,
        ease: [0.22, 1, 0.36, 1],
      }}
    />
  </div>

  <div className="groups-intro-main">

    <motion.h2
      variants={fadeUp}
      className="groups-intro-heading"
    >
      We build{' '}
      <span>businesses</span>
      <br />
      that move{' '}
      <span>forward.</span>
    </motion.h2>

    <motion.div
      className="groups-intro-side"
      variants={fadeUp}
    >
      <p className="groups-intro-lead">
        Not just companies.
        <br />
        <strong>Businesses built to last.</strong>
      </p>

      <div className="groups-intro-copy">
        <p>
          HP Ventures brings together businesses,
          people, and ideas with the ambition to
          create meaningful, lasting growth.
        </p>

        <p>
          We invest in opportunity, build with
          purpose, and help every company in our
          group move confidently into what comes next.
        </p>
      </div>
    </motion.div>

  </div>

  <motion.div
    className="groups-intro-bottom"
    variants={fadeUp}
  >
    <span>OUR APPROACH</span>

    <div className="groups-intro-scroll">
      <span>SCROLL TO EXPLORE</span>
      <motion.span
        className="groups-intro-arrow"
        animate={{ x: [0, 8, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        →
      </motion.span>
    </div>
  </motion.div>
</motion.section>



			{/* =================================================
			    PORTFOLIO
			================================================= */}

			<section
				className="groups-directory"
				aria-labelledby="groups-heading"
			>


				<motion.div
					className="groups-directory-header"
					initial={{
						opacity: 0,
						y: 50,
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
						duration: 0.8,
						ease: [
							0.22,
							1,
							0.36,
							1,
						],
					}}
				>

					<div>

						<span className="groups-section-number">
							02
						</span>

						<p className="eyebrow">
							OUR COMPANIES
						</p>

						<h2 id="groups-heading">
							THE PORTFOLIO
						</h2>

					</div>


					<div className="groups-count">

<div className="groups-directory-count">
  {String(visibleGroups.length).padStart(2, '0')} COMPANIES
</div>

						<p>
  {visibleGroups.length === 1 ? 'COMPANY' : 'COMPANIES'}
  <br />
  ACROSS OUR GROUP
</p>

					</div>

				</motion.div>



				{/* =============================================
				    FILTER
				============================================= */}

				<motion.div
					className="groups-filter"
					initial={{
						opacity: 0,
						y: 25,
					}}
					whileInView={{
						opacity: 1,
						y: 0,
					}}
					viewport={{
						once: true,
					}}
					transition={{
						duration: 0.6,
					}}
					role="tablist"
					aria-label="Group categories"
				>

					<span className="groups-filter-label">
						FILTER
					</span>


					<div className="groups-filter-options">

						{categories.map(
							(category) => (

								<motion.button
									key={category}
									className={
										selectedCategory ===
										category
											? 'active'
											: ''
									}
									role="tab"
									aria-selected={
										selectedCategory ===
										category
									}
									onClick={() =>
										setSelectedCategory(
											category
										)
									}
									whileHover={{
										y: -2,
									}}
									whileTap={{
										scale: 0.95,
									}}
								>

									{category}

								</motion.button>

							)
						)}

					</div>

				</motion.div>



				{/* =============================================
				    GROUP LIST
				============================================= */}

				<motion.div
					className="groups-portfolio-list"
					initial="hidden"
					whileInView="visible"
					viewport={{
						once: true,
						amount: 0.08,
					}}
					variants={staggerContainer}
				>

					<motion.div
  className="groups-portfolio-list"
  layout
>
  {visibleGroups.map((group, index) => (
    <motion.a
      key={`${group.number}-${group.name || index}`}
      href={group.url || '#'}
      className={`groups-portfolio-item ${
        activeGroup === group.number ? 'is-active' : ''
      }`}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
        layout: {
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      onMouseEnter={() => setActiveGroup(group.number)}
      onMouseLeave={() => setActiveGroup(null)}
    >
      <div className="groups-item-number">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="groups-item-main">
        <span className="groups-item-category">
          {group.category || 'GROUP'}
        </span>

        <motion.h3
          animate={{
            x: activeGroup === group.number ? 10 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {group.name}
        </motion.h3>

        <p>
          {group.description}
        </p>
      </div>

      <motion.div
        className="groups-item-visual"
        animate={{
          scale: activeGroup === group.number ? 1.04 : 1,
          x: activeGroup === group.number ? 8 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {group.logo ? (
          <img
            src={group.logo}
            alt={group.name}
          />
        ) : (
          <span>
            {group.name?.charAt(0)}
          </span>
        )}
      </motion.div>

      <div className="groups-item-action">
        <span>VIEW COMPANY</span>

        <motion.div
          className="groups-item-arrow"
          animate={{
            rotate: activeGroup === group.number ? 45 : 0,
            x: activeGroup === group.number ? 4 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          ↗
        </motion.div>
      </div>

      <motion.div
        className="groups-item-line"
        animate={{
          scaleX: activeGroup === group.number ? 1 : 0,
        }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </motion.a>
  ))}
</motion.div>

				</motion.div>

			</section>



			{/* =================================================
			    APPROACH
			================================================= */}

			<motion.section
				className="groups-approach"
				initial="hidden"
				whileInView="visible"
				viewport={{
					once: true,
					amount: 0.2,
				}}
				variants={staggerContainer}
			>


				<div className="groups-approach-number">
					03
				</div>


				<motion.div
					className="groups-approach-header"
					variants={fadeUp}
				>

					<p className="eyebrow">
						HOW WE THINK
					</p>


					<h2>

						INVEST.

						<br />

						<span>
							BUILD.
						</span>

						<br />

						GROW.

					</h2>

				</motion.div>



				<div className="groups-approach-grid">


					<motion.div
						className="groups-approach-card"
						variants={fadeUp}
						whileHover={{
							y: -12,
						}}
					>

						<span>
							01
						</span>

						<h3>
							INVEST
						</h3>

						<p>
							We identify
							opportunities where
							capital, expertise,
							and the right people
							can create meaningful
							value.
						</p>

						<div className="approach-arrow">
							↘
						</div>

					</motion.div>



					<motion.div
						className="groups-approach-card"
						variants={fadeUp}
						whileHover={{
							y: -12,
						}}
					>

						<span>
							02
						</span>

						<h3>
							BUILD
						</h3>

						<p>
							We strengthen
							businesses through
							technology,
							discipline,
							collaboration, and
							a long-term mindset.
						</p>

						<div className="approach-arrow">
							↘
						</div>

					</motion.div>



					<motion.div
						className="groups-approach-card"
						variants={fadeUp}
						whileHover={{
							y: -12,
						}}
					>

						<span>
							03
						</span>

						<h3>
							GROW
						</h3>

						<p>
							We create environments
							where people and
							businesses can continue
							to evolve and move
							forward.
						</p>

						<div className="approach-arrow">
							↘
						</div>

					</motion.div>

				</div>

			</motion.section>



			{/* =================================================
			    CTA
			================================================= */}

			<motion.section
				className="groups-cta"
				initial="hidden"
				whileInView="visible"
				viewport={{
					once: true,
					amount: 0.25,
				}}
			>


				<div className="groups-cta-number">
					04
				</div>


				<motion.div
					className="groups-cta-bg"
					style={{
						x: ctaBackgroundX,
					}}
				>
					POSSIBILITY
				</motion.div>


				<div className="groups-cta-content">

					<p className="eyebrow">
						BUILD WITH US
					</p>


					<motion.h2
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
							amount: 0.4,
						}}
						transition={{
							duration: 0.9,
							ease: [
								0.22,
								1,
								0.36,
								1,
							],
						}}
					>

						YOUR NEXT

						<br />

						MOVE{' '}

						<span>
							STARTS HERE.
						</span>

					</motion.h2>


					<motion.a
						href="/#contacts"
						className="groups-cta-button"
						whileHover={{
							scale: 1.03,
						}}
						whileTap={{
							scale: 0.97,
						}}
					>

						<span>
							GET IN TOUCH
						</span>


						<motion.strong
							whileHover={{
								x: 5,
								y: -5,
							}}
						>
							↗
						</motion.strong>

					</motion.a>

				</div>

			</motion.section>



			{/* =================================================
			    FOOTER
			================================================= */}

			<FloatingCertifications />

			<Footer />

		</main>
	)
}


export default Groups