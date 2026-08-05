'use client'

import { useEffect, useState } from 'react'

type Video = {
  id: string
  title: string
  description: string
  thumbnail: string
  publishedAt: string
}

type VideoSeries = {
  name: string
  description: string
  playlistId: string
  channelUrl: string
  playlistUrl: string
}

type PlaylistResponse = {
  playlists: Array<{
    playlistId: string
    videos: Video[]
  }>
}

const series: readonly VideoSeries[] = [
  {
    name: 'Authenticated Access',
    description: 'Conversations about security leadership, AI, and the decisions that make security better—or worse.',
    playlistId: 'PLXw5m5eHQErZkjyPKvCFWEgKXxQPUTkyP',
    channelUrl: 'https://www.youtube.com/@authenticatedaccess',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLXw5m5eHQErZkjyPKvCFWEgKXxQPUTkyP',
  },
  {
    name: 'Not Another Demo',
    description: 'Real vendor conversations, without the slide decks, acronym soup, or security theater.',
    playlistId: 'PLUwYthY0-YbtvNH0gzqJy0-K43jQ74YVh',
    channelUrl: 'https://www.youtube.com/@reallybadsecurity',
    playlistUrl: 'https://www.youtube.com/playlist?list=PLUwYthY0-YbtvNH0gzqJy0-K43jQ74YVh',
  },
]

export function HomeWatchModule() {
  return <VideoExperience variant="home" />
}

export function WatchSeries() {
  return <VideoExperience variant="watch" />
}

function VideoExperience({ variant }: { variant: 'home' | 'watch' }) {
  const [videosByPlaylist, setVideosByPlaylist] = useState<Map<string, Video[]>>(new Map())
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const videoLimit = variant === 'home' ? 1 : 3

  useEffect(() => {
    const controller = new AbortController()

    async function loadVideos() {
      try {
        const response = await fetch('/api/youtube', { signal: controller.signal })
        if (!response.ok) throw new Error('YouTube videos are unavailable.')
        const data = await response.json() as PlaylistResponse
        if (!Array.isArray(data.playlists)) throw new Error('YouTube response was invalid.')
        setVideosByPlaylist(new Map(data.playlists.map((playlist) => [playlist.playlistId, playlist.videos])))
        setState('ready')
      } catch (error) {
        if (controller.signal.aborted) return
        setState('error')
      }
    }

    loadVideos()
    return () => controller.abort()
  }, [])

  return (
    <div className={`video-experience video-experience-${variant}`}>
      {series.map((channel) => {
        const videos = videosByPlaylist.get(channel.playlistId) ?? []
        return (
          <section className="video-series" key={channel.playlistId} aria-labelledby={`${variant}-${channel.playlistId}`}>
            <div className="video-series-heading">
              <div>
                <h2 id={`${variant}-${channel.playlistId}`}>{channel.name}</h2>
                {variant === 'watch' ? <p>{channel.description}</p> : null}
              </div>
              {variant === 'watch' ? <div className="video-series-links"><ExternalLink href={channel.channelUrl}>View channel →</ExternalLink><ExternalLink href={channel.playlistUrl}>View playlist →</ExternalLink></div> : null}
            </div>
            {state === 'loading' ? <VideoLoadingCards count={videoLimit} /> : null}
            {state === 'error' ? <VideoErrorState channel={channel} /> : null}
            {state === 'ready' && videos.length === 0 ? <VideoEmptyState channel={channel} /> : null}
            {state === 'ready' && videos.length > 0 ? <div className="video-grid">{videos.slice(0, videoLimit).map((video) => <VideoCard key={video.id} video={video} channelName={channel.name} showDescription={variant === 'home'} titleInThumbnail={variant === 'home'} />)}</div> : null}
          </section>
        )
      })}
    </div>
  )
}

function VideoCard({ video, channelName, showDescription, titleInThumbnail }: { video: Video; channelName: string; showDescription: boolean; titleInThumbnail: boolean }) {
  return <a className="video-card" href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title} from ${channelName} on YouTube`}>
    {video.thumbnail ? <img src={video.thumbnail} alt="" /> : <div className="video-thumbnail-fallback" aria-hidden="true" />}
    <div className="video-card-copy">
      {!titleInThumbnail ? <h3>{video.title}</h3> : null}
      {showDescription && video.description ? <p className="video-card-description">{video.description}</p> : null}
      <span className="video-card-link">Watch on YouTube <span aria-hidden="true">→</span></span>
      <p className="meta">{video.publishedAt}</p>
    </div>
  </a>
}

function VideoLoadingCards({ count }: { count: number }) {
  return <div className="video-grid" aria-label="Loading videos" aria-busy="true">{Array.from({ length: count }, (_, index) => <div className="video-card video-card-loading" key={index}><div /><div><span /><span /><span /></div></div>)}</div>
}

function VideoErrorState({ channel }: { channel: VideoSeries }) {
  return <p className="video-message">Videos are unavailable right now. <ExternalLink href={channel.channelUrl}>Visit the channel on YouTube →</ExternalLink></p>
}

function VideoEmptyState({ channel }: { channel: VideoSeries }) {
  return <p className="video-message">No videos are available in this series yet. <ExternalLink href={channel.playlistUrl}>View playlist →</ExternalLink></p>
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
}
