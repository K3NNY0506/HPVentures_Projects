import { useEffect, useState } from 'react'
import logo from './images/logo.png'
import { defaultEmployees, loadDepartments, loadEmployees, resetDepartments, resetEmployees, saveDepartments, saveEmployees } from './employeeData.js'
import { defaultEvents, loadEvents, resetEvents, saveEvents } from './eventData.js'
import { supabase, supabaseConfigured } from './supabaseClient.js'
import { defaultArchiveEntries, defaultGroups, defaultWhatWeDo, loadArchiveEntries, loadGroups, loadWhatWeDo, saveSiteContent, resetSiteContent } from './siteContent.js'

const createEmptyEmployee = (department = '') => ({ name: '', role: '', department, description: '', image: '' })

function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [login, setLogin] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [departmentList, setDepartmentList] = useState(loadDepartments())
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(createEmptyEmployee(loadDepartments()[0] || ''))
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('ALL DEPARTMENTS')
  const [departmentDraft, setDepartmentDraft] = useState('')
  const [draggedEmployeeId, setDraggedEmployeeId] = useState(null)
  const [events, setEvents] = useState([])
  const [whatWeDo, setWhatWeDo] = useState({})
  const [archiveEntries, setArchiveEntries] = useState({})
  const [groups, setGroups] = useState([])
  const [contentCard, setContentCard] = useState({ category: '', title: '', text: '' })
  const [editingCard, setEditingCard] = useState(null)
  const [groupForm, setGroupForm] = useState({ name: '', category: '', description: '', url: '', logo: '' })
  const [editingGroup, setEditingGroup] = useState(null)
  const visibleEmployees = filter === 'ALL DEPARTMENTS' ? employees : employees.filter((employee) => employee.department === filter)

  const updateArchive = (key, field, value) => {
    const updated = { ...archiveEntries, [key]: { ...archiveEntries[key], [field]: value } }
    setArchiveEntries(updated)
    saveSiteContent('archive', updated)
  }

  const saveContentCard = (event) => {
    event.preventDefault()
    if (!contentCard.category.trim() || !contentCard.title.trim()) return
    const category = contentCard.category.trim()
    const updated = { ...whatWeDo, [category]: [...(whatWeDo[category] || []).filter((_, index) => index !== editingCard), { title: contentCard.title.trim(), text: contentCard.text.trim() }] }
    setWhatWeDo(updated)
    saveSiteContent('whatWeDo', updated)
    setContentCard({ category: '', title: '', text: '' })
    setEditingCard(null)
  }

  const editContentCard = (category, index) => {
    setEditingCard(index)
    setContentCard({ category, ...whatWeDo[category][index] })
  }

  const removeContentCard = (category, index) => {
    const updated = { ...whatWeDo, [category]: whatWeDo[category].filter((_, cardIndex) => cardIndex !== index) }
    setWhatWeDo(updated)
    saveSiteContent('whatWeDo', updated)
  }

  const saveGroup = (event) => {
    event.preventDefault()
    if (!groupForm.name.trim() || !groupForm.category.trim()) return
    const group = { ...groupForm, name: groupForm.name.trim(), category: groupForm.category.trim(), number: editingGroup ? groups.find((item) => item.number === editingGroup).number : String(groups.length + 1).padStart(2, '0') }
    const updated = editingGroup ? groups.map((item) => item.number === editingGroup ? group : item) : [...groups, group]
    setGroups(updated)
    saveSiteContent('groups', updated)
    setGroupForm({ name: '', category: '', description: '', url: '', logo: '' })
    setEditingGroup(null)
  }

  const editGroup = (group) => { setEditingGroup(group.number); setGroupForm({ ...group }) }
  const removeGroup = (number) => {
    if (!window.confirm('Remove this company from the groups page?')) return
    const updated = groups.filter((group) => group.number !== number)
    setGroups(updated)
    saveSiteContent('groups', updated)
  }

  const handleGroupLogo = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
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
      const [loadedEmployees, loadedEvents, loadedWhatWeDo, loadedArchive, loadedGroups] = await Promise.all([loadEmployees(), loadEvents(), loadWhatWeDo(), loadArchiveEntries(), loadGroups()])
      const loadedDepartments = loadDepartments()
      setDepartmentList(loadedDepartments)
      setEmployees(loadedEmployees)
      setEvents(loadedEvents)
      setWhatWeDo(loadedWhatWeDo)
      setArchiveEntries(loadedArchive)
      setGroups(loadedGroups)
      setForm((currentForm) => ({ ...currentForm, department: loadedEmployees.some((employee) => employee.id === editingId) ? currentForm.department : loadedDepartments[0] || '' }))
    }
    loadAdminContent()
  }, [editingId])

  const syncDepartments = (nextDepartments) => {
    const cleanedDepartments = nextDepartments.map((department) => String(department).trim()).filter(Boolean)
    const normalizedDepartments = cleanedDepartments.length ? cleanedDepartments : [...loadDepartments()]
    const savedDepartments = saveDepartments(normalizedDepartments)
    setDepartmentList(savedDepartments)
    setForm((currentForm) => ({ ...currentForm, department: savedDepartments.includes(currentForm.department) ? currentForm.department : savedDepartments[0] || '' }))
  }

  const addDepartment = () => {
    const nextDepartment = departmentDraft.trim()
    if (!nextDepartment || departmentList.includes(nextDepartment)) return
    syncDepartments([...departmentList, nextDepartment])
    setDepartmentDraft('')
  }

  const renameDepartment = (oldName, nextName) => {
    const trimmedName = nextName.trim()
    if (!trimmedName || trimmedName === oldName) return
    const nextDepartments = departmentList.map((department) => department === oldName ? trimmedName : department)
    syncDepartments(nextDepartments)
    setEmployees((currentEmployees) => currentEmployees.map((employee) => employee.department === oldName ? { ...employee, department: trimmedName } : employee))
  }

  const removeDepartment = (departmentName) => {
    if (departmentList.length <= 1) return
    const nextDepartments = departmentList.filter((department) => department !== departmentName)
    const fallbackDepartment = nextDepartments[0]
    syncDepartments(nextDepartments)
    setEmployees((currentEmployees) => currentEmployees.map((employee) => employee.department === departmentName ? { ...employee, department: fallbackDepartment } : employee))
    saveEmployees((employees || []).map((employee) => employee.department === departmentName ? { ...employee, department: fallbackDepartment } : employee))
  }

  const resetDepartmentList = () => {
    const defaults = resetDepartments()
    setDepartmentList(defaults)
    setForm((currentForm) => ({ ...currentForm, department: defaults.includes(currentForm.department) ? currentForm.department : defaults[0] || '' }))
    setEmployees((currentEmployees) => currentEmployees.map((employee) => ({ ...employee, department: defaults.includes(employee.department) ? employee.department : defaults[0] || '' })))
  }

  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((currentForm) => ({ ...currentForm, image: reader.result }))
    reader.readAsDataURL(file)
  }

  const submitForm = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.role.trim()) return
    const updatedEmployees = editingId
      ? employees.map((employee) => employee.id === editingId ? { ...form, id: editingId, name: form.name.trim(), role: form.role.trim() } : employee)
      : [...employees, { ...form, id: `employee-${Date.now()}`, name: form.name.trim(), role: form.role.trim() }]
    setEmployees(updatedEmployees)
    try {
      await saveEmployees(updatedEmployees)
    } catch (err) {
      console.error('Error saving employees:', err)
    }
    setForm(createEmptyEmployee(departmentList[0] || ''))
    setEditingId(null)
  }

  const editEmployee = (employee) => {
    setEditingId(employee.id)
    setForm({ ...employee })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const removeEmployee = (id) => {
    if (!window.confirm('Remove this employee from the staff page?')) return
    const updatedEmployees = employees.filter((employee) => employee.id !== id)
    setEmployees(updatedEmployees)
    saveEmployees(updatedEmployees)
    if (editingId === id) cancelEdit()
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm(createEmptyEmployee(departmentList[0] || ''))
  }

  const reorderEmployees = (targetId) => {
    if (!draggedEmployeeId || draggedEmployeeId === targetId) return
    const visibleIds = visibleEmployees.map((employee) => employee.id)
    const fromIndex = visibleIds.indexOf(draggedEmployeeId)
    const toIndex = visibleIds.indexOf(targetId)
    if (fromIndex < 0 || toIndex < 0) return
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

  const restoreDefaults = () => {
    if (!window.confirm('Reset all staff records to the original defaults?')) return
    resetEmployees()
    setEmployees(defaultEmployees)
    cancelEdit()
  }

  const addEventImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const updatedEvents = [...events, reader.result]
      setEvents(updatedEvents)
      saveEvents(updatedEvents)
      event.target.value = ''
    }
  }

  const replaceEventImage = (index, event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const updatedEvents = events.map((image, imageIndex) => imageIndex === index ? reader.result : image)
      setEvents(updatedEvents)
      saveEvents(updatedEvents)
      event.target.value = ''
    }
  }

  const removeEventImage = (index) => {
    if (!window.confirm('Remove this company event image?')) return
    const updatedEvents = events.filter((_, imageIndex) => imageIndex !== index)
    setEvents(updatedEvents)
    saveEvents(updatedEvents)
  }

  const restoreEventDefaults = () => {
    if (!window.confirm('Reset company event images to the original defaults?')) return
    resetEvents()
    setEvents(defaultEvents)
  }

  const submitLogin = async (event) => {
    event.preventDefault()
    if (!supabaseConfigured) {
      setLoginError('Supabase is not configured. Add the VITE_SUPABASE variables first.')
      return
    }
    const { error } = await supabase.auth.signInWithPassword({ email: login.username, password: login.password })
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
            <label>Email<input type="email" value={login.username} onChange={(event) => setLogin({ ...login, username: event.target.value })} autoComplete="username" required /></label>
            <label>Password<input type="password" value={login.password} onChange={(event) => setLogin({ ...login, password: event.target.value })} autoComplete="current-password" required /></label>
            {loginError && <p className="admin-login-error" role="alert">{loginError}</p>}
            <button className="admin-primary-button" type="submit">Sign in</button>
          </form>
          <a className="admin-back-link" href="/">Return to website</a>
        </section>
      </main>
    )
  }

  return (
    <main className="site-shell admin-page">
      <nav className="topbar" aria-label="Admin navigation">
        <a className="brand" href="/" aria-label="HP Ventures home"><img className="brand-logo" src={logo} alt="HP Ventures" /></a>
        <div className="admin-nav"><span>Admin workspace</span><a href="/staff">View staff page</a><button type="button" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      </nav>
      <section className="admin-content">
        <header className="admin-heading"><p className="eyebrow">Content management</p><h1>Staff directory.</h1><p>Manage people, departments, descriptions, and profile images.</p></header>
        <div className="admin-grid">
          <form className="admin-form" onSubmit={submitForm}>
            <div className="admin-form-heading"><h2>{editingId ? 'Edit employee' : 'Add employee'}</h2>{editingId && <button type="button" className="admin-text-button" onClick={cancelEdit}>Cancel</button>}</div>
            <label>Name<input name="name" value={form.name} onChange={updateForm} placeholder="Employee name" required /></label>
            <label>Position / Role<input name="role" value={form.role} onChange={updateForm} placeholder="Position or role" required /></label>
            <label>Department<select name="department" value={form.department} onChange={updateForm}>{departmentList.map((department) => <option key={department}>{department}</option>)}</select></label>
            <div className="admin-department-editor">
              <div className="admin-department-header"><h3>Departments</h3><button type="button" className="admin-text-button" onClick={resetDepartmentList}>Reset</button></div>
              <div className="admin-department-list">{departmentList.map((department) => <div className="admin-department-row" key={department}><input value={department} onChange={(event) => renameDepartment(department, event.target.value)} /><button type="button" className="admin-text-button" onClick={() => removeDepartment(department)} disabled={departmentList.length <= 1}>Remove</button></div>)}</div>
              <div className="admin-department-row admin-department-add"><input value={departmentDraft} onChange={(event) => setDepartmentDraft(event.target.value)} placeholder="New department name" /><button type="button" className="admin-primary-button admin-primary-button-compact" onClick={addDepartment}>Add</button></div>
            </div>
            <label>Description<textarea name="description" value={form.description} onChange={updateForm} placeholder="Short employee description" rows="5" /></label>
            <label>Profile image<input type="file" accept="image/*" onChange={handleImage} /></label>
            <div className="admin-image-actions">{form.image && <><img src={form.image} alt="Selected profile preview" /><button type="button" className="admin-text-button" onClick={() => setForm({ ...form, image: '' })}>Remove image</button></>}</div>
            <button className="admin-primary-button" type="submit">{editingId ? 'Save employee' : 'Add employee'}</button>
          </form>
          <section className="admin-list-section">
            <div className="admin-list-heading"><div><p className="eyebrow">Directory</p><h2>{employees.length} employees</h2><small>Drag employees to reorder the current department.</small></div><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter employees by department"><option>ALL DEPARTMENTS</option>{departmentList.map((department) => <option key={department}>{department}</option>)}</select></div>
            <div className="admin-list">{visibleEmployees.map((employee) => <article className={`admin-employee ${draggedEmployeeId === employee.id ? 'dragging' : ''}`} key={employee.id} draggable onDragStart={() => setDraggedEmployeeId(employee.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => reorderEmployees(employee.id)} onDragEnd={() => setDraggedEmployeeId(null)}><span className="admin-drag-handle" aria-hidden="true">↕</span>{employee.image ? <img src={employee.image} alt="" /> : <div className="admin-avatar">{employee.name.slice(0, 1) || '?'}</div>}<div className="admin-employee-copy"><strong>{employee.name}</strong><span>{employee.role}</span><small>{employee.department}</small></div><div className="admin-row-actions"><button type="button" onClick={() => editEmployee(employee)}>Edit</button><button type="button" onClick={() => removeEmployee(employee.id)}>Remove</button></div></article>)}</div>
            <button className="admin-reset-button" type="button" onClick={restoreDefaults}>Reset default staff</button>
          </section>
        </div>
        <section className="admin-events-section">
          <div className="admin-list-heading"><div><p className="eyebrow">Home page gallery</p><h2>{events.length} Company Photos</h2></div><label className="admin-upload-button">Add image<input type="file" accept="image/*" onChange={addEventImage} /></label></div>
          <div className="admin-events-grid">{events.map((image, index) => <article className="admin-event" key={`${image}-${index}`}><img src={image} alt={`Company event ${index + 1}`} /><div><strong>Event {String(index + 1).padStart(2, '0')}</strong><label className="admin-replace-button">Replace<input type="file" accept="image/*" onChange={(event) => replaceEventImage(index, event)} /></label><button type="button" onClick={() => removeEventImage(index)}>Remove</button></div></article>)}</div>
          <button className="admin-reset-button" type="button" onClick={restoreEventDefaults}>Reset default events</button>
        </section>
        <section className="admin-events-section">
          <div className="admin-list-heading"><div><p className="eyebrow">Home content</p><h2>What we do</h2></div><button className="admin-reset-button" type="button" onClick={() => { resetSiteContent('whatWeDo'); setWhatWeDo(defaultWhatWeDo) }}>Reset cards</button></div>
          <form className="admin-content-form" onSubmit={saveContentCard}><select value={contentCard.category} onChange={(event) => setContentCard({ ...contentCard, category: event.target.value })} required><option value="">Select or type a category below</option>{Object.keys(whatWeDo).map((category) => <option key={category}>{category}</option>)}</select><input value={contentCard.category} onChange={(event) => setContentCard({ ...contentCard, category: event.target.value })} placeholder="Category name" required /><input value={contentCard.title} onChange={(event) => setContentCard({ ...contentCard, title: event.target.value })} placeholder="Card title" required /><textarea value={contentCard.text} onChange={(event) => setContentCard({ ...contentCard, text: event.target.value })} placeholder="Card text" rows="3" /><button className="admin-primary-button" type="submit">{editingCard === null ? 'Add card' : 'Save card'}</button></form>
          {Object.entries(whatWeDo).map(([category, cards]) => <div className="admin-content-group" key={category}><h3>{category}</h3>{cards.map((card, index) => <div className="admin-content-row" key={`${category}-${index}`}><span><strong>{card.title}</strong><small>{card.text}</small></span><button type="button" onClick={() => editContentCard(category, index)}>Edit</button><button type="button" onClick={() => removeContentCard(category, index)}>Remove</button></div>)}</div>)}
        </section>
        <section className="admin-events-section">
          <div className="admin-list-heading"><div><p className="eyebrow">Home content</p><h2>Vision, mission & values</h2></div></div>
          {Object.entries(archiveEntries).map(([key, entry]) => <div className="admin-archive-editor" key={key}><h3>{key}</h3><input value={entry.label} onChange={(event) => updateArchive(key, 'label', event.target.value)} placeholder="Label" /><input value={entry.title} onChange={(event) => updateArchive(key, 'title', event.target.value)} placeholder="Title" /><textarea value={entry.text} onChange={(event) => updateArchive(key, 'text', event.target.value)} rows="3" placeholder="Description" /></div>)}
          <button className="admin-reset-button" type="button" onClick={() => { resetSiteContent('archive'); setArchiveEntries(defaultArchiveEntries) }}>Reset archive content</button>
        </section>
        <section className="admin-events-section">
          <div className="admin-list-heading"><div><p className="eyebrow">Portfolio content</p><h2>Groups & categories</h2></div><button className="admin-reset-button" type="button" onClick={() => { resetSiteContent('groups'); setGroups(defaultGroups) }}>Reset groups</button></div>
          <form className="admin-content-form" onSubmit={saveGroup}><input value={groupForm.name} onChange={(event) => setGroupForm({ ...groupForm, name: event.target.value })} placeholder="Company name" required /><input value={groupForm.category} onChange={(event) => setGroupForm({ ...groupForm, category: event.target.value })} placeholder="Category" required /><input value={groupForm.url} onChange={(event) => setGroupForm({ ...groupForm, url: event.target.value })} placeholder="Website URL" /><textarea value={groupForm.description} onChange={(event) => setGroupForm({ ...groupForm, description: event.target.value })} placeholder="Company description" rows="3" /><label className="admin-upload-button">Upload logo<input type="file" accept="image/*" onChange={handleGroupLogo} /></label><button className="admin-primary-button" type="submit">{editingGroup ? 'Save company' : 'Add company'}</button></form>
          <div className="admin-content-group">{groups.map((group) => <div className="admin-content-row" key={group.number}><span><strong>{group.name}</strong><small>{group.category}</small></span><button type="button" onClick={() => editGroup(group)}>Edit</button><button type="button" onClick={() => removeGroup(group.number)}>Remove</button></div>)}</div>
        </section>
      </section>
    </main>
  )
}

export default Admin
