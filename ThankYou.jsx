import React, { useState, useEffect } from 'react'

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  message: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
    color: 'var(--ink-faded)',
    letterSpacing: '0.02em',
    opacity: 0,
    animation: 'fadeIn 1.4s ease 0.3s forwards',
    marginBottom: '0.8rem',
  },
  sub: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    color: 'var(--ink-whisper)',
    fontStyle: 'italic',
    opacity: 0,
    animation: 'fadeIn 1s ease 1.4s forwards',
    marginBottom: '3.5rem',
  },
  homeBtn: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    color: 'var(--ink-whisper)',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    opacity: 0,
    animation: 'fadeIn 1s ease 2.2s forwards',
    transition: 'color 0.2s ease',
  },
  ornament: {
    fontFamily: 'var(--font-serif)',
    fontSize: '1.2rem',
    color: 'var(--sepia)',
    marginBottom: '2rem',
    opacity: 0,
    animation: 'fadeIn 1s ease 0.8s forwards',
    letterSpacing: '0.3em',
  },
}

export default function ThankYou({ onHome }) {
  return (
    <div style={styles.wrapper}>
      <p style={styles.ornament}>· · ·</p>
      <h2 style={styles.message}>thank you for being here.</h2>
      <p style={styles.sub}>it's safe now.</p>
      <button
        style={styles.homeBtn}
        onClick={onHome}
        onMouseEnter={e => e.target.style.color = 'var(--ink-ghost)'}
        onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
      >
        return home
      </button>
    </div>
  )
}
