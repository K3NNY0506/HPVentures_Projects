import { useEffect, useState } from 'react'
import logo from './images/logo.png'
import { departments, defaultEmployees, loadEmployees, resetEmployees, saveEmployees } from './employeeData.js'
import { defaultEvents, loadEvents, resetEvents, saveEvents } from './eventData.js'
import { supabase, supabaseConfigured } from './supabaseClient.js'

const emptyEmployee = { name: '', role: '', department: departments[0], description: '', image: '' }

function Admin() {
  const [authenticated, setAuthenticated] = useState(false)
  const [login, setLogin] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [employees, setEmployees] = useState(loadEmployees)
  const [form, setForm] = useState(emptyEmployee)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('ALL DEPARTMENTS')
  const [events, setEvents] = useState(loadEvents)
  const visibleEmployees = filter === 'ALL DEPARTMENTS' ? employees : employees.filter((employee) => employee.department === filter)

  useEffect(() => {
    if (!supabaseConfigured) return undefined
    supabase.auth.getSession().then(({ data }) => setAuthenticated(Boolean(data.session)))
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => setAuthenticated(Boolean(session)))
    return () => authListener.subscription.unsubscribe()
  }, [])

  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm((currentForm) => ({ ...currentForm, image: reader.result }))
    reader.readAsDataURL(file)
  }

  const submitForm = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.role.trim()) return
    const updatedEmployees = editingId
      ? employees.map((employee) => employee.id === editingId ? { ...form, id: editingId, name: form.name.trim(), role: form.role.trim() } : employee)
      : [...employees, { ...form, id: `employee-${Date.now()}`, name: form.name.trim(), role: form.role.trim() }]
    setEmployees(updatedEmployees)
    saveEmployees(updatedEmployees)
    setForm(emptyEmployee)
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
    setForm(emptyEmployee)
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
          <p>Sign in with your Supabase account to manage staff and company event content.</p>
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
            <label>Department<select name="department" value={form.department} onChange={updateForm}>{departments.map((department) => <option key={department}>{department}</option>)}</select></label>
            <label>Description<textarea name="description" value={form.description} onChange={updateForm} placeholder="Short employee description" rows="5" /></label>
            <label>Profile image<input type="file" accept="image/*" onChange={handleImage} /></label>
            <div className="admin-image-actions">{form.image && <><img src={form.image} alt="Selected profile preview" /><button type="button" className="admin-text-button" onClick={() => setForm({ ...form, image: '' })}>Remove image</button></>}</div>
            <button className="admin-primary-button" type="submit">{editingId ? 'Save employee' : 'Add employee'}</button>
          </form>
          <section className="admin-list-section">
            <div className="admin-list-heading"><div><p className="eyebrow">Directory</p><h2>{employees.length} employees</h2></div><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter employees by department"><option>ALL DEPARTMENTS</option>{departments.map((department) => <option key={department}>{department}</option>)}</select></div>
            <div className="admin-list">{visibleEmployees.map((employee) => <article className="admin-employee" key={employee.id}>{employee.image ? <img src={employee.image} alt="" /> : <div className="admin-avatar">{employee.name.slice(0, 1) || '?'}</div>}<div className="admin-employee-copy"><strong>{employee.name}</strong><span>{employee.role}</span><small>{employee.department}</small></div><div className="admin-row-actions"><button type="button" onClick={() => editEmployee(employee)}>Edit</button><button type="button" onClick={() => removeEmployee(employee.id)}>Remove</button></div></article>)}</div>
            <button className="admin-reset-button" type="button" onClick={restoreDefaults}>Reset default staff</button>
          </section>
        </div>
        <section className="admin-events-section">
          <div className="admin-list-heading"><div><p className="eyebrow">Home page gallery</p><h2>{events.length} company events</h2></div><label className="admin-upload-button">Add image<input type="file" accept="image/*" onChange={addEventImage} /></label></div>
          <div className="admin-events-grid">{events.map((image, index) => <article className="admin-event" key={`${image}-${index}`}><img src={image} alt={`Company event ${index + 1}`} /><div><strong>Event {String(index + 1).padStart(2, '0')}</strong><label className="admin-replace-button">Replace<input type="file" accept="image/*" onChange={(event) => replaceEventImage(index, event)} /></label><button type="button" onClick={() => removeEventImage(index)}>Remove</button></div></article>)}</div>
          <button className="admin-reset-button" type="button" onClick={restoreEventDefaults}>Reset default events</button>
        </section>
      </section>
    </main>
  )
}

export default Admin
