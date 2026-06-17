interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

// Playlist config lives server-side so this route only ever queries our own
// playlists — it isn't an open proxy that would let anyone spend our API quota.
const PLAYLIST_IDS = [
  'PLXw5m5eHQErZkjyPKvCFWEgKXxQPUTkyP', // Authenticated Access
  'PLUwYthY0-YbtvNH0gzqJy0-K43jQ74YVh', // Not Another Demo
] as const

interface PlaylistItem {
  snippet: {
    resourceId: { videoId: string }
    title: string
    thumbnails: { medium?: { url: string }; default?: { url: string } }
    publishedAt: string
  }
}

async function fetchPlaylistVideos(playlistId: string, apiKey: string): Promise<Video[]> {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`,
    // Cache at the edge so we don't burn YouTube API quota on every page load.
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return []
  const data = await res.json()
  if (!data.items) return []
  return data.items
    .map((item: PlaylistItem) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
    }))
    .sort((a: Video, b: Video) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
}

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'YouTube is not configured' }, { status: 500 })
  }

  const playlists = await Promise.all(
    PLAYLIST_IDS.map(async (playlistId) => ({
      playlistId,
      videos: await fetchPlaylistVideos(playlistId, apiKey),
    }))
  )

  return Response.json({ playlists })
}
