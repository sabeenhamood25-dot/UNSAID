import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 'clamp(3rem, 8vh, 6rem) 1.5rem 4rem',
    position: 'relative',
  },
  inner: {
    width: '100%',
    maxWidth: '580px',
  },
  prompt: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    color: 'var(--ink-ghost)',
    marginBottom: '2.4rem',
    letterSpacing: '0.01em',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 0.1s forwards',
  },
  textareaWrap: {
    position: 'relative',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 0.4s forwards',
  },
  textarea: {
    width: '100%',
    minHeight: '260px',
    background: 'transparent',
    border: 'none',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(0.95rem, 2vw, 1.05rem)',
    lineHeight: '1.85',
    color: 'var(--ink)',
    padding: '1.4rem 0',
    caretColor: 'var(--ink)',
  },
  cursor: {
    display: 'inline-block',
    width: '1px',
    height: '1.1em',
    background: 'var(--ink)',
    verticalAlign: 'text-bottom',
    animation: 'blink 1.1s step-end infinite',
    marginLeft: '1px',
  },
  disclaimer: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.72rem',
    color: 'var(--ink-whisper)',
    fontStyle: 'italic',
    marginTop: '1.2rem',
    lineHeight: 1.7,
    letterSpacing: '0.02em',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 0.7s forwards',
  },
  choiceWrap: {
    marginTop: '2rem',
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 0.9s forwards',
  },
  choiceLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.88rem',
    color: 'var(--ink-faded)',
    letterSpacing: '0.02em',
    userSelect: 'none',
    transition: 'color 0.2s ease',
  },
  choiceDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '1px solid var(--ink-ghost)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  choiceDotInner: {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    background: 'var(--ink)',
  },
  submitWrap: {
    marginTop: '2.8rem',
    opacity: 0,
    animation: 'fadeIn 0.8s ease 1.1s forwards',
  },
  submitBtn: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '1.1rem',
    color: 'var(--rust-faded)',
    cursor: 'pointer',
    letterSpacing: '0.04em',
    padding: 0,
    transition: 'color 0.2s ease, letter-spacing 0.3s ease',
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
  errorMsg: {
    fontFamily: 'var(--font-body)',
    fontStyle: 'italic',
    fontSize: '0.8rem',
    color: 'var(--rust)',
    marginTop: '0.8rem',
  }
}

export default function Write({ onBack, onSubmitted }) {
  const [text, setText] = useState('')
  const [visibility, setVisibility] = useState('private')
  const [focused, setFocused] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitHovered, setSubmitHovered] = useState(false)
  const textareaRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        setFocused(true)
      }
    }, 700)
  }, [])

  const handleSubmit = async () => {
    if (!text.trim() || text.trim().length < 5) {
      setError('say a little more, if you can.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const confessionText = text.trim()
      const isPrivate = visibility === 'private'

      const { error: dbError } = await supabase.from('confessions').insert({
        // New schema
        text: confessionText,
        is_private: isPrivate,
        // Legacy schema (for backwards compatibility)
        content: confessionText,
        visibility: isPrivate ? 'private' : 'public',
        // Common fields
        approved: false,
        created_at: new Date().toISOString(),
      })
      if (dbError) throw dbError
      console.log('Confession submitted successfully')
      onSubmitted()
    } catch (err) {
      console.error('Error submitting confession:', err)
      setError('something went quiet. try again.')
      setSubmitting(false)
    }
  }

  return (
    <div style={{
      ...styles.wrapper,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.7s ease',
    }}>
      <button
        style={styles.backBtn}
        onClick={onBack}
        onMouseEnter={e => e.target.style.color = 'var(--ink-ghost)'}
        onMouseLeave={e => e.target.style.color = 'var(--ink-whisper)'}
      >
        ← go back
      </button>

      <div style={styles.inner}>
        <p style={styles.prompt}>write what you couldn't say out loud.</p>

        <div style={styles.textareaWrap}>
          <textarea
            ref={textareaRef}
            style={styles.textarea}
            value={text}
            onChange={e => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder=""
            spellCheck={true}
            autoComplete="off"
            autoCorrect="on"
          />
          {text === '' && !focused && (
            <span style={{
              ...styles.cursor,
              position: 'absolute',
              top: '1.4rem',
              left: '0',
            }} />
          )}
        </div>

        <p style={styles.disclaimer}>
          please do not include names, phone numbers, usernames, addresses, or identifying details.
        </p>

        <div style={styles.choiceWrap}>
          {[
            { val: 'private', label: 'keep private' },
            { val: 'public', label: 'allow public posting' },
          ].map(opt => (
            <label
              key={opt.val}
              style={{
                ...styles.choiceLabel,
                color: visibility === opt.val ? 'var(--ink)' : 'var(--ink-ghost)',
              }}
              onClick={() => setVisibility(opt.val)}
            >
              <span style={{
                ...styles.choiceDot,
                borderColor: visibility === opt.val ? 'var(--ink)' : 'var(--ink-whisper)',
              }}>
                {visibility === opt.val && <span style={styles.choiceDotInner} />}
              </span>
              {opt.label}
            </label>
          ))}
        </div>

        {error && <p style={styles.errorMsg}>{error}</p>}

        <div style={styles.submitWrap}>
          <button
            style={{
              ...styles.submitBtn,
              color: submitHovered ? 'var(--rust)' : 'var(--rust-faded)',
              letterSpacing: submitHovered ? '0.08em' : '0.04em',
              opacity: submitting ? 0.5 : 1,
            }}
            onClick={handleSubmit}
            disabled={submitting}
            onMouseEnter={() => setSubmitHovered(true)}
            onMouseLeave={() => setSubmitHovered(false)}
          >
            {submitting ? 'leaving it...' : 'leave it unsaid →'}
          </button>
        </div>
      </div>
    </div>
  )
}
