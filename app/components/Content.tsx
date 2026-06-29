'use client'
export default function Content() {
  return (
    <section id="content" className="px-section" style={{ paddingTop: 100, paddingBottom: 100, background: '#0D1B2A', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E8621A', marginBottom: 16 }}>Content</div>
        <h2 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 60, color: '#F5F0E8' }}>
          The <span style={{ color: '#E8621A' }}>Podcasts</span>
        </h2>
        <div className="grid-2col" style={{ gap: 2, marginBottom: 80 }}>
          {[
            { name: 'Authenticated Access', desc: 'Security leadership in a changing market. Strategic conversations on risk, AI acceleration, budget pressure, and organizational complexity.', url: 'https://www.youtube.com/@authenticatedaccess' },
            { name: 'Not Another Demo', desc: 'Vendors actually show what their platform does. No slides, no buzzwords, absolutely no acronyms.', url: 'https://www.youtube.com/@reallybadsecurity' },
          ].map((pod, i) => (
            <div key={i} style={{ background: '#142233', padding: '40px 32px', border: '1px solid rgba(139,163,184,0.08)' }}>
              <div style={{ fontSize: 28, marginBottom: 16 }}>🎙️</div>
              <div style={{ fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F5F0E8', marginBottom: 12 }}>{pod.name}</div>
              <p style={{ fontSize: 15, color: '#8BA3B8', lineHeight: 1.7, marginBottom: 24 }}>{pod.desc}</p>
              <a href={pod.url} target="_blank" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8621A', textDecoration: 'none' }}>Watch on YouTube</a>
            </div>
          ))}
        </div>
        <div className="grid-2col" style={{ gap: 2 }}>
          <div style={{ background: '#142233', padding: '40px 32px', border: '1px solid rgba(139,163,184,0.08)' }}>
            <div style={{ fontSize: 28, marginBottom: 16 }}>📡</div>
            <div style={{ fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F5F0E8', marginBottom: 12 }}>Content Hub</div>
            <p style={{ fontSize: 15, color: '#8BA3B8', lineHeight: 1.7, marginBottom: 24 }}>Cybersecurity insights covering the topics that matter. No fluff, no filler.</p>
            <a href="https://medium.com/@reallybadsecurity" target="_blank" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8621A', textDecoration: 'none' }}>Read on Medium</a>
          </div>
          <div style={{ background: '#142233', padding: '40px 32px', border: '1px solid rgba(139,163,184,0.08)' }}>
            <div style={{ fontSize: 28, marginBottom: 16 }}>🎵</div>
            <div style={{ fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F5F0E8', marginBottom: 12 }}>The Daily Grind</div>
            <p style={{ fontSize: 15, color: '#8BA3B8', lineHeight: 1.7, marginBottom: 24 }}>AI-generated songs about corporate life. Because sometimes music is the only way to process it all.</p>
            <a href="https://suno.com/playlist/f9bde56c-e309-42b8-91fb-3f0372640c4d" target="_blank" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8621A', textDecoration: 'none' }}>Listen on Suno</a>
          </div>
        </div>
      </div>
    </section>
  )
}
