'use client'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  title: string
  handle: string
  priceRange: { minVariantPrice: { amount: string } }
  images: { edges: { node: { url: string; altText: string } }[] }
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('/api/shop')
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Failed to load products' }))
    throw new Error(error || 'Failed to load products')
  }
  const { products } = await res.json()
  return products
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
      .then(p => { setProducts(p); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (error) return (
    <section id="shop" style={{ padding: '100px 40px', background: '#142233' }}>
      <div style={{ color: '#E8621A', textAlign: 'center' }}>Shop error: {error}</div>
    </section>
  )

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
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {[1,2,3,4].map(i => (
              <div key={i} style={{ background: '#1C2E42', padding: '32px 24px', height: 280, opacity: 0.5 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
            {products.map(product => (
              <a key={product.id} href={`https://shop.reallybadsecurity.com/products/${product.handle}`} target="_blank"
                style={{ textDecoration: 'none', display: 'block', background: '#1C2E42', border: '1px solid rgba(139,163,184,0.08)', overflow: 'hidden' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#E8621A')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,163,184,0.08)')}>
                {product.images.edges[0] && (
                  <img src={product.images.edges[0].node.url} alt={product.images.edges[0].node.altText || product.title}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                )}
                <div style={{ padding: '20px 24px' }}>
                  <div style={{ fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F5F0E8', marginBottom: 8 }}>{product.title}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#E8621A' }}>${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
