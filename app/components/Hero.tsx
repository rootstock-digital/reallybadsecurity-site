export default function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 40px 80px', position: 'relative', overflow: 'hidden', background: '#0D1B2A' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(232,98,26,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,98,26,0.06) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,98,26,0.15) 0%, transparent 70%)', top: -100, right: -100, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1, width: '100%' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#E8621A', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'block', width: 32, height: 2, background: '#E8621A' }} />
            Cybersecurity for humans
          </div>
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(56px, 7vw, 88px)', lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 28, color: '#F5F0E8' }}>
            Making<br />
            <span className="glitch-text" style={{ color: '#E8621A', display: 'inline-block' }}>Really Bad Security</span><br />
            Good.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.65, color: '#8BA3B8', marginBottom: 40, maxWidth: 480 }}>
            Breaking down the complexity of cybersecurity and making technology discussions a little more human.
          </p>
          <div style={{ display: 'flex', maxWidth: 480 }}>
            <input type="email" placeholder="your@email.com" style={{ flex: 1, padding: '14px 18px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(139,163,184,0.3)', borderRight: 'none', borderRadius: '2px 0 0 2px', color: '#F5F0E8', fontSize: 15, outline: 'none' }} />
            <a href="https://reallybadsecurity.beehiiv.com/subscribe" target="_blank" style={{ padding: '14px 28px', background: '#E8621A', color: '#0D1B2A', borderRadius: '0 2px 2px 0', fontSize: 15, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
              Join the Community
            </a>
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: '#8BA3B8', opacity: 0.7 }}>No spam. No jargon. Just really good security content.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spin-ring" style={{ position: 'absolute', inset: -40, borderRadius: '50%', border: '1px dashed rgba(232,98,26,0.25)' }} />
            <img src="/rbs-shield-only-logo.png" alt="Really Bad Security" style={{ width: 340, height: 340, objectFit: 'contain', position: 'relative', zIndex: 2, filter: 'drop-shadow(0 0 60px rgba(232,98,26,0.4))', animation: 'float 6s ease-in-out infinite' }} />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(-7px); } 50% { transform: translateY(7px); } }        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #00E5FF, -2px 0 #E8621A; }
          25% { text-shadow: -3px 0 #E8621A, 3px 0 #00E5FF; }
          50% { text-shadow: 2px 0 #00E5FF; }
          75% { text-shadow: -2px 0 #E8621A; }
          100% { text-shadow: none; }
        }
        .spin-ring { animation: spin 30s linear infinite; }
        .spin-ring::after { content: ''; position: absolute; top: -4px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; border-radius: 50%; background: #E8621A; }
        .glitch-text:hover { animation: glitch 0.3s steps(2, end) forwards; }
      `}</style>
    </section>
  )
}
