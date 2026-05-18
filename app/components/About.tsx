'use client'
export default function About() {
  return (
    <section id="about" style={{ padding: '100px 40px', background: '#142233', borderTop: '1px solid rgba(232,98,26,0.15)', borderBottom: '1px solid rgba(232,98,26,0.15)', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E8621A', marginBottom: 16 }}>Who We Are</div>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', textTransform: 'uppercase', lineHeight: 0.95, letterSpacing: '-0.01em', marginBottom: 24, color: '#F5F0E8' }}>
            Cybersecurity<br /><span style={{ color: '#E8621A' }}>Doesnt Have</span><br />To Suck.
          </h2>
          <p style={{ color: '#8BA3B8', fontSize: 17, lineHeight: 2, marginBottom: 20 }}>
            <strong style={{ color: '#F5F0E8' }}>Compliance theater.</strong><br />
            <strong style={{ color: '#F5F0E8' }}>Vendor buzzwords.</strong><br />
            <strong style={{ color: '#F5F0E8' }}>High pressure sales.</strong><br />
            <strong style={{ color: '#F5F0E8' }}>Endless acronyms.</strong><br />
            <strong style={{ color: '#F5F0E8' }}>Fear-mongering.</strong>
          </p>
          <p style={{ color: '#8BA3B8', fontSize: 17, lineHeight: 1.7, marginBottom: 20 }}>
            It is everywhere and it is leaving businesses dangerously exposed.
          </p>
          <p style={{ color: '#8BA3B8', fontSize: 17, lineHeight: 1.7 }}>
            Really Bad Security is the antidote. A community where <strong style={{ color: '#F5F0E8' }}>security advice is honest, actionable, and actually understandable.</strong>
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { number: '0', label: 'High Pressure\nSalespeople' },
            { number: '0', label: 'Corporate\nBuzzwords' },
            { number: '∞', label: 'Dad Jokes\nAbout Firewalls' },
            { number: '1', label: 'Mission:\nMake Security Good' },
          ].map((stat, i) => (
            <div key={i} style={{ background: '#1C2E42', padding: '32px 28px', border: '1px solid rgba(139,163,184,0.1)', cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E8621A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,163,184,0.1)')}>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#E8621A', lineHeight: 1, marginBottom: 6 }}>{stat.number}</div>
              <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8BA3B8', whiteSpace: 'pre-line' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
