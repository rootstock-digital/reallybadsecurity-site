'use client'
export default function Shop() {
  const products = [
    { name: 'Shadowbanned Tee', price: '$29', emoji: '👕' },
    { name: 'Ask AI Mug', price: '$18', emoji: '☕' },
    { name: 'Shadowbanned Hoodie', price: '$54', emoji: '🧥' },
    { name: 'Prompt Engineering Tee', price: '$29', emoji: '👕' },
  ]
  return (
    <section id="shop" style={{ padding: '100px 40px', background: '#142233', borderTop: '1px solid rgba(232,98,26,0.15)', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E8621A', marginBottom: 16 }}>Merch</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', textTransform: 'uppercase', lineHeight: 0.95, color: '#F5F0E8' }}>
            The <span style={{ color: '#E8621A' }}>Shop</span>
          </h2>
          <a href="https://shop.reallybadsecurity.com" target="_blank" style={{ padding: '12px 28px', background: '#E8621A', color: '#0D1B2A', borderRadius: 2, fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Visit the Shop
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {products.map((product, i) => (
            <a key={i} href="https://shop.reallybadsecurity.com" target="_blank" style={{ textDecoration: 'none', display: 'block', background: '#1C2E42', border: '1px solid rgba(139,163,184,0.08)', padding: '32px 24px', transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#E8621A')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,163,184,0.08)')}>
              <div style={{ fontSize: 48, marginBottom: 20, display: 'block' }}>{product.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F5F0E8', marginBottom: 8 }}>{product.name}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#E8621A' }}>{product.price}</div>
            </a>
          ))}
        </div>
        <p style={{ marginTop: 24, fontSize: 13, color: '#8BA3B8', textAlign: 'center' }}>
          Merch that security people will actually want to wear. Because owning your nerd identity is important.
        </p>
      </div>
    </section>
  )
}
