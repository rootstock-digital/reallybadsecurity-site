'use client'
import { useEffect, useState } from 'react'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

interface Channel {
  name: string
  playlistId: string
  url: string
  channelUrl: string
  videos: Video[]
}

async function fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
  const apiKey = 'AIzaSyCNOej2rhoWI2HDz0AnusbRcm1DvXMy6aE'
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`
  )
  const data = await res.json()
  if (!data.items) return []
  return data.items.map((item: any) => ({
  id: item.snippet.resourceId.videoId,
  title: item.snippet.title,
  thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
  publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString()
})).sort((a: Video, b: Video) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
.slice(0, 3)
}

export default function YouTube() {
  const [channels, setChannels] = useState<Channel[]>([
    { name: 'Authenticated Access', playlistId: 'PLXw5m5eHQErZkjyPKvCFWEgKXxQPUTkyP', url: 'https://www.youtube.com/playlist?list=PLXw5m5eHQErZkjyPKvCFWEgKXxQPUTkyP', channelUrl: 'https://www.youtube.com/@authenticatedaccess', videos: [] },
    { name: 'Not Another Demo', playlistId: 'PLUwYthY0-YbtvNH0gzqJy0-K43jQ74YVh', url: 'https://www.youtube.com/playlist?list=PLUwYthY0-YbtvNH0gzqJy0-K43jQ74YVh', channelUrl: 'https://www.youtube.com/@reallybadsecurity', videos: [] },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadVideos() {
      const updated = await Promise.all(
        channels.map(async (channel) => {
          const videos = await fetchPlaylistVideos(channel.playlistId)
          return { ...channel, videos }
        })
      )
      setChannels(updated)
      setLoading(false)
    }
    loadVideos()
  }, [])

  return (
    <section id="youtube" style={{ padding: '100px 40px', background: '#0D1B2A', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#E8621A', marginBottom: 16 }}>Watch</div>
        <h2 style={{ fontWeight: 900, fontSize: 'clamp(36px, 5vw, 60px)', textTransform: 'uppercase', lineHeight: 0.95, marginBottom: 60, color: '#F5F0E8' }}>
          The <span style={{ color: '#E8621A' }}>Podcasts</span>
        </h2>
        {channels.map((channel) => (
          <div key={channel.name} style={{ marginBottom: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ fontWeight: 800, fontSize: 22, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#F5F0E8' }}>
                🎙️ {channel.name}
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                <a href={channel.url} target="_blank" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8BA3B8', textDecoration: 'none' }}>
                  Full Playlist ↗
                </a>
                <a href={channel.channelUrl} target="_blank" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#E8621A', textDecoration: 'none' }}>
                  View Channel ↗
                </a>
              </div>
            </div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[1,2,3].map(i => (
                  <div key={i} style={{ background: '#142233', height: 200, opacity: 0.5, borderRadius: 2 }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {channel.videos.length > 0 ? channel.videos.map((video) => (
                  <a key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank"
                    style={{ textDecoration: 'none', display: 'block', background: '#142233', border: '1px solid rgba(139,163,184,0.08)', overflow: 'hidden', borderRadius: 2 }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#E8621A')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(139,163,184,0.08)')}>
                    <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: 180, objectFit: 'contain', background: '#0D1B2A' }} />
                    <div style={{ padding: '16px' }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#F5F0E8', lineHeight: 1.4, marginBottom: 8 }}>{video.title}</div>
                      <div style={{ fontSize: 12, color: '#8BA3B8' }}>{video.publishedAt}</div>
                    </div>
                  </a>
                )) : (
                  <div style={{ color: '#8BA3B8', fontSize: 14 }}>No videos found</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
