import React, { useState, useEffect } from 'react'
import { supabase } from './supabase'

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 'clamp(3rem, 8vh, 5rem) 1.5rem 6rem',
  },
  inner: {
    width: '100%',
    maxWidth: '560px',
  },
  header: {
    marginBottom: '3.5rem',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 0.1s forwards',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
    color: 'var(--ink)',
    letterSpacing: '-0.01em',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.82rem',
    color: 'var(--ink-whisper)',
    letterSpacing: '0.03em',
  },
  divider: {
    width: '40px',
    height: '1px',
    background: 'var(--border)',
    margin: '1.2rem 0',
  },
  entry: {
    borderTop: '1px solid var(--border)',
    padding: '1.6rem 0',
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    opacity: 0,
    animation: 'fadeUp 0.6s ease forwards',
  },
  entryExpanded: {
    borderTop: '1px solid var(--border)',
    padding: '1.6rem 0',
  },
  entryText: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.98rem',
    lineHeight: '1.85',
    color: 'var(--ink-faded)',
    letterSpacing: '0.01em',
  },
  entrySnippet: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.98rem',
    lineHeight: '1.8',
    color: 'var(--ink-faded)',
    letterSpacing: '0.01em',
    position: 'relative',
  },
  readMore: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.78rem',
    color: 'var(--ink-whisper)',
    marginTop: '0.5rem',
    display: 'block',
  },
  timestamp: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.68rem',
    color: 'var(--ink-whisper)',
    letterSpacing: '0.06em',
    marginTop: '0.8rem',
    fontStyle: 'italic',
  },
  empty: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.9rem',
    color: 'var(--ink-whisper)',
    textAlign: 'center',
    marginTop: '4rem',
    lineHeight: 1.8,
    opacity: 0,
    animation: 'fadeIn 1s ease 0.5s forwards',
  },
  loading: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.85rem',
    color: 'var(--ink-whisper)',
    textAlign: 'center',
    marginTop: '4rem',
    opacity: 0,
    animation: 'fadeIn 0.6s ease 0.3s forwards',
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
  collapseHint: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.72rem',
    color: 'var(--ink-whisper)',
    marginTop: '0.8rem',
    display: 'block',
    cursor: 'pointer',
  },
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

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', ' —')
}

function truncate(text, len = 180) {
  if (text.length <= len) return { short: text, truncated: false }
  return { short: text.slice(0, len).trim() + '…', truncated: true }
}

function Entry({ confession, index }) {
  const [expanded, setExpanded] = useState(false)
  const text = getConfessionText(confession)
  const { short, truncated } = truncate(text)

  return (
    <div
      style={{ ...styles.entry, animationDelay: `${0.1 + index * 0.07}s` }}
    >
      {!expanded ? (
        <div onClick={() => truncated && setExpanded(true)}>
          <p style={{
            ...styles.entrySnippet,
            cursor: truncated ? 'pointer' : 'default',
          }}>
            {short}
          </p>
          {truncated && (
            <span style={styles.readMore}>continue reading…</span>
          )}
        </div>
      ) : (
        <div>
          <p style={styles.entryText}>{text}</p>
          <span
            style={styles.collapseHint}
            onClick={() => setExpanded(false)}
          >
            collapse
          </span>
        </div>
      )}
      <span style={styles.timestamp}>{formatDate(confession.created_at)}</span>
    </div>
  )
}

export default function Feed({ onBack }) {
  const [confessions, setConfessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from('confessions')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          console.error('Supabase error fetching feed:', error)
          setConfessions([])
        } else {
          // Filter for public confessions (both schema versions)
          const publicConfessions = (data || []).filter(row => getIsPublic(row))
          setConfessions(publicConfessions)
        }
      } catch (err) {
        console.error('Error loading feed:', err)
        setConfessions([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

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
          <h2 style={styles.title}>unsaid.</h2>
          <div style={styles.divider} />
          <p style={styles.subtitle}>things left here by others, in quiet.</p>
        </div>

        {loading && <p style={styles.loading}>gathering the quiet…</p>}

        {!loading && confessions.length === 0 && (
          <p style={styles.empty}>
            nothing here yet.<br />
            be the first to leave something unsaid.
          </p>
        )}

        {!loading && confessions.map((c, i) => (
          <Entry key={c.id} confession={c} index={i} />
        ))}
      </div>
    </div>
  )
}
