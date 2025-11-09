import { useState, useEffect, useRef } from 'react';
import type { AudioConfig, MusicTrack } from '@/types/audio-config';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AudioPlayerProps {
  config: AudioConfig;
  onConfigChange: (config: AudioConfig) => void;
}

export const AudioPlayer = ({ config, onConfigChange }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = config.music.tracks[config.music.currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = config.music.masterVolume;
    }
  }, [config.music.masterVolume]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.loop = currentTrack.loop;
      if (config.music.enabled && isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, config.music.enabled]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    const nextIndex = (config.music.currentTrackIndex + 1) % config.music.tracks.length;
    onConfigChange({
      ...config,
      music: {
        ...config.music,
        currentTrackIndex: nextIndex
      }
    });
  };

  const handlePrevious = () => {
    const prevIndex =
      config.music.currentTrackIndex === 0
        ? config.music.tracks.length - 1
        : config.music.currentTrackIndex - 1;
    onConfigChange({
      ...config,
      music: {
        ...config.music,
        currentTrackIndex: prevIndex
      }
    });
  };

  const handleVolumeChange = (value: number[]) => {
    onConfigChange({
      ...config,
      music: {
        ...config.music,
        masterVolume: value[0]
      }
    });
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!config.music.enabled || config.music.tracks.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Music Player
        </CardTitle>
        <CardDescription>
          {currentTrack ? currentTrack.name : 'Nessuna traccia selezionata'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleNext}
        />

        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={config.music.tracks.length <= 1}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="icon"
              onClick={handlePlayPause}
              className="w-12 h-12"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={config.music.tracks.length <= 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMuteToggle}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
              <div className="flex-1">
                <Label className="text-sm">Volume: {Math.round(config.music.masterVolume * 100)}%</Label>
                <Slider
                  value={[config.music.masterVolume]}
                  onValueChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.01}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
