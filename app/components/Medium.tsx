'use client'
import { useEffect, useState } from 'react'

interface Article {
  title: string
  link: string
  pubDate: string
  thumbnail: string
  description: string
}

interface FeedItem {
  title: string
  link: string
  pubDate: string
  thumbnail?: string
  enclosure?: { link?: string }
  description: string
}

export default function Medium() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(
          `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@reallybadsecurity`
        )
        const data = await res.json()
        const items = data.items.slice(0, 3).map((item: FeedItem) => ({
          title: item.title,
          link: item.link,
          pubDate: new Date(item.pubDate).toLocaleDateString(),
          thumbnail: item.thumbnail || item.enclosure?.link || '',
          description: item.description.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
        }))
        setArticles(items)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  return (
    <section id="medium" className="px-section" style={{ paddingTop: 80, paddingBottom: 80, background: '#142233', borderTop: '1px solid rgba(232,98,26,0.15)', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="flex-sb" style={{ alignItems: 'center', marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E8621A', marginBottom: 12 }}>Read</div>
            <h2 style={{ fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', textTransform: 'uppercase', lineHeight: 0.95, color: '#F5F0E8' }}>
              Latest <span style={{ color: '#E8621A' }}>Articles</span>
            </h2>
          </div>
          <a href="https://medium.com/@reallybadsecurity" target="_blank" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8621A', textDecoration: 'none' }}>
            View All on Medium ↗
          </a>
        </div>
        {loading ? (
          <div className="grid-3col" style={{ gap: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ background: '#1C2E42', height: 200, opacity: 0.5, borderRadius: 2 }} />
            ))}
          </div>
        ) : (
          <div className="grid-3col" style={{ gap: 16 }}>
            {articles.map((article, i) => (
              <a key={i} href={article.link} target="_blank"
                style={{ textDecoration: 'none', display: 'block', background: '#1C2E42', border: '1px solid rgba(139,163,184,0.08)', overflow: 'hidden', borderRadius: 2 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#E8621A')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,163,184,0.08)')}>
                {article.thumbnail && (
                  <img src={article.thumbnail} alt={article.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
                )}
                <div style={{ padding: '20px' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#F5F0E8', lineHeight: 1.4, marginBottom: 10 }}>{article.title}</div>
                  <div style={{ fontSize: 13, color: '#8BA3B8', lineHeight: 1.5, marginBottom: 12 }}>{article.description}</div>
                  <div style={{ fontSize: 12, color: '#8BA3B8' }}>{article.pubDate}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}