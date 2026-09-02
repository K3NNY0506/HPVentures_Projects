import { useEffect, useRef, useState } from 'react'
import logo from './images/logo.png'
import ConfirmDialog from './ConfirmDialog.jsx'
import { defaultEmployees, loadDepartments, loadEmployees, resetDepartments, resetEmployees, saveDepartments, saveEmployees } from './employeeData.js'
import { defaultEvents, loadEvents, resetEvents, saveEvents } from './eventData.js'
import { supabase, supabaseConfigured } from './supabaseClient.js'
import { defaultArchiveEntries, defaultCertifications, defaultGroups, defaultWhatWeDo, loadArchiveEntries, loadCertifications, loadGroups, loadWhatWeDo, saveSiteContent, resetSiteContent } from './siteContent.js'

const createEmptyEmployee = (department = '') => ({ name: '', role: '', department, description: '', image: '' })

const validateRequiredText = (value, fieldName, { minLength = 2, maxLength = 200 } = {}) => {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) {
    return `${fieldName} is required.`
  }
  if (trimmed.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters.`
  }
  if (trimmed.length > maxLength) {
    return `${fieldName} must be ${maxLength} characters or fewer.`
  }
  return ''
}

const validateOptionalUrl = (value) => {
  const trimmed = String(value ?? '').trim()
  if (!trimmed) return ''
  try {
    const parsed = new URL(trimmed)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol')
    }
    return ''
  } catch {
    return 'Website URL must start with http:// or https://.'
  }
}

const validateImageFile = (file, { maxSizeMb = 5 } = {}) => {
  if (!file) return 'Please choose an image file.'
  if (!file.type.startsWith('image/')) return 'Only image files are allowed.'
  if (file.size > maxSizeMb * 1024 * 1024) return `Image size must be less than ${maxSizeMb}MB.`
  return ''
}

function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [login, setLogin] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [validationNotice, setValidationNotice] = useState('')
  const [successNotice, setSuccessNotice] = useState('')
  const validationTimeoutRef = useRef(null)
  const successTimeoutRef = useRef(null)
  const [confirmDialog, setConfirmDialog] = useState(null)
  const confirmResolverRef = useRef(null)
  const [departmentList, setDepartmentList] = useState(loadDepartments())
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(createEmptyEmployee(loadDepartments()[0] || ''))
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('ALL DEPARTMENTS')
  const [departmentDraft, setDepartmentDraft] = useState('')
  const [draggedEmployeeId, setDraggedEmployeeId] = useState(null)
  const [events, setEvents] = useState([])
  const [certifications, setCertifications] = useState([])
  const [whatWeDo, setWhatWeDo] = useState({})
  const [archiveEntries, setArchiveEntries] = useState({})
  const [groups, setGroups] = useState([])
  const [contentCard, setContentCard] = useState({ category: '', title: '', text: '' })
  const [editingCard, setEditingCard] = useState(null)
  const [groupForm, setGroupForm] = useState({ name: '', category: '', description: '', url: '', logo: '' })
  const [editingGroup, setEditingGroup] = useState(null)
  const visibleEmployees = filter === 'ALL DEPARTMENTS' ? employees : employees.filter((employee) => employee.department === filter)

  const showValidationError = (message) => {
    setSuccessNotice('')
    setValidationNotice(message)
    if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current)
    validationTimeoutRef.current = setTimeout(() => setValidationNotice(''), 3000)
    return false
  }

  const showSuccessNotice = (message) => {
    setValidationNotice('')
    setSuccessNotice(message)
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    successTimeoutRef.current = setTimeout(() => setSuccessNotice(''), 2800)
  }

  const requestConfirm = (config) => {
    if (confirmResolverRef.current) {
      confirmResolverRef.current(false)
      confirmResolverRef.current = null
    }
    return new Promise((resolve) => {
      confirmResolverRef.current = resolve
      setConfirmDialog(config)
    })
  }

  const settleConfirm = (result) => {
    const resolve = confirmResolverRef.current
    confirmResolverRef.current = null
    setConfirmDialog(null)
    resolve?.(Boolean(result))
  }

  useEffect(() => () => {
    if (validationTimeoutRef.current) clearTimeout(validationTimeoutRef.current)
    if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current)
    if (confirmResolverRef.current) {
      confirmResolverRef.current(false)
      confirmResolverRef.current = null
    }
  }, [])

  // ---------- ARCHIVE (Update) ----------
  const updateArchive = (key, field, value) => {
    if (!archiveEntries[key]) {
      showValidationError('That archive item no longer exists.')
      return
    }
    const trimmedValue = String(value ?? '').trim()
    const validationMessage = field === 'label' || field === 'title'
      ? validateRequiredText(trimmedValue, field === 'label' ? 'Label' : 'Title', { minLength: 2, maxLength: 120 })
      : validateRequiredText(trimmedValue, 'Description', { minLength: 10, maxLength: 500 })
    if (validationMessage) {
      showValidationError(validationMessage)
      return
    }
    const updated = { ...archiveEntries, [key]: { ...archiveEntries[key], [field]: trimmedValue } }
    setArchiveEntries(updated)
    saveSiteContent('archive', updated)
  }

  // ---------- WHAT WE DO CARDS (Create / Update) ----------
  const saveContentCard = async (event) => {
    event.preventDefault()
    const category = contentCard.category.trim()
    const title = contentCard.title.trim()
    const text = contentCard.text.trim()

    const categoryError = validateRequiredText(category, 'Category', { minLength: 2, maxLength: 60 })
    const titleError = validateRequiredText(title, 'Card title', { minLength: 2, maxLength: 80 })
    const textError = text && text.length > 300 ? 'Card text must be 300 characters or fewer.' : ''
    const validationError = categoryError || titleError || textError
    if (validationError) {
      showValidationError(validationError)
      return
    }

    if (editingCard !== null) {
      const existingCards = whatWeDo[category]
      if (!existingCards || !existingCards[editingCard]) {
        showValidationError('The card you are editing no longer exists.')
        setEditingCard(null)
        setContentCard({ category: '', title: '', text: '' })
        return
      }
    }

    const isCreate = editingCard === null
    const confirmed = await requestConfirm({
      tone: isCreate ? 'create' : 'update',
      title: isCreate ? 'Add this content card?' : 'Save changes to this content card?',
      message: isCreate
        ? 'This card will appear in the What we do section on the home page.'
        : 'The published home page card will be updated immediately.',
      detail: `${category} · ${title}`,
      confirmLabel: isCreate ? 'Add card' : 'Save changes',
    })
    if (!confirmed) return

    const updated = {
      ...whatWeDo,
      [category]: [
        ...(whatWeDo[category] || []).filter((_, index) => index !== editingCard),
        { title, text },
      ],
    }
    setWhatWeDo(updated)
    saveSiteContent('whatWeDo', updated)
    showSuccessNotice(isCreate ? 'Content card added successfully.' : 'Content card updated successfully.')
    setContentCard({ category: '', title: '', text: '' })
    setEditingCard(null)
  }

  const editContentCard = (category, index) => {
    if (!whatWeDo[category]?.[index]) {
      showValidationError('That content card no longer exists.')
      return
    }
    setEditingCard(index)
    setContentCard({ category, ...whatWeDo[category][index] })
  }

  // ---------- WHAT WE DO CARDS (Delete) ----------
  const removeContentCard = async (category, index) => {
    const card = whatWeDo[category]?.[index]
    if (!card) {
      showValidationError('That content card no longer exists.')
      return
    }
    const confirmed = await requestConfirm({
      tone: 'delete',
      title: 'Remove this content card?',
      message: 'This card will be removed from the home page. You can add it again later.',
      detail: `${category} · ${card.title}`,
      confirmLabel: 'Remove card',
    })
    if (!confirmed) return

    const updated = {
      ...whatWeDo,
      [category]: whatWeDo[category].filter((_, cardIndex) => cardIndex !== index),
    }
    setWhatWeDo(updated)
    saveSiteContent('whatWeDo', updated)
    showSuccessNotice('Content card removed successfully.')

    if (editingCard === index && contentCard.category === category) {
      setEditingCard(null)
      setContentCard({ category: '', title: '', text: '' })
    }
  }

  // ---------- GROUPS (Create / Update) ----------
  const saveGroup = async (event) => {
    event.preventDefault()
    const name = groupForm.name.trim()
    const category = groupForm.category.trim()
    const url = groupForm.url.trim()
    const description = groupForm.description.trim()

    const nameError = validateRequiredText(name, 'Company name', { minLength: 2, maxLength: 100 })
    const categoryError = validateRequiredText(category, 'Category', { minLength: 2, maxLength: 60 })
    const urlError = validateOptionalUrl(url)
    const descriptionError = description && description.length > 500
      ? 'Company description must be 500 characters or fewer.'
      : ''
    const validationError = nameError || categoryError || urlError || descriptionError
    if (validationError) {
      showValidationError(validationError)
      return
    }

    if (editingGroup) {
      const stillExists = groups.some((item) => item.number === editingGroup)
      if (!stillExists) {
        showValidationError('The company you are editing no longer exists.')
        setEditingGroup(null)
        setGroupForm({ name: '', category: '', description: '', url: '', logo: '' })
        return
      }
    }

    const isCreate = !editingGroup
    const confirmed = await requestConfirm({
      tone: isCreate ? 'create' : 'update',
      title: isCreate ? 'Add this company?' : 'Save changes to this company?',
      message: isCreate
        ? 'This company will appear on the groups page.'
        : 'The groups page listing will be updated immediately.',
      detail: `${name} · ${category}`,
      preview: groupForm.logo || undefined,
      confirmLabel: isCreate ? 'Add company' : 'Save changes',
    })
    if (!confirmed) return

    const group = {
      ...groupForm,
      name,
      category,
      url,
      description,
      number: editingGroup
        ? groups.find((item) => item.number === editingGroup)?.number || String(groups.length + 1).padStart(2, '0')
        : String(groups.length + 1).padStart(2, '0'),
    }
    const updated = editingGroup
      ? groups.map((item) => (item.number === editingGroup ? group : item))
      : [...groups, group]
    setGroups(updated)
    saveSiteContent('groups', updated)
    showSuccessNotice(isCreate ? 'Company added successfully.' : 'Company updated successfully.')
    setGroupForm({ name: '', category: '', description: '', url: '', logo: '' })
    setEditingGroup(null)
  }

  const editGroup = (group) => {
    if (!group || !groups.some((g) => g.number === group.number)) {
      showValidationError('That company no longer exists.')
      return
    }
    setEditingGroup(group.number)
    setGroupForm({ ...group })
  }

  // ---------- GROUPS (Delete) ----------
  const removeGroup = async (number) => {
    const target = groups.find((group) => group.number === number)
    if (!target) {
      showValidationError('This company is already missing from the list.')
      return
    }
    const confirmed = await requestConfirm({
      tone: 'delete',
      title: 'Remove this company?',
      message: 'This company will be removed from the groups page.',
      detail: `${target.name} · ${target.category}`,
      preview: target.logo || undefined,
      confirmLabel: 'Remove company',
    })
    if (!confirmed) return
    const updated = groups.filter((group) => group.number !== number)
    setGroups(updated)
    saveSiteContent('groups', updated)
    showSuccessNotice('Company removed successfully.')

    if (editingGroup === number) {
      setEditingGroup(null)
      setGroupForm({ name: '', category: '', description: '', url: '', logo: '' })
    }
  }

  const handleGroupLogo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const imageError = validateImageFile(file)
    if (imageError) {
      showValidationError(imageError)
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => setGroupForm((current) => ({ ...current, logo: reader.result }))
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!supabaseConfigured) return undefined
    supabase.auth.getSession().then(({ data }) => setAuthenticated(Boolean(data.session)))
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => setAuthenticated(Boolean(session)))
    return () => authListener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const loadAdminContent = async () => {
      const [loadedEmployees, loadedEvents, loadedWhatWeDo, loadedArchive, loadedGroups, loadedCertifications] =
        await Promise.all([
          loadEmployees(),
          loadEvents(),
          loadWhatWeDo(),
          loadArchiveEntries(),
          loadGroups(),
          loadCertifications(),
        ])
      const loadedDepartments = loadDepartments()
      setDepartmentList(loadedDepartments)
      setEmployees(loadedEmployees)
      setEvents(loadedEvents)
      setCertifications(loadedCertifications)
      setWhatWeDo(loadedWhatWeDo)
      setArchiveEntries(loadedArchive)
      setGroups(loadedGroups)
      setForm((currentForm) => ({
        ...currentForm,
        department: loadedEmployees.some((employee) => employee.id === editingId)
          ? currentForm.department
          : loadedDepartments[0] || '',
      }))
    }
    loadAdminContent()
  }, [editingId])

  const syncDepartments = (nextDepartments) => {
    const cleanedDepartments = nextDepartments.map((department) => String(department).trim()).filter(Boolean)
    const normalizedDepartments = cleanedDepartments.length ? cleanedDepartments : [...loadDepartments()]
    const savedDepartments = saveDepartments(normalizedDepartments)
    setDepartmentList(savedDepartments)
    setForm((currentForm) => ({
      ...currentForm,
      department: savedDepartments.includes(currentForm.department)
        ? currentForm.department
        : savedDepartments[0] || '',
    }))
  }

  // ---------- DEPARTMENTS (Create) ----------
  const addDepartment = async () => {
    const nextDepartment = departmentDraft.trim()
    const validationMessage = validateRequiredText(nextDepartment, 'Department name', {
      minLength: 2,
      maxLength: 60,
    })
    if (validationMessage) {
      showValidationError(validationMessage)
      return
    }
    if (departmentList.includes(nextDepartment)) {
      showValidationError('This department already exists.')
      return
    }
    const confirmed = await requestConfirm({
      tone: 'create',
      title: 'Add this department?',
      message: 'It will become available when adding or editing employees.',
      detail: nextDepartment,
      confirmLabel: 'Add department',
    })
    if (!confirmed) return

    syncDepartments([...departmentList, nextDepartment])
    setDepartmentDraft('')
    showSuccessNotice('Department added successfully.')
  }

  // ---------- DEPARTMENTS (Update / Rename) ----------
  const renameDepartment = (oldName, nextName) => {
    const trimmedName = nextName.trim()
    const validationMessage = validateRequiredText(trimmedName, 'Department name', {
      minLength: 2,
      maxLength: 60,
    })
    if (validationMessage) {
      showValidationError(validationMessage)
      return
    }
    if (trimmedName === oldName) return
    if (departmentList.includes(trimmedName) && trimmedName !== oldName) {
      showValidationError('Department names must be unique.')
      return
    }
    if (!departmentList.includes(oldName)) {
      showValidationError('That department no longer exists.')
      return
    }
    const nextDepartments = departmentList.map((department) =>
      department === oldName ? trimmedName : department
    )
    syncDepartments(nextDepartments)
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.department === oldName ? { ...employee, department: trimmedName } : employee
      )
    )
  }

  // ---------- DEPARTMENTS (Delete) ----------
  const removeDepartment = async (departmentName) => {
    if (departmentList.length <= 1) {
      showValidationError('At least one department must remain.')
      return
    }
    const exists = departmentList.includes(departmentName)
    if (!exists) {
      showValidationError('That department no longer exists.')
      return
    }
    const confirmed = await requestConfirm({
      tone: 'delete',
      title: 'Remove this department?',
      message: 'Employees in this department will be moved to another department.',
      detail: departmentName,
      confirmLabel: 'Remove department',
    })
    if (!confirmed) return

    const nextDepartments = departmentList.filter((department) => department !== departmentName)
    const fallbackDepartment = nextDepartments[0]
    syncDepartments(nextDepartments)
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) =>
        employee.department === departmentName
          ? { ...employee, department: fallbackDepartment }
          : employee
      )
    )
    saveEmployees(
      (employees || []).map((employee) =>
        employee.department === departmentName
          ? { ...employee, department: fallbackDepartment }
          : employee
      )
    )
    showSuccessNotice('Department removed successfully.')
  }

  const resetDepartmentList = async () => {
    const confirmed = await requestConfirm({
      tone: 'reset',
      title: 'Reset all departments?',
      message: 'Departments will return to the original defaults. Employees will be reassigned if needed.',
      confirmLabel: 'Reset departments',
    })
    if (!confirmed) return
    const defaults = resetDepartments()
    setDepartmentList(defaults)
    setForm((currentForm) => ({
      ...currentForm,
      department: defaults.includes(currentForm.department) ? currentForm.department : defaults[0] || '',
    }))
    setEmployees((currentEmployees) =>
      currentEmployees.map((employee) => ({
        ...employee,
        department: defaults.includes(employee.department) ? employee.department : defaults[0] || '',
      }))
    )
    showSuccessNotice('Departments reset to defaults.')
  }

  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const imageError = validateImageFile(file)
    if (imageError) {
      showValidationError(imageError)
      event.target.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => setForm((currentForm) => ({ ...currentForm, image: reader.result }))
    reader.readAsDataURL(file)
  }

  // ---------- EMPLOYEES (Create / Update) ----------
  const submitForm = async (event) => {
    event.preventDefault()
    const name = form.name.trim()
    const role = form.role.trim()
    const department = form.department.trim()
    const description = form.description.trim()

    const nameError = validateRequiredText(name, 'Employee name', { minLength: 2, maxLength: 100 })
    const roleError = validateRequiredText(role, 'Role', { minLength: 2, maxLength: 80 })
    const departmentError = validateRequiredText(department, 'Department', { minLength: 2, maxLength: 60 })
    const descriptionError =
      description && description.length > 500 ? 'Description must be 500 characters or fewer.' : ''
    const departmentExistsError = !departmentList.includes(department)
      ? 'Please select a valid department.'
      : ''

    const validationError =
      nameError || roleError || departmentError || descriptionError || departmentExistsError
    if (validationError) {
      showValidationError(validationError)
      return
    }

    if (editingId) {
      const stillExists = employees.some((employee) => employee.id === editingId)
      if (!stillExists) {
        showValidationError('The employee you are editing no longer exists.')
        cancelEdit()
        return
      }
    }

    const isCreate = !editingId
    const confirmed = await requestConfirm({
      tone: isCreate ? 'create' : 'update',
      title: isCreate ? 'Add this employee?' : 'Save changes to this employee?',
      message: isCreate
        ? 'This person will appear in the staff directory.'
        : 'The staff page listing will be updated immediately.',
      detail: `${name} · ${role}`,
      preview: form.image || undefined,
      confirmLabel: isCreate ? 'Add employee' : 'Save changes',
    })
    if (!confirmed) return

    const updatedEmployees = editingId
      ? employees.map((employee) =>
          employee.id === editingId
            ? { ...form, id: editingId, name, role, department, description }
            : employee
        )
      : [...employees, { ...form, id: `employee-${Date.now()}`, name, role, department, description }]

    setEmployees(updatedEmployees)
    try {
      await saveEmployees(updatedEmployees)
      showSuccessNotice(isCreate ? 'Employee added successfully.' : 'Employee updated successfully.')
    } catch (err) {
      console.error('Error saving employees:', err)
      showValidationError('Unable to save this employee right now. Please try again.')
      return
    }
    setForm(createEmptyEmployee(departmentList[0] || ''))
    setEditingId(null)
  }

  const editEmployee = (employee) => {
    if (!employee || !employees.some((e) => e.id === employee.id)) {
      showValidationError('That employee no longer exists.')
      return
    }
    setEditingId(employee.id)
    setForm({ ...employee })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ---------- EMPLOYEES (Delete) ----------
  const removeEmployee = async (id) => {
    const existingEmployee = employees.find((employee) => employee.id === id)
    if (!existingEmployee) {
      showValidationError('This employee is already missing from the directory.')
      return
    }
    const confirmed = await requestConfirm({
      tone: 'delete',
      title: 'Remove this employee?',
      message: 'This person will be removed from the staff page.',
      detail: `${existingEmployee.name} · ${existingEmployee.role}`,
      preview: existingEmployee.image || undefined,
      confirmLabel: 'Remove employee',
    })
    if (!confirmed) return
    const updatedEmployees = employees.filter((employee) => employee.id !== id)
    setEmployees(updatedEmployees)
    saveEmployees(updatedEmployees)
    showSuccessNotice('Employee removed successfully.')
    if (editingId === id) cancelEdit()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(createEmptyEmployee(departmentList[0] || ''))
  }

  // ---------- EMPLOYEES (Reorder) ----------
  const reorderEmployees = (targetId) => {
    if (!draggedEmployeeId || draggedEmployeeId === targetId) return
    const visibleIds = visibleEmployees.map((employee) => employee.id)
    const fromIndex = visibleIds.indexOf(draggedEmployeeId)
    const toIndex = visibleIds.indexOf(targetId)
    if (fromIndex < 0 || toIndex < 0) {
      showValidationError('Unable to reorder this employee because the list is invalid.')
      return
    }
    const reorderedVisible = [...visibleEmployees]
    const [movedEmployee] = reorderedVisible.splice(fromIndex, 1)
    reorderedVisible.splice(toIndex, 0, movedEmployee)
    const visibleIdSet = new Set(visibleIds)
    let reorderedIndex = 0
    const updatedEmployees = employees.map((employee) => {
      if (!visibleIdSet.has(employee.id)) return employee
      return reorderedVisible[reorderedIndex++]
    })
    setEmployees(updatedEmployees)
    saveEmployees(updatedEmployees)
  }

  const restoreDefaults = async () => {
    const confirmed = await requestConfirm({
      tone: 'reset',
      title: 'Reset all staff records?',
      message: 'All employee records will be replaced with the original defaults.',
      confirmLabel: 'Reset staff',
    })
    if (!confirmed) return
    resetEmployees()
    setEmployees(defaultEmployees)
    cancelEdit()
    showSuccessNotice('Staff records reset to defaults.')
  }

  // ---------- EVENTS (Create) ----------
  const addEventImage = async (event) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return
    const imageError = validateImageFile(file)
    if (imageError) {
      showValidationError(imageError)
      input.value = ''
      return
    }
    const preview = URL.createObjectURL(file)
    const confirmed = await requestConfirm({
      tone: 'create',
      title: 'Add this image?',
      message: 'It will appear in the company events gallery on the home page.',
      detail: file.name,
      preview,
      confirmLabel: 'Add image',
    })
    URL.revokeObjectURL(preview)
    if (!confirmed) {
      input.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const updatedEvents = [...events, reader.result]
      setEvents(updatedEvents)
      saveEvents(updatedEvents)
      input.value = ''
      showSuccessNotice('Event image added successfully.')
    }
    reader.readAsDataURL(file)
  }

  // ---------- EVENTS (Update / Replace) ----------
  const replaceEventImage = async (index, event) => {
    const input = event.target
    if (index < 0 || index >= events.length) {
      showValidationError('That event image could not be found.')
      input.value = ''
      return
    }
    const file = input.files?.[0]
    if (!file) return
    const imageError = validateImageFile(file)
    if (imageError) {
      showValidationError(imageError)
      input.value = ''
      return
    }
    const preview = URL.createObjectURL(file)
    const confirmed = await requestConfirm({
      tone: 'update',
      title: 'Replace this event image?',
      message: 'The current gallery image will be overwritten.',
      detail: file.name,
      preview,
      confirmLabel: 'Replace image',
    })
    URL.revokeObjectURL(preview)
    if (!confirmed) {
      input.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const updatedEvents = events.map((image, imageIndex) =>
        imageIndex === index ? reader.result : image
      )
      setEvents(updatedEvents)
      saveEvents(updatedEvents)
      input.value = ''
      showSuccessNotice('Event image replaced successfully.')
    }
    reader.readAsDataURL(file)
  }

  // ---------- EVENTS (Delete) ----------
  const removeEventImage = async (index) => {
    if (index < 0 || index >= events.length) {
      showValidationError('That event image could not be found.')
      return
    }
    const confirmed = await requestConfirm({
      tone: 'delete',
      title: 'Remove this event image?',
      message: 'This image will be removed from the company events gallery.',
      detail: `Event ${String(index + 1).padStart(2, '0')}`,
      preview: events[index],
      confirmLabel: 'Remove image',
    })
    if (!confirmed) return
    const updatedEvents = events.filter((_, imageIndex) => imageIndex !== index)
    setEvents(updatedEvents)
    saveEvents(updatedEvents)
    showSuccessNotice('Event image removed successfully.')
  }

  const restoreEventDefaults = async () => {
    const confirmed = await requestConfirm({
      tone: 'reset',
      title: 'Reset company event images?',
      message: 'All gallery images will be replaced with the original defaults.',
      confirmLabel: 'Reset events',
    })
    if (!confirmed) return
    resetEvents()
    setEvents(defaultEvents)
    showSuccessNotice('Event images reset to defaults.')
  }

  // ---------- CERTIFICATIONS (Create) ----------
  const addCertificationImage = async (event) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return
    const imageError = validateImageFile(file)
    if (imageError) {
      showValidationError(imageError)
      input.value = ''
      return
    }
    const preview = URL.createObjectURL(file)
    const confirmed = await requestConfirm({
      tone: 'create',
      title: 'Add this certification?',
      message: 'This image will appear among the floating certification badges.',
      detail: file.name,
      preview,
      confirmLabel: 'Add certificate',
    })
    URL.revokeObjectURL(preview)
    if (!confirmed) {
      input.value = ''
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const updatedCertifications = [...certifications, reader.result]
      setCertifications(updatedCertifications)
      saveSiteContent('certifications', updatedCertifications)
      input.value = ''
      showSuccessNotice('Certification added successfully.')
    }
    reader.readAsDataURL(file)
  }

  // ---------- CERTIFICATIONS (Delete) ----------
  const removeCertificationImage = async (index) => {
    if (index < 0 || index >= certifications.length) {
      showValidationError('That certification image could not be found.')
      return
    }
    const confirmed = await requestConfirm({
      tone: 'delete',
      title: 'Remove this certification?',
      message: 'This badge will no longer appear on the site.',
      detail: `Certificate ${String(index + 1).padStart(2, '0')}`,
      preview: certifications[index],
      confirmLabel: 'Remove certificate',
    })
    if (!confirmed) return
    const updatedCertifications = certifications.filter((_, certIndex) => certIndex !== index)
    setCertifications(updatedCertifications)
    saveSiteContent('certifications', updatedCertifications)
    showSuccessNotice('Certification removed successfully.')
  }

  const restoreCertificationDefaults = async () => {
    const confirmed = await requestConfirm({
      tone: 'reset',
      title: 'Reset certifications?',
      message: 'All certificates will be replaced with the default images.',
      confirmLabel: 'Reset certificates',
    })
    if (!confirmed) return
    setCertifications(defaultCertifications)
    saveSiteContent('certifications', defaultCertifications)
    showSuccessNotice('Certifications reset to defaults.')
  }

  const restoreWhatWeDoDefaults = async () => {
    const confirmed = await requestConfirm({
      tone: 'reset',
      title: 'Reset all What we do cards?',
      message: 'All custom cards will be replaced with the original defaults.',
      confirmLabel: 'Reset cards',
    })
    if (!confirmed) return
    resetSiteContent('whatWeDo')
    setWhatWeDo(defaultWhatWeDo)
    showSuccessNotice('What we do cards reset to defaults.')
  }

  const restoreArchiveDefaults = async () => {
    const confirmed = await requestConfirm({
      tone: 'reset',
      title: 'Reset archive content?',
      message: 'Vision, mission, and values will return to the original defaults.',
      confirmLabel: 'Reset archive',
    })
    if (!confirmed) return
    resetSiteContent('archive')
    setArchiveEntries(defaultArchiveEntries)
    showSuccessNotice('Archive content reset to defaults.')
  }

  const restoreGroupDefaults = async () => {
    const confirmed = await requestConfirm({
      tone: 'reset',
      title: 'Reset all groups?',
      message: 'All companies will be replaced with the original defaults.',
      confirmLabel: 'Reset groups',
    })
    if (!confirmed) return
    resetSiteContent('groups')
    setGroups(defaultGroups)
    showSuccessNotice('Groups reset to defaults.')
  }

  // ---------- LOGIN ----------
  const submitLogin = async (event) => {
    event.preventDefault()
    if (!supabaseConfigured) {
      setLoginError('Supabase is not configured. Add the VITE_SUPABASE variables first.')
      return
    }

    const email = login.username.trim()
    const password = login.password

    if (!email) {
      setLoginError('Email is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLoginError('Please enter a valid email address.')
      return
    }
    if (!password) {
      setLoginError('Password is required.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (!error) {
      setLoginError('')
    } else {
      setLoginError(error.message)
    }
  }

  if (!authenticated) {
    return (
      <main className="site-shell admin-page admin-login-page">
        <section className="admin-login-panel">
          <img className="admin-login-logo" src={logo} alt="HP Ventures" />
          <p className="eyebrow">Restricted area</p>
          <h1>Admin sign in.</h1>
          <p>Sign in with your admin account to manage staff and company event content.</p>
          <form className="admin-form" onSubmit={submitLogin}>
            <label>
              Email
              <input
                type="email"
                value={login.username}
                onChange={(event) => setLogin({ ...login, username: event.target.value })}
                autoComplete="username"
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={login.password}
                onChange={(event) => setLogin({ ...login, password: event.target.value })}
                autoComplete="current-password"
                required
              />
            </label>
            {loginError && (
              <p className="admin-login-error" role="alert">
                {loginError}
              </p>
            )}
            <button className="admin-primary-button" type="submit">
              Sign in
            </button>
          </form>
          <a className="admin-back-link" href="/">
            Return to website
          </a>
        </section>
      </main>
    )
  }

  return (
    <main className="site-shell admin-page">
      {validationNotice && (
        <div className="admin-validation-toast" role="alert" aria-live="assertive">
          {validationNotice}
        </div>
      )}
      {successNotice && (
        <div className="admin-success-toast" role="status" aria-live="polite">
          {successNotice}
        </div>
      )}
      <nav className="topbar" aria-label="Admin navigation">
        <a className="brand" href="/" aria-label="HP Ventures home">
          <img className="brand-logo" src={logo} alt="HP Ventures" />
        </a>
        <div className="admin-nav">
          <span>Admin workspace</span>
          <a href="/staff">View staff page</a>
          <button type="button" onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </div>
      </nav>
      <section className="admin-content">
        <header className="admin-heading">
          <p className="eyebrow">Content management</p>
          <h1>Staff directory.</h1>
          <p>Manage people, departments, descriptions, and profile images.</p>
        </header>
        <div className="admin-grid">
          <form className="admin-form" onSubmit={submitForm}>
            <div className="admin-form-heading">
              <h2>{editingId ? 'Edit employee' : 'Add employee'}</h2>
              {editingId && (
                <button type="button" className="admin-text-button" onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>
            <label>
              Name
              <input name="name" value={form.name} onChange={updateForm} placeholder="Employee name" required />
            </label>
            <label>
              Position / Role
              <input
                name="role"
                value={form.role}
                onChange={updateForm}
                placeholder="Position or role"
                required
              />
            </label>
            <label>
              Department
              <select name="department" value={form.department} onChange={updateForm}>
                {departmentList.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            </label>
            <div className="admin-department-editor">
              <div className="admin-department-header">
                <h3>Departments</h3>
                <button type="button" className="admin-text-button" onClick={resetDepartmentList}>
                  Reset
                </button>
              </div>
              <div className="admin-department-list">
                {departmentList.map((department) => (
                  <div className="admin-department-row" key={department}>
                    <input
                      value={department}
                      onChange={(event) => renameDepartment(department, event.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-text-button"
                      onClick={() => removeDepartment(department)}
                      disabled={departmentList.length <= 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="admin-department-row admin-department-add">
                <input
                  value={departmentDraft}
                  onChange={(event) => setDepartmentDraft(event.target.value)}
                  placeholder="New department name"
                />
                <button
                  type="button"
                  className="admin-primary-button admin-primary-button-compact"
                  onClick={addDepartment}
                >
                  Add
                </button>
              </div>
            </div>
            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={updateForm}
                placeholder="Short employee description"
                rows="5"
              />
            </label>
            <label>
              Profile image
              <input type="file" accept="image/*" onChange={handleImage} />
            </label>
            <div className="admin-image-actions">
              {form.image && (
                <>
                  <img src={form.image} alt="Selected profile preview" />
                  <button
                    type="button"
                    className="admin-text-button"
                    onClick={() => setForm({ ...form, image: '' })}
                  >
                    Remove image
                  </button>
                </>
              )}
            </div>
            <button className="admin-primary-button" type="submit">
              {editingId ? 'Save employee' : 'Add employee'}
            </button>
          </form>
          <section className="admin-list-section">
            <div className="admin-list-heading">
              <div>
                <p className="eyebrow">Directory</p>
                <h2>{employees.length} employees</h2>
                <small>Drag employees to reorder the current department.</small>
              </div>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter employees by department"
              >
                <option>ALL DEPARTMENTS</option>
                {departmentList.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            </div>
            <div className="admin-list">
              {visibleEmployees.map((employee) => (
                <article
                  className={`admin-employee ${draggedEmployeeId === employee.id ? 'dragging' : ''}`}
                  key={employee.id}
                  draggable
                  onDragStart={() => setDraggedEmployeeId(employee.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => reorderEmployees(employee.id)}
                  onDragEnd={() => setDraggedEmployeeId(null)}
                >
                  <span className="admin-drag-handle" aria-hidden="true">
                    ↕
                  </span>
                  {employee.image ? (
                    <img src={employee.image} alt="" />
                  ) : (
                    <div className="admin-avatar">{employee.name.slice(0, 1) || '?'}</div>
                  )}
                  <div className="admin-employee-copy">
                    <strong>{employee.name}</strong>
                    <span>{employee.role}</span>
                    <small>{employee.department}</small>
                  </div>
                  <div className="admin-row-actions">
                    <button type="button" onClick={() => editEmployee(employee)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => removeEmployee(employee.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <button className="admin-reset-button" type="button" onClick={restoreDefaults}>
              Reset default staff
            </button>
          </section>
        </div>

        {/* Certifications */}
        <section className="admin-events-section">
          <div className="admin-list-heading">
            <div>
              <p className="eyebrow">Floating badges</p>
              <h2>{certifications.length} Certifications</h2>
            </div>
            <label className="admin-upload-button">
              Add certificate
              <input type="file" accept="image/*" onChange={addCertificationImage} />
            </label>
          </div>
          <div className="admin-events-grid">
            {certifications.map((image, index) => (
              <article className="admin-event" key={`${image}-${index}`}>
                <img src={image} alt={`Certification ${index + 1}`} />
                <div>
                  <strong>Certificate {String(index + 1).padStart(2, '0')}</strong>
                  <button type="button" onClick={() => removeCertificationImage(index)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button className="admin-reset-button" type="button" onClick={restoreCertificationDefaults}>
            Reset default certificates
          </button>
        </section>

        {/* Events */}
        <section className="admin-events-section">
          <div className="admin-list-heading">
            <div>
              <p className="eyebrow">Home page gallery</p>
              <h2>{events.length} Company Photos</h2>
            </div>
            <label className="admin-upload-button">
              Add image
              <input type="file" accept="image/*" onChange={addEventImage} />
            </label>
          </div>
          <div className="admin-events-grid">
            {events.map((image, index) => (
              <article className="admin-event" key={`${image}-${index}`}>
                <img src={image} alt={`Company event ${index + 1}`} />
                <div>
                  <strong>Event {String(index + 1).padStart(2, '0')}</strong>
                  <label className="admin-replace-button">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => replaceEventImage(index, event)}
                    />
                  </label>
                  <button type="button" onClick={() => removeEventImage(index)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button className="admin-reset-button" type="button" onClick={restoreEventDefaults}>
            Reset default events
          </button>
        </section>

        {/* What we do */}
        <section className="admin-events-section">
          <div className="admin-list-heading">
            <div>
              <p className="eyebrow">Home content</p>
              <h2>What we do</h2>
            </div>
            <button
              className="admin-reset-button"
              type="button"
              onClick={restoreWhatWeDoDefaults}
            >
              Reset cards
            </button>
          </div>
          <form className="admin-content-form" onSubmit={saveContentCard}>
            <select
              value={contentCard.category}
              onChange={(event) => setContentCard({ ...contentCard, category: event.target.value })}
              required
            >
              <option value="">Select or type a category below</option>
              {Object.keys(whatWeDo).map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <input
              value={contentCard.category}
              onChange={(event) => setContentCard({ ...contentCard, category: event.target.value })}
              placeholder="Category name"
              required
            />
            <input
              value={contentCard.title}
              onChange={(event) => setContentCard({ ...contentCard, title: event.target.value })}
              placeholder="Card title"
              required
            />
            <textarea
              value={contentCard.text}
              onChange={(event) => setContentCard({ ...contentCard, text: event.target.value })}
              placeholder="Card text"
              rows="3"
            />
            <button className="admin-primary-button" type="submit">
              {editingCard === null ? 'Add card' : 'Save card'}
            </button>
          </form>
          {Object.entries(whatWeDo).map(([category, cards]) => (
            <div className="admin-content-group" key={category}>
              <h3>{category}</h3>
              {cards.map((card, index) => (
                <div className="admin-content-row" key={`${category}-${index}`}>
                  <span>
                    <strong>{card.title}</strong>
                    <small>{card.text}</small>
                  </span>
                  <button type="button" onClick={() => editContentCard(category, index)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => removeContentCard(category, index)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* Archive */}
        <section className="admin-events-section">
          <div className="admin-list-heading">
            <div>
              <p className="eyebrow">Home content</p>
              <h2>Vision, mission & values</h2>
            </div>
          </div>
          {Object.entries(archiveEntries).map(([key, entry]) => (
            <div className="admin-archive-editor" key={key}>
              <h3>{key}</h3>
              <input
                value={entry.label}
                onChange={(event) => updateArchive(key, 'label', event.target.value)}
                placeholder="Label"
              />
              <input
                value={entry.title}
                onChange={(event) => updateArchive(key, 'title', event.target.value)}
                placeholder="Title"
              />
              <textarea
                value={entry.text}
                onChange={(event) => updateArchive(key, 'text', event.target.value)}
                rows="3"
                placeholder="Description"
              />
            </div>
          ))}
          <button
            className="admin-reset-button"
            type="button"
            onClick={restoreArchiveDefaults}
          >
            Reset archive content
          </button>
        </section>

        {/* Groups */}
        <section className="admin-events-section">
          <div className="admin-list-heading">
            <div>
              <p className="eyebrow">Portfolio content</p>
              <h2>Groups & categories</h2>
            </div>
            <button
              className="admin-reset-button"
              type="button"
              onClick={restoreGroupDefaults}
            >
              Reset groups
            </button>
          </div>
          <form className="admin-content-form" onSubmit={saveGroup}>
            <input
              value={groupForm.name}
              onChange={(event) => setGroupForm({ ...groupForm, name: event.target.value })}
              placeholder="Company name"
              required
            />
            <input
              value={groupForm.category}
              onChange={(event) => setGroupForm({ ...groupForm, category: event.target.value })}
              placeholder="Category"
              required
            />
            <input
              value={groupForm.url}
              onChange={(event) => setGroupForm({ ...groupForm, url: event.target.value })}
              placeholder="Website URL"
            />
            <textarea
              value={groupForm.description}
              onChange={(event) => setGroupForm({ ...groupForm, description: event.target.value })}
              placeholder="Company description"
              rows="3"
            />
            <label className="admin-upload-button">
              Upload logo
              <input type="file" accept="image/*" onChange={handleGroupLogo} />
            </label>
            <button className="admin-primary-button" type="submit">
              {editingGroup ? 'Save company' : 'Add company'}
            </button>
          </form>
          <div className="admin-content-group">
            {groups.map((group) => (
              <div className="admin-content-row" key={group.number}>
                <span>
                  <strong>{group.name}</strong>
                  <small>{group.category}</small>
                </span>
                <button type="button" onClick={() => editGroup(group)}>
                  Edit
                </button>
                <button type="button" onClick={() => removeGroup(group.number)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>
      </section>
      <ConfirmDialog
        open={Boolean(confirmDialog)}
        tone={confirmDialog?.tone}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        detail={confirmDialog?.detail}
        preview={confirmDialog?.preview}
        confirmLabel={confirmDialog?.confirmLabel}
        cancelLabel={confirmDialog?.cancelLabel}
        onConfirm={() => settleConfirm(true)}
        onCancel={() => settleConfirm(false)}
      />
    </main>
  )
}

export default Admin