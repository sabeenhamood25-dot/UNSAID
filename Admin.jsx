import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'clamp(3rem, 8vh, 5rem) 1.5rem 5rem',
  },
  inner: {
    width: '100%',
    maxWidth: '600px',
  },
  loginWrap: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  loginInner: {
    maxWidth: '340px',
    width: '100%',
    textAlign: 'center',
  },
  loginTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    color: 'var(--ink)',
    marginBottom: '0.4rem',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 0.2s forwards',
  },
  loginSub: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.78rem',
    color: 'var(--ink-whisper)',
    marginBottom: '2.5rem',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 0.5s forwards',
  },
  input: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--border)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
    color: 'var(--ink)',
    padding: '0.6rem 0',
    marginBottom: '1.5rem',
    outline: 'none',
    letterSpacing: '0.02em',
    transition: 'border-color 0.2s ease',
    display: 'block',
  },
  loginBtn: {
    background: 'none',
    border: '1px solid var(--border)',
    fontFamily: 'var(--font-serif)',
    fontSize: '0.9rem',
    color: 'var(--ink-faded)',
    padding: '0.6rem 2rem',
    cursor: 'pointer',
    letterSpacing: '0.1em',
    transition: 'all 0.2s ease',
    marginTop: '0.5rem',
  },
  loginError: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.78rem',
    color: 'var(--rust)',
    marginTop: '1rem',
  },
  header: {
    marginBottom: '2.5rem',
    opacity: 0,
    animation: 'fadeIn 0.7s ease 0.1s forwards',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.5rem',
    color: 'var(--ink)',
    letterSpacing: '-0.01em',
  },
  titleSub: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.75rem',
    color: 'var(--ink-whisper)',
    marginTop: '0.3rem',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.72rem',
    color: 'var(--ink-whisper)',
    cursor: 'pointer',
    letterSpacing: '0.05em',
    transition: 'color 0.2s ease',
  },
  tabs: {
    display: 'flex',
    gap: '1.8rem',
    borderBottom: '1px solid var(--border)',
    marginBottom: '2rem',
    opacity: 0,
    animation: 'fadeIn 0.7s ease 0.3s forwards',
  },
  tab: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.82rem',
    cursor: 'pointer',
    padding: '0 0 0.8rem',
    letterSpacing: '0.02em',
    transition: 'color 0.2s ease',
  },
  card: {
    borderTop: '1px solid var(--border)',
    padding: '1.4rem 0',
    opacity: 0,
    animation: 'fadeUp 0.5s ease forwards',
  },
  cardText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    lineHeight: '1.75',
    color: 'var(--ink-faded)',
    marginBottom: '0.8rem',
    whiteSpace: 'pre-wrap',
  },
  cardMeta: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaTag: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.68rem',
    color: 'var(--ink-whisper)',
    fontStyle: 'italic',
    letterSpacing: '0.04em',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.72rem',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    padding: '0.2rem 0.5rem',
    transition: 'all 0.2s ease',
    fontStyle: 'italic',
  },
  emptyState: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.85rem',
    color: 'var(--ink-whisper)',
    textAlign: 'center',
    padding: '3rem 0',
  },
  loading: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.82rem',
    color: 'var(--ink-whisper)',
    textAlign: 'center',
    padding: '3rem 0',
    opacity: 0,
    animation: 'fadeIn 0.5s ease 0.2s forwards',
  },
  backBtn: {
    position: 'fixed',
    top: '1.6rem',
    left: '1.8rem',
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    color: 'var(--ink-whisper)',
    cursor: 'pointer',
    letterSpacing: '0.06em',
    transition: 'color 0.2s ease',
  },
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

// Schema normalization helpers
function getConfessionText(row) {
  return row.text || row.content || ""
}

function getIsPrivate(row) {
  return row.is_private === true || row.visibility === "private"
}

function getIsPublic(row) {
  return !getIsPrivate(row)
}

function getVisibilityLabel(row) {
  return getIsPrivate(row) ? 'private' : 'public'
}

const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'unsaid2024'

function Login({ onLogin, onBack }) {
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')

  const attempt = () => {
    if (pass === ADMIN_PASS) {
      onLogin()
    } else {
      setError('that\'s not it.')
      setPass('')
    }
  }

  return (
    <div style={styles.loginWrap}>
      <button
        style={styles.backBtn}
        onClick={onBack}
        onMouseEnter={e => e.target.style.color = 'var(--ink-ghost)'}
        onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
      >
        ← go back
      </button>
      <div style={styles.loginInner}>
        <h2 style={styles.loginTitle}>the archive.</h2>
        <p style={styles.loginSub}>not meant for everyone.</p>
        <input
          type="password"
          style={styles.input}
          value={pass}
          onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          placeholder="passphrase"
          autoFocus
        />
        <button
          style={styles.loginBtn}
          onClick={attempt}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--ink-ghost)'; e.target.style.color = 'var(--ink)' }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--ink-faded)' }}
        >
          enter
        </button>
        {error && <p style={styles.loginError}>{error}</p>}
      </div>
    </div>
  )
}

