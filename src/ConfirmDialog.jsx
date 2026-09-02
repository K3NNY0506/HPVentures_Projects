import { useEffect, useRef } from 'react'
import { Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'

const TONE_META = {
  create: { eyebrow: 'Create', icon: Plus },
  update: { eyebrow: 'Update', icon: Pencil },
  delete: { eyebrow: 'Delete', icon: Trash2 },
  reset: { eyebrow: 'Reset', icon: RotateCcw },
}

function ConfirmDialog({
  open,
  tone = 'update',
  title,
  message,
  detail,
  preview,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)
  const confirmRef = useRef(null)
  const dialogRef = useRef(null)
  const onCancelRef = useRef(onCancel)
  onCancelRef.current = onCancel

  useEffect(() => {
    if (!open) return undefined

    const destructive = tone === 'delete' || tone === 'reset'
    const initial = destructive ? cancelRef.current : confirmRef.current
    initial?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCancelRef.current()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = [cancelRef.current, confirmRef.current].filter(Boolean)
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement

      if (event.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
        event.preventDefault()
        last.focus()
        return
      }

      if (!event.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, tone])

  if (!open) return null

  const meta = TONE_META[tone] || TONE_META.update
  const Icon = meta.icon

  return (
    <div className="admin-confirm-overlay" onClick={onCancel} role="presentation">
      <div
        ref={dialogRef}
        className={`admin-confirm-dialog admin-confirm-${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-confirm-accent" aria-hidden="true" />
        <div className="admin-confirm-body">
          <span className="admin-confirm-icon" aria-hidden="true">
            <Icon size={22} strokeWidth={2.2} />
          </span>
          <p className="eyebrow">{meta.eyebrow}</p>
          <h2 id="admin-confirm-title">{title}</h2>
          <p id="admin-confirm-message">{message}</p>
          {detail && <p className="admin-confirm-detail">{detail}</p>}
          {preview && <img className="admin-confirm-preview" src={preview} alt="" />}
        </div>
        <div className="admin-confirm-actions">
          <button ref={cancelRef} type="button" className="admin-confirm-cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button ref={confirmRef} type="button" className="admin-confirm-accept" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
