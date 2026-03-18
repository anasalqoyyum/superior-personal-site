'use client'

import { useState, useEffect, useRef } from 'react'

interface NowPlayingData {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

const SESSION_KEY = 'np-dismissed'

const styles = `
  .now-playing-widget {
    position: fixed;
    z-index: 50;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background-color: var(--surface);
    border-top: 1px solid var(--border);
    box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
    text-decoration: none;
    color: var(--text);
    transition: border-color 0.2s;
  }
  .now-playing-widget:hover {
    border-color: var(--accent);
  }
  @media (min-width: 640px) {
    .now-playing-widget {
      bottom: 1.5rem;
      right: 1.5rem;
      left: auto;
      width: 260px;
      border-radius: 6px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 10px 12px;
    }
  }
  @keyframes nowPlayingPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
  @media (prefers-reduced-motion: reduce) {
    .np-dot { animation: none !important; }
    .now-playing-in { animation: none !important; }
  }
`

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null)
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const firstLoad = useRef(true)

  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1') {
      setDismissed(true)
      return
    }

    const load = async () => {
      try {
        const res = await fetch('/api/now-playing')
        if (res.status === 204 || !res.ok) return
        const json: NowPlayingData = await res.json()
        setData(json)
        if (firstLoad.current) {
          firstLoad.current = false
          requestAnimationFrame(() => setVisible(true))
        }
      } catch {}
    }

    load()
    const id = setInterval(load, 30_000)
    return () => clearInterval(id)
  }, [])

  const dismiss = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    sessionStorage.setItem(SESSION_KEY, '1')
    setDismissed(true)
  }

  if (dismissed || !data || !visible) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <a
        href={data.songUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={`now-playing-widget now-playing-in`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={hovered ? { borderColor: 'var(--accent)' } : undefined}
      >
        {/* Album art */}
        {data.albumImageUrl && (
          <img
            src={data.albumImageUrl}
            alt={data.album}
            width={32}
            height={32}
            style={{
              borderRadius: '3px',
              flexShrink: 0,
              objectFit: 'cover',
              border: '1px solid var(--border)',
            }}
          />
        )}

        {/* Text block */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          {!data.isPlaying && (
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.6rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                marginBottom: '2px',
                lineHeight: 1,
              }}
            >
              Last played
            </div>
          )}
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.75rem',
              color: data.isPlaying ? 'var(--text)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
            }}
          >
            {data.title}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.4,
            }}
          >
            {data.artist}
          </div>
        </div>

        {/* Status dot */}
        <div
          className="np-dot"
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: data.isPlaying ? '#1DB954' : 'var(--text-muted)',
            flexShrink: 0,
            animation: data.isPlaying ? 'nowPlayingPulse 2.4s ease-in-out infinite' : 'none',
          }}
        />

        {/* Dismiss */}
        <button
          onClick={dismiss}
          aria-label="Dismiss now playing widget"
          style={{
            background: 'none',
            border: 'none',
            padding: '2px 0 2px 4px',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '1rem',
            lineHeight: 1,
            flexShrink: 0,
            opacity: hovered ? 0.7 : 0.3,
            transition: 'opacity 0.15s',
          }}
        >
          ×
        </button>
      </a>
    </>
  )
}