function ConfessionCard({ confession, onApprove, onDelete, onUnpublish, index }) {
  const isPublic = getIsPublic(confession)
  const approved = confession.approved
  const text = getConfessionText(confession)
  const visibility = getVisibilityLabel(confession)

  return (
    <div style={{ ...styles.card, animationDelay: `${0.05 + index * 0.06}s` }}>
      <p style={styles.cardText}>{text}</p>
      <div style={styles.cardMeta}>
        <span style={styles.metaTag}>{formatDate(confession.created_at)}</span>
        <span style={{ ...styles.metaTag, textTransform: 'uppercase', fontSize: '0.62rem' }}>
          {visibility}
        </span>
        {approved && (
          <span style={{ ...styles.metaTag, color: 'var(--rust-faded)' }}>published</span>
        )}

        {!approved && isPublic && (
          <button
            style={{ ...styles.actionBtn, color: 'var(--rust-faded)' }}
            onClick={() => onApprove(confession.id)}
            onMouseEnter={e => e.target.style.color = 'var(--rust)'}
            onMouseLeave={e => e.target.style.color = 'var(--rust-faded)'}
          >
            approve →
          </button>
        )}
        {approved && (
          <button
            style={{ ...styles.actionBtn, color: 'var(--ink-whisper)' }}
            onClick={() => onUnpublish(confession.id)}
            onMouseEnter={e => e.target.style.color = 'var(--ink-ghost)'}
            onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
          >
            unpublish
          </button>
        )}
        <button
          style={{ ...styles.actionBtn, color: 'var(--ink-whisper)' }}
          onClick={() => onDelete(confession.id)}
          onMouseEnter={e => e.target.style.color = '#c44'}
          onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
        >
          delete
        </button>
      </div>
    </div>
  )
}

export default function Admin({ onBack }) {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('pending')
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'pending', label: 'pending approval' },
    { id: 'public', label: 'published' },
    { id: 'private', label: 'private' },
    { id: 'all', label: 'all' },
  ]

  const filterConfessions = (allRows) => {
    let filtered = allRows

    if (tab === 'pending') {
      filtered = allRows.filter(row => !row.approved && getIsPublic(row))
    } else if (tab === 'public') {
      filtered = allRows.filter(row => row.approved && getIsPublic(row))
    } else if (tab === 'private') {
      filtered = allRows.filter(row => getIsPrivate(row))
    }
    // 'all' tab: no filtering

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateB - dateA
    })
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('confessions')
        .select('*')

      if (error) {
        console.error('Supabase error fetching confessions:', error)
        setConfessions([])
      } else {
        const filtered = filterConfessions(data || [])
        setConfessions(filtered)
      }
    } catch (err) {
      console.error('Error loading confessions:', err)
      setConfessions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authed) loadData()
  }, [authed, tab])

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase.from('confessions').update({ approved: true }).eq('id', id)
      if (error) console.error('Supabase error approving:', error)
      loadData()
    } catch (err) {
      console.error('Error approving confession:', err)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('delete forever?')) return
    try {
      const { error } = await supabase.from('confessions').delete().eq('id', id)
      if (error) console.error('Supabase error deleting:', error)
      loadData()
    } catch (err) {
      console.error('Error deleting confession:', err)
    }
  }

  const handleUnpublish = async (id) => {
    try {
      const { error } = await supabase.from('confessions').update({ approved: false }).eq('id', id)
      if (error) console.error('Supabase error unpublishing:', error)
      loadData()
    } catch (err) {
      console.error('Error unpublishing confession:', err)
    }
  }

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} onBack={onBack} />
  }

  return (
    <div style={styles.wrapper}>
      <button
        style={styles.backBtn}
        onClick={onBack}
        onMouseEnter={e => e.target.style.color = 'var(--ink-ghost)'}
        onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
      >
        ← go back
      </button>

      <div style={styles.inner}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>the archive.</h2>
            <p style={styles.titleSub}>things left in the quiet.</p>
          </div>
          <button
            style={styles.logoutBtn}
            onClick={() => setAuthed(false)}
            onMouseEnter={e => e.target.style.color = 'var(--ink-ghost)'}
            onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
          >
            leave
          </button>
        </div>

        <div style={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.id}
              style={{
                ...styles.tab,
                color: tab === t.id ? 'var(--ink)' : 'var(--ink-whisper)',
                borderBottom: tab === t.id ? '1px solid var(--ink)' : '1px solid transparent',
              }}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading && <p style={styles.loading}>turning the pages…</p>}

        {!loading && confessions.length === 0 && (
          <p style={styles.emptyState}>nothing here.</p>
        )}

        {!loading && confessions.map((c, i) => (
          <ConfessionCard
            key={c.id}
            confession={c}
            index={i}
            onApprove={handleApprove}
            onDelete={handleDelete}
            onUnpublish={handleUnpublish}
          />
        ))}
      </div>
    </div>
  )
}
