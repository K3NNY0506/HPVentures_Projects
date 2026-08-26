import infovisionLogo from './images/logos/infovision.png'
import Link2InfoLogo from './images/logos/link2info.png'
import InfozLogo from './images/logos/infoz.png'
import infotradeLogo from './images/logos/infotrade.png'
import henzplaceLogo from './images/logos/henzplace.png'
import { supabase, supabaseConfigured } from './supabaseClient.js'

export const defaultWhatWeDo = {
  'Investors Relations': [
    { title: 'Financial Study', text: 'HP Ventures, Inc. is a growing investment holding company focused on building a diverse and profitable portfolio through strategic investments, prudent risk management, and sustainable growth.' },
    { title: 'Corporate Trends', text: 'HP Ventures, Inc. has various exposures in the local outsourcing services industry, while expanding into trading, manufacturing, IT, and real estate through its growing portfolio.' },
    { title: 'Banks', text: 'HP Ventures, Inc. has investments across outsourcing, IT, trading and manufacturing, and real estate, with affiliates managed for aligned and profitable operations.' },
  ],
  'Business Interest': [
    { title: 'Outsourcing', text: 'Building dependable service businesses that help organizations operate with greater focus, speed, and confidence.' },
    { title: 'Information Technology', text: 'Supporting practical technology solutions that make businesses more connected, capable, and ready for change.' },
    { title: 'Trading & Manufacturing', text: 'Growing our presence in the trading and manufacturing space through reliable products and local market knowledge.' },
  ],
  'Social Responsibility': [
    { title: 'Community', text: 'We participate in initiatives that nurture people, strengthen communities, and support a more inclusive future.' },
    { title: 'Nation Building', text: 'Our work contributes to the growth of the communities and local economies where our businesses operate.' },
    { title: 'Environment', text: 'We believe responsible growth includes caring for the environment and making thoughtful choices today.' },
  ],
  Careers: [
    { title: 'Join Our Team', text: 'Bring your perspective, expertise, and ambition to a growing group of businesses with room to make an impact.' },
    { title: 'Growth Mindset', text: 'We support people who stay curious, take ownership, and keep looking for better ways forward.' },
    { title: 'Shared Values', text: 'Integrity, accountability, and respect shape how we work with our colleagues, partners, and communities.' },
  ],
}

export const defaultArchiveEntries = {
  VISION: { label: '#1', title: 'WHAT WE ENVISION.', text: 'We envisioned a Highly Valuable entity providing Excellent products and services to all our customers in all our business segments.' },
  MISSION: { label: '#2', title: 'WHAT WE STRIVE FOR.', text: 'Our Mission is embedded well within the goals and aspirations of all our business entities as they progress on their day to day business.' },
  'CORE VALUES': { label: '#3', title: 'WHAT STICKS US TOGETHER.', text: 'Innovation, Teamwork, Customer Service, Calculated Risk, Growth Oriented, Hard Work, Perseverance.' },
}

export const defaultGroups = [
  { number: '01', name: 'Infovision Research Systems', logo: infovisionLogo, url: 'https://www.infovisionresearch.com/home/', category: 'OUTSOURCING SERVICES', description: 'A leading provider of research and business process solutions built around dependable service.' },
  { number: '02', name: 'Jobsvision Human Capital', category: 'HR', description: 'Connecting organizations with the people and capabilities they need to grow.' },
  { number: '03', name: 'Link2Info Outsourcing', logo: Link2InfoLogo, url: 'https://link2info-outsourcing.com/', category: 'OUTSOURCING SERVICES', description: 'Practical outsourcing support that helps businesses work smarter and serve better.' },
  { number: '04', name: 'InfoZ IT Works', logo: InfozLogo, url: 'https://www.infozitworks.com/', category: 'IT', description: 'Technology solutions that help modern businesses become more connected and capable.' },
  { number: '05', name: 'Infotrade Resources', logo: infotradeLogo, url: 'https://www.facebook.com/infotraderesources/', category: 'TRADING & MANUFACTURING', description: 'Building a growing presence in trade through products, partnerships, and local insight.' },
  { number: '06', name: 'Henzplace@Sea Residences', logo: henzplaceLogo, url: 'https://www.facebook.com/HenzplaceSeaResidences/', category: 'REAL ESTATE', description: 'A property and leasing business focused on useful, well-managed spaces.' },
]

const keys = { whatWeDo: 'hp-ventures-what-we-do', archive: 'hp-ventures-archive', groups: 'hp-ventures-groups' }

function load(key, fallback) {
  try { return JSON.parse(window.localStorage.getItem(key)) || fallback } catch { return fallback }
}

export async function loadWhatWeDo() {
  if (supabaseConfigured) {
    const { data, error } = await supabase.from('what_we_do').select('*').order('category_order').order('card_order')
    if (!error && data?.length) return data.reduce((result, card) => ({ ...result, [card.category]: [...(result[card.category] || []), { title: card.title, text: card.text }] }), {})
  }
  return load(keys.whatWeDo, defaultWhatWeDo)
}

export async function loadArchiveEntries() {
  if (supabaseConfigured) {
    const { data, error } = await supabase.from('archive_entries').select('*').order('sort_order')
    if (!error && data?.length) return Object.fromEntries(data.map((entry) => [entry.key, { label: entry.label, title: entry.title, text: entry.text }]))
  }
  return load(keys.archive, defaultArchiveEntries)
}

export async function loadGroups() {
  if (supabaseConfigured) {
    const { data, error } = await supabase.from('groups').select('*').order('number')
    if (!error && data?.length) return data.map(({ logo_url, ...group }) => ({ ...group, logo: logo_url || '' }))
  }
  return load(keys.groups, defaultGroups)
}

export async function saveSiteContent(type, value) {
  if (supabaseConfigured) {
    if (type === 'whatWeDo') {
      await supabase.from('what_we_do').delete().not('id', 'is', null)
      const rows = Object.entries(value).flatMap(([category, cards], categoryIndex) => cards.map((card, cardIndex) => ({ category, title: card.title, text: card.text, category_order: categoryIndex, card_order: cardIndex })))
      if (rows.length) await supabase.from('what_we_do').insert(rows)
    } else if (type === 'archive') {
      await supabase.from('archive_entries').upsert(Object.entries(value).map(([key, entry], index) => ({ key, label: entry.label, title: entry.title, text: entry.text, sort_order: index })), { onConflict: 'key' })
    } else if (type === 'groups') {
      await supabase.from('groups').delete().not('id', 'is', null)
      if (value.length) await supabase.from('groups').insert(value.map(({ logo, ...group }) => ({ ...group, logo_url: logo || null })))
    }
  }
  window.localStorage.setItem(keys[type], JSON.stringify(value))
  window.dispatchEvent(new Event('site-content-updated'))
}

export async function resetSiteContent(type) {
  if (supabaseConfigured) {
    const tables = { whatWeDo: 'what_we_do', archive: 'archive_entries', groups: 'groups' }
    await supabase.from(tables[type]).delete().not('id', 'is', null)
  }
  window.localStorage.removeItem(keys[type])
  window.dispatchEvent(new Event('site-content-updated'))
}
