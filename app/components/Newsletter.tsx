export default function Newsletter() {
  return (
    <section id="newsletter" style={{ padding: '100px 40px', background: '#142233', borderTop: '1px solid rgba(232,98,26,0.15)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E8621A', marginBottom: 16 }}>Join the Movement</div>
        <h2 style={{ fontWeight: 900, fontSize: 'clamp(44px, 6vw, 80px)', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 20, color: '#F5F0E8' }}>
          Be First.<br /><span style={{ color: '#E8621A' }}>Stay Secure.</span>
        </h2>
        <p style={{ color: '#8BA3B8', fontSize: 18, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Get early access to episodes and content — plus the occasional security tip that won't make your eyes glaze over.
        </p>
        <div style={{ display: 'flex', maxWidth: 500, margin: '0 auto', justifyContent: 'center' }}>
          <input type="email" placeholder="your@email.com" style={{ flex: 1, padding: '16px 20px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(139,163,184,0.3)', borderRight: 'none', borderRadius: '2px 0 0 2px', color: '#F5F0E8', fontSize: 15, outline: 'none' }} />
          <a href="https://reallybadsecurity.beehiiv.com/subscribe" target="_blank" style={{ padding: '16px 32px', background: '#E8621A', color: '#0D1B2A', borderRadius: '0 2px 2px 0', fontSize: 16, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
            Count Me In
          </a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 28, flexWrap: 'wrap' }}>
          {['Early access to all content', 'Free security resources', 'No spam, ever'].map((perk, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#8BA3B8' }}>
              <span style={{ color: '#E8621A', fontWeight: 700 }}>✓</span> {perk}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
