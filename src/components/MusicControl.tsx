import { Music2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { loveStory } from '../config/loveStory'
import type { useMusic } from '../hooks/useMusic'

export function MusicControl({ music }: { music: ReturnType<typeof useMusic> }) {
  if (!loveStory.music.enabled) return null
  return <div className="music-control"><Music2 size={14} /><span>{music.unavailable ? 'Music unavailable' : music.playing ? (music.muted ? 'Sound muted' : 'Our soundtrack') : 'A little music?'}</span><button className="icon-button" aria-label={music.playing ? 'Pause music' : 'Play music'} title={music.unavailable ? 'Add your song to public/music/our-song.mp3' : music.playing ? 'Pause music' : 'Play music'} onClick={music.toggle}>{music.playing ? <Pause size={14} /> : <Play size={14} />}</button><button className="icon-button" aria-label={music.muted ? 'Unmute music' : 'Mute music'} title={music.muted ? 'Unmute music' : 'Mute music'} onClick={music.toggleMute}>{music.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button><span className="sr-only" role="status">{music.attempted && music.unavailable ? 'The soundtrack is not available. You can still enjoy the story.' : ''}</span></div>
}