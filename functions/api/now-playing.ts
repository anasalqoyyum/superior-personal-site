interface Env {
  SPOTIFY_CLIENT_ID: string
  SPOTIFY_CLIENT_SECRET: string
  SPOTIFY_REFRESH_TOKEN: string
}

interface SpotifyTokenResponse {
  access_token: string
}

interface SpotifyTrack {
  name: string
  artists: Array<{ name: string }>
  album: { name: string; images: Array<{ url: string }> }
  external_urls: { spotify: string }
}

interface CurrentlyPlayingResponse {
  is_playing: boolean
  item: SpotifyTrack | null
}

interface RecentlyPlayedResponse {
  items: Array<{ track: SpotifyTrack }>
}

interface NowPlayingResult {
  isPlaying: boolean
  title: string
  artist: string
  album: string
  albumImageUrl: string
  songUrl: string
}

async function getAccessToken(env: Env): Promise<string> {
  const creds = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`)
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  })
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`)
  const data = (await res.json()) as SpotifyTokenResponse
  return data.access_token
}

function trackToResult(track: SpotifyTrack, isPlaying: boolean): NowPlayingResult {
  return {
    isPlaying,
    title: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    album: track.album.name,
    albumImageUrl: track.album.images[0]?.url ?? '',
    songUrl: track.external_urls.spotify,
  }
}

export async function onRequest(context: { env: Env }): Promise<Response> {
  const { env } = context

  if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET || !env.SPOTIFY_REFRESH_TOKEN) {
    return new Response(null, { status: 500 })
  }

  try {
    const token = await getAccessToken(env)
    const headers = { Authorization: `Bearer ${token}` }

    const currentRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers,
    })

    if (currentRes.status === 200) {
      const current = (await currentRes.json()) as CurrentlyPlayingResponse
      if (current.item) {
        return Response.json(trackToResult(current.item, current.is_playing), {
          headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
        })
      }
    }

    // Nothing currently playing — fall back to recently played
    const recentRes = await fetch(
      'https://api.spotify.com/v1/me/player/recently-played?limit=1',
      { headers },
    )

    if (recentRes.ok) {
      const recent = (await recentRes.json()) as RecentlyPlayedResponse
      const track = recent.items[0]?.track
      if (track) {
        return Response.json(trackToResult(track, false), {
          headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=30' },
        })
      }
    }

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
