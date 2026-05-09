import React, { useState, useEffect } from 'react'

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
  },
  inner: {
    textAlign: 'center',
    maxWidth: '480px',
    width: '100%',
  },
  title: {
    fontFamily: 'var(--font-serif)',
    fontSize: 'clamp(2.8rem, 8vw, 4.5rem)',
    color: 'var(--ink)',
    letterSpacing: '-0.02em',
    lineHeight: 1,
    marginBottom: '1.6rem',
    opacity: 0,
    animation: 'fadeIn 1.2s ease 0.2s forwards',
  },
  urdu: {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
    color: 'var(--ink-ghost)',
    direction: 'rtl',
    letterSpacing: '0.01em',
    lineHeight: 1.8,
    marginBottom: '0.6rem',
    opacity: 0,
    animation: 'fadeIn 1s ease 0.9s forwards',
  },
  subtitle: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: 'clamp(0.85rem, 2vw, 1rem)',
    color: 'var(--ink-ghost)',
    letterSpacing: '0.03em',
    marginBottom: '3.2rem',
    opacity: 0,
    animation: 'fadeIn 1s ease 1.3s forwards',
  },
  buttonWrap: {
    opacity: 0,
    animation: 'fadeIn 1s ease 1.8s forwards',
  },
  button: {
    background: 'none',
    border: '1px solid var(--border)',
    color: 'var(--ink-faded)',
    fontFamily: 'var(--font-serif)',
    fontSize: '1.05rem',
    letterSpacing: '0.12em',
    padding: '0.7rem 2.4rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
  nav: {
    position: 'fixed',
    bottom: '1.8rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '2rem',
    opacity: 0,
    animation: 'fadeIn 1s ease 2.4s forwards',
  },
  navLink: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    color: 'var(--ink-whisper)',
    textDecoration: 'none',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    background: 'none',
    border: 'none',
  },
  adminDot: {
    position: 'fixed',
    bottom: '1.6rem',
    right: '1.8rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--ink-whisper)',
    fontSize: '1.1rem',
    letterSpacing: '0.05em',
    opacity: 0,
    animation: 'fadeIn 1s ease 3s forwards',
    padding: '0.4rem',
    transition: 'color 0.2s ease',
  },
}

export default function Landing({ onBegin, onFeed, onAdmin }) {
  const [hovered, setHovered] = useState(false)
  const [fading, setFading] = useState(false)

  const handleBegin = () => {
    setFading(true)
    setTimeout(() => onBegin(), 600)
  }

  return (
    <div style={{
      ...styles.wrapper,
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <div style={styles.inner}>
        <h1 style={styles.title}>unsaid.</h1>
        <p style={styles.urdu}>جو باتیں کہی نہیں جاتیں</p>
        <p style={styles.subtitle}>the things we leave unsaid.</p>
        <div style={styles.buttonWrap}>
          <button
            style={{
              ...styles.button,
              borderColor: hovered ? 'var(--ink-ghost)' : 'var(--border)',
              color: hovered ? 'var(--ink)' : 'var(--ink-faded)',
              letterSpacing: hovered ? '0.18em' : '0.12em',
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleBegin}
          >
            begin
          </button>
        </div>
      </div>

      <div style={styles.nav}>
        <button
          style={styles.navLink}
          onClick={onFeed}
          onMouseEnter={e => e.target.style.color = 'var(--ink-faded)'}
          onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
        >
          read others
        </button>
      </div>

      <button
        style={styles.adminDot}
        onClick={onAdmin}
        title="···"
        onMouseEnter={e => e.target.style.color = 'var(--ink-ghost)'}
        onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
      >
        ···
      </button>
    </div>
  )
}
