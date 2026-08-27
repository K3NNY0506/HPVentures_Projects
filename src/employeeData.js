import itDepartmentImage from './images/it_department/mr. dpo.jpg'
import rodImage from './images/it_department/rod.jpg'
import roxanImage from './images/accounting_department/roxan.jpg'
import { supabase, supabaseConfigured } from './supabaseClient.js'

export const departments = ['LEADERSHIP', 'IT DEPARTMENT', 'FINANCE AND ACCOUNTING', 'HR DEPARTMENT', 'TAURUS CAFE']

export const defaultEmployees = [
  { id: 'employee-1', name: 'Name Test', role: 'Chairman', department: 'LEADERSHIP', description: 'Guides the group with a long-term view of responsible growth, strong partnerships, and meaningful value creation.' },
  { id: 'employee-2', name: 'Name Test', role: 'President', department: 'LEADERSHIP', description: 'Leads the company culture and day-to-day direction, keeping every business focused, agile, and people-first.' },
  { id: 'employee-3', name: 'Adoneslim Dacalos Jr.', role: 'Data Protection Officer', department: 'IT DEPARTMENT', image: itDepartmentImage, description: 'Connects teams and operations so that good ideas become dependable, measurable results.' },
  { id: 'employee-4', name: 'Name Test', role: 'Chief Financial Officer', department: 'FINANCE AND ACCOUNTING', description: 'Brings clarity and discipline to financial planning, risk management, and sustainable portfolio growth.' },
  { id: 'employee-5', name: 'Name Test', role: 'Business Development', department: 'TAURUS CAFE', description: 'Builds relationships and explores opportunities that strengthen the group and its business interests.' },
  { id: 'employee-6', name: 'Name Test', role: 'People & Culture', department: 'HR DEPARTMENT', description: 'Creates an environment where people can do thoughtful work, grow their skills, and feel part of the mission.' },
  { id: 'employee-7', name: 'Rod Christian Camangyan', role: 'Web Developer', department: 'IT DEPARTMENT', image: rodImage, description: 'Helps the group use practical technology to work smarter, stay connected, and prepare for what is next.' },
  { id: 'employee-8', name: 'Name Test', role: 'Corporate Affairs', department: 'HR DEPARTMENT', description: 'Supports trusted relationships with stakeholders and helps the group show up with integrity.' },
  { id: 'employee-9', name: 'Roxan Beldesola', role: 'Investments', department: 'FINANCE AND ACCOUNTING', image: roxanImage, description: 'Studies markets and opportunities with patience, care, and a clear eye for long-term potential.' },
  { id: 'employee-10', name: 'Name Test', role: 'Administration', department: 'TAURUS CAFE', description: 'Keeps the details moving smoothly and makes space for every team to do its best work.' },
  { id: 'employee-11', name: 'Name Test', role: 'Web Developer', department: 'IT DEPARTMENT', description: 'Helps the group use practical technology to work smarter, stay connected, and prepare for what is next.' },
  { id: 'employee-12', name: 'Name Test', role: 'Web Developer', department: 'IT DEPARTMENT', description: 'Helps the group use practical technology to work smarter, stay connected, and prepare for what is next.' },
]

const storageKey = 'hp-ventures-employees'

export async function loadEmployees() {
  if (supabaseConfigured) {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: true })
    if (!error && data?.length) return data.map(({ image_url, ...employee }) => ({ ...employee, image: image_url || '' }))
  }
  try {
    const savedEmployees = window.localStorage.getItem(storageKey)
    const employees = savedEmployees ? JSON.parse(savedEmployees) : defaultEmployees
    return employees.map((employee, index) => ({ ...employee, id: employee.id || `employee-${index + 1}` }))
  } catch {
    return defaultEmployees
  }
}

export async function saveEmployees(employees) {
  if (supabaseConfigured) {
    try {
      await supabase.from('employees').delete().not('id', 'is', null)
      const payload = employees.map(({ image, ...employee }) => ({
        id: String(employee.id),
        name: employee.name || '',
        role: employee.role || '',
        department: employee.department || '',
        description: employee.description || '',
        image_url: image || null
      }))
      const { error } = await supabase.from('employees').insert(payload)
      if (error) console.error('Supabase employee save error:', error)
    } catch (err) {
      console.error('Supabase employee save exception:', err)
    }
  }
  window.localStorage.setItem(storageKey, JSON.stringify(employees))
  window.dispatchEvent(new Event('employees-updated'))
}

export async function resetEmployees() {
  if (supabaseConfigured) await supabase.from('employees').delete().not('id', 'is', null)
  window.localStorage.removeItem(storageKey)
  window.dispatchEvent(new Event('employees-updated'))
}
