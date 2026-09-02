import itDepartmentImage from './images/it_department/mr. dpo.jpg'
import rodImage from './images/it_department/rod.png'
import roxanImage from './images/accounting_department/roxan.jpg'
import { supabase, supabaseConfigured } from './supabaseClient.js'

export const defaultDepartments = ['LEADERSHIP', 'IT DEPARTMENT', 'FINANCE AND ACCOUNTING', 'HR DEPARTMENT', 'TAURUS CAFE']

export function loadDepartments() {
  try {
    const savedDepartments = window.localStorage.getItem('hp-ventures-departments')
    const departments = savedDepartments ? JSON.parse(savedDepartments) : defaultDepartments
    if (!Array.isArray(departments) || !departments.length) return [...defaultDepartments]
    return departments.map((department) => String(department).trim()).filter(Boolean)
  } catch {
    return [...defaultDepartments]
  }
}

export function saveDepartments(departments) {
  const sanitized = [...new Set((departments || []).map((department) => String(department).trim()).filter(Boolean))]
  const nextDepartments = sanitized.length ? sanitized : [...defaultDepartments]
  window.localStorage.setItem('hp-ventures-departments', JSON.stringify(nextDepartments))
  return nextDepartments
}

export function resetDepartments() {
  window.localStorage.removeItem('hp-ventures-departments')
  return [...defaultDepartments]
}

export const departments = loadDepartments()

export const defaultEmployees = [
  { id: 'employee-1', name: 'Name Test', role: 'Chairman', department: 'LEADERSHIP', description: 'Guides the group with a long-term view of responsible growth, strong partnerships, and meaningful value creation.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-2', name: 'Name Test', role: 'President', department: 'LEADERSHIP', description: 'Leads the company culture and day-to-day direction, keeping every business focused, agile, and people-first.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-3', name: 'Adoneslim Dacalos Jr.', role: 'Data Protection Officer', department: 'IT DEPARTMENT', image: itDepartmentImage, description: 'Connects teams and operations so that good ideas become dependable, measurable results.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-4', name: 'Name Test', role: 'Chief Financial Officer', department: 'FINANCE AND ACCOUNTING', description: 'Brings clarity and discipline to financial planning, risk management, and sustainable portfolio growth.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-5', name: 'Name Test', role: 'Business Development', department: 'TAURUS CAFE', description: 'Builds relationships and explores opportunities that strengthen the group and its business interests.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-6', name: 'Name Test', role: 'People & Culture', department: 'HR DEPARTMENT', description: 'Creates an environment where people can do thoughtful work, grow their skills, and feel part of the mission.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-7', name: 'Rod Christian Camangyan', role: 'Web Developer', department: 'IT DEPARTMENT', image: rodImage, description: 'Helps the group use practical technology to work smarter, stay connected, and prepare for what is next.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-8', name: 'Name Test', role: 'Corporate Affairs', department: 'HR DEPARTMENT', description: 'Supports trusted relationships with stakeholders and helps the group show up with integrity.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-9', name: 'Roxan Beldesola', role: 'Investments', department: 'FINANCE AND ACCOUNTING', image: roxanImage, description: 'Studies markets and opportunities with patience, care, and a clear eye for long-term potential.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-10', name: 'Name Test', role: 'Administration', department: 'TAURUS CAFE', description: 'Keeps the details moving smoothly and makes space for every team to do its best work.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-11', name: 'Name Test', role: 'Web Developer', department: 'IT DEPARTMENT', description: 'Helps the group use practical technology to work smarter, stay connected, and prepare for what is next.', imagePosition: { x: 50, y: 50 } },
  { id: 'employee-12', name: 'Name Test', role: 'Web Developer', department: 'IT DEPARTMENT', description: 'Helps the group use practical technology to work smarter, stay connected, and prepare for what is next.', imagePosition: { x: 50, y: 50 } },
]

const storageKey = 'hp-ventures-employees'

const normalizeImagePosition = (value) => {
  const x = Number(value?.x)
  const y = Number(value?.y)
  return {
    x: Number.isFinite(x) ? Math.min(100, Math.max(0, x)) : 50,
    y: Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : 50,
  }
}

const normalizeEmployee = (employee, index = 0) => ({
  ...employee,
  id: employee.id || `employee-${index + 1}`,
  image: employee.image || employee.image_url || '',
  imagePosition: normalizeImagePosition(
    employee.imagePosition || employee.image_position || {
      x: employee.image_position_x,
      y: employee.image_position_y,
    }
  ),
})

export async function loadEmployees() {
  if (supabaseConfigured) {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data?.length) {
      return data.map((row, index) =>
        normalizeEmployee(
          {
            ...row,
            image: row.image_url || '',
            imagePosition: row.image_position || {
              x: row.image_position_x,
              y: row.image_position_y,
            },
          },
          index
        )
      )
    }
  }

  try {
    const savedEmployees = window.localStorage.getItem(storageKey)
    const employees = savedEmployees ? JSON.parse(savedEmployees) : defaultEmployees
    return employees.map((employee, index) => normalizeEmployee(employee, index))
  } catch {
    return defaultEmployees.map((employee, index) => normalizeEmployee(employee, index))
  }
}

export async function saveEmployees(employees) {
  const normalized = (employees || []).map((employee, index) => normalizeEmployee(employee, index))

  if (supabaseConfigured) {
    try {
      await supabase.from('employees').delete().not('id', 'is', null)

      const payload = normalized.map((employee) => ({
        id: String(employee.id),
        name: employee.name || '',
        role: employee.role || '',
        department: employee.department || '',
        description: employee.description || '',
        image_url: employee.image || null,
        // Prefer a single JSON/JSONB column if you have it:
        image_position: employee.imagePosition || { x: 50, y: 50 },
        // Also send split columns if your table uses those instead:
        image_position_x: employee.imagePosition?.x ?? 50,
        image_position_y: employee.imagePosition?.y ?? 50,
      }))

      const { error } = await supabase.from('employees').insert(payload)
      if (error) console.error('Supabase employee save error:', error)
    } catch (err) {
      console.error('Supabase employee save exception:', err)
    }
  }

  // Always keep a full local copy (includes imagePosition)
  window.localStorage.setItem(storageKey, JSON.stringify(normalized))
  window.dispatchEvent(new Event('employees-updated'))
}

export async function resetEmployees() {
  if (supabaseConfigured) await supabase.from('employees').delete().not('id', 'is', null)
  window.localStorage.removeItem(storageKey)
  window.dispatchEvent(new Event('employees-updated'))
}