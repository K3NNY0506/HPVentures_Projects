import itDepartmentImage from './images/it_department/mr. dpo.jpg'
import rodImage from './images/it_department/rod.png'
import roxanImage from './images/accounting_department/roxan.jpg'
import { supabase, supabaseConfigured } from './supabaseClient.js'

const API_URL = 'http://127.0.0.1:8000/api'
const LARAVEL_URL = 'http://127.0.0.1:8000'

export const defaultDepartments = ['LEADERSHIP', 'IT DEPARTMENT', 'FINANCE AND ACCOUNTING', 'HR DEPARTMENT', 'TAURUS CAFE']

export async function loadDepartments() {
    const response = await fetch(`${API_URL}/departments`)

    if (!response.ok) {
        throw new Error(`Failed to load departments: ${response.status}`)
    }

    const data = await response.json()

    return (data || [])
        .map((department) => String(department.name).trim())
        .filter(Boolean)
}
export async function saveDepartments(departments) {
  const sanitized = [
    ...new Set(
      (departments || [])
        .map((department) => String(department).trim())
        .filter(Boolean)
    )
  ]

  const nextDepartments = sanitized.length
    ? sanitized
    : [...defaultDepartments]

  if (supabaseConfigured) {
    try {
      const { error: deleteError } = await supabase
        .from('departments')
        .delete()
        .not('id', 'is', null)

      if (deleteError) {
        console.error('SUPABASE DEPARTMENT DELETE ERROR:', deleteError)
        throw deleteError
      }

      const { error: insertError } = await supabase
        .from('departments')
        .insert(
          nextDepartments.map((name) => ({
            name,
          }))
        )

      if (insertError) {
        console.error('SUPABASE DEPARTMENT INSERT ERROR:', insertError)
        throw insertError
      }

      console.log('DEPARTMENTS SAVED TO SUPABASE:', nextDepartments)
    } catch (error) {
      console.error('SUPABASE DEPARTMENT SAVE ERROR:', error)
      throw error
    }
  }

  window.dispatchEvent(new Event('departments-updated'))

  return nextDepartments
}

export async function resetDepartments() {
  if (supabaseConfigured) {
    const { error } = await supabase
      .from('departments')
      .delete()
      .not('id', 'is', null)

    if (error) {
      console.error('SUPABASE DEPARTMENT RESET ERROR:', error)
      throw error
    }

    const { error: insertError } = await supabase
      .from('departments')
      .insert(
        defaultDepartments.map((name) => ({
          name,
        }))
      )

    if (insertError) {
      console.error('SUPABASE DEFAULT DEPARTMENT INSERT ERROR:', insertError)
      throw insertError
    }
  }

  window.dispatchEvent(new Event('departments-updated'))

  return [...defaultDepartments]
}


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
    const response = await fetch(`${API_URL}/employees`)

    if (!response.ok) {
        throw new Error(`Failed to load employees: ${response.status}`)
    }

    const data = await response.json()

    return (data || []).map((row, index) =>
        normalizeEmployee({
            ...row,
            image: row.image_url
                ? row.image_url.startsWith('http')
                    ? row.image_url
                    : `${LARAVEL_URL}${row.image_url}`
                : '',
            imagePosition: row.image_position || {
                x: 50,
                y: 50,
            },
        }, index)
    )
}

export async function migrateEmployeesToLaravel() {
    if (!supabaseConfigured) {
        throw new Error('Supabase is not configured.')
    }

    // Get existing employees from Supabase
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) {
        throw error
    }

    console.log(`Found ${data.length} employees in Supabase.`)

    const results = []

    for (const employee of data) {
        const response = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                id: String(employee.id),
                name: employee.name || '',
                role: employee.role || '',
                department: employee.department || '',
                description: employee.description || '',
                image_url: employee.image_url || null,
                image_position: employee.image_position || {
                    x: 50,
                    y: 50,
                },
            }),
        })

        const result = await response.json()

        if (!response.ok) {
            console.error(
                `Failed to migrate ${employee.name}:`,
                result
            )

            throw new Error(
                `Failed to migrate ${employee.name}`
            )
        }

        console.log(`Migrated: ${employee.name}`)

        results.push(result)
    }

    console.log(
        `Successfully migrated ${results.length} employees.`
    )

    return results
}

window.migrateEmployeesToLaravel = migrateEmployeesToLaravel

export async function saveEmployees(employees) {
    const normalized = (employees || []).map((employee, index) =>
        normalizeEmployee(employee, index)
    )

    try {
        // Get employees currently stored in Laravel
        const existingResponse = await fetch(`${API_URL}/employees`)

        if (!existingResponse.ok) {
            throw new Error(
                `Failed to load existing employees: ${existingResponse.status}`
            )
        }

        const existingEmployees = await existingResponse.json()

        const existingIds = new Set(
            existingEmployees.map(employee => String(employee.id))
        )

        const newIds = new Set(
            normalized.map(employee => String(employee.id))
        )

        // Create or update employees
        for (const employee of normalized) {
            const id = String(employee.id)

            const payload = {
                id,
                name: employee.name || '',
                role: employee.role || '',
                department: employee.department || '',
                description: employee.description || '',
                image_url: employee.image || null,
                image_position: employee.imagePosition || {
                    x: 50,
                    y: 50,
                },
            }

            const isExisting = existingIds.has(id)

            const response = await fetch(
                isExisting
                    ? `${API_URL}/employees/${encodeURIComponent(id)}`
                    : `${API_URL}/employees`,
                {
                    method: isExisting ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(
                        isExisting
                            ? {
                                name: payload.name,
                                role: payload.role,
                                department: payload.department,
                                description: payload.description,
                                image_url: payload.image_url,
                                image_position: payload.image_position,
                            }
                            : payload
                    ),
                }
            )

            if (!response.ok) {
                const error = await response.json().catch(() => ({}))

                console.error(
                    `LARAVEL EMPLOYEE ${
                        isExisting ? 'UPDATE' : 'CREATE'
                    } ERROR:`,
                    error
                )

                throw new Error(
                    `Failed to ${
                        isExisting ? 'update' : 'create'
                    } employee: ${employee.name}`
                )
            }

            console.log(
                `${isExisting ? 'Updated' : 'Created'}: ${employee.name}`
            )
        }

        // Delete employees removed from the Admin list
        for (const existingEmployee of existingEmployees) {
            const id = String(existingEmployee.id)

            if (!newIds.has(id)) {
                const response = await fetch(
                    `${API_URL}/employees/${encodeURIComponent(id)}`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        `Failed to delete employee: ${existingEmployee.name}`
                    )
                }

                console.log(`Deleted: ${existingEmployee.name}`)
            }
        }

        console.log(
            'EMPLOYEES SAVED TO LARAVEL:',
            normalized
        )

    } catch (error) {
        console.error(
            'LARAVEL EMPLOYEE SAVE ERROR:',
            error
        )

        throw error
    }

    // Keep localStorage temporarily for compatibility
    window.localStorage.setItem(
        storageKey,
        JSON.stringify(normalized)
    )

    window.dispatchEvent(
        new Event('employees-updated')
    )
}

export async function resetEmployees() {
  if (supabaseConfigured) await supabase.from('employees').delete().not('id', 'is', null)
  window.localStorage.removeItem(storageKey)
  window.dispatchEvent(new Event('employees-updated'))
}