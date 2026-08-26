import eventImageOne from './images/company_events/171-Enhanced-NR.jpg'
import eventImageTwo from './images/company_events/187-Enhanced-NR.jpg'
import eventImageThree from './images/company_events/268-Enhanced-NR.jpg'
import eventImageFour from './images/company_events/280-Enhanced-NR.jpg'
import eventImageFive from './images/company_events/491222308_1139710681502200_736987314008467945_n.jpg'
import eventImageSix from './images/company_events/491339986_1139565998183335_2328618360663044858_n.jpg'
import eventImageSeven from './images/company_events/492124794_1140941494712452_1302670891728671341_n.jpg'
import eventImageEight from './images/company_events/8006541_DSC_0043.JPG'
import eventImageNine from './images/company_events/8006541_DSC_0049_high.JPG'
import eventImageTen from './images/company_events/dji_fly_20250901_114622_0014_1756701711042_photo.jpg'
import eventImageEleven from './images/company_events/dji_fly_20250901_114758_0019_1756701704954_photo.jpg'
import { supabase, supabaseConfigured } from './supabaseClient.js'

export const defaultEvents = [eventImageOne, eventImageTwo, eventImageThree, eventImageFour, eventImageFive, eventImageSix, eventImageSeven, eventImageEight, eventImageNine, eventImageTen, eventImageEleven]

const storageKey = 'hp-ventures-company-events'

export async function loadEvents() {
  if (supabaseConfigured) {
    const { data, error } = await supabase.from('company_events').select('image_url').order('created_at', { ascending: true })
    if (!error && data?.length) return data.map((event) => event.image_url)
  }
  try {
    const savedEvents = window.localStorage.getItem(storageKey)
    return savedEvents ? JSON.parse(savedEvents) : defaultEvents
  } catch {
    return defaultEvents
  }
}

export async function saveEvents(events) {
  if (supabaseConfigured) {
    await supabase.from('company_events').delete().not('id', 'is', null)
    const { error } = await supabase.from('company_events').insert(events.map((image_url) => ({ image_url })))
    if (error) throw error
  }
  window.localStorage.setItem(storageKey, JSON.stringify(events))
  window.dispatchEvent(new Event('events-updated'))
}

export async function resetEvents() {
  if (supabaseConfigured) await supabase.from('company_events').delete().not('id', 'is', null)
  window.localStorage.removeItem(storageKey)
  window.dispatchEvent(new Event('events-updated'))
}
